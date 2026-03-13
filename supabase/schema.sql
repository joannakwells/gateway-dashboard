create extension if not exists "pgcrypto";

create table if not exists users (
  id text primary key,
  name text not null,
  email text unique not null,
  role text not null check (role in ('owner', 'marketing_manager', 'designer', 'staff')),
  avatar text not null,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id text primary key,
  name text not null,
  theme text not null,
  start_date date not null,
  end_date date not null,
  owner_id text not null references users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists content_items (
  id text primary key,
  title text not null,
  status text not null check (status in ('Idea', 'Drafting', 'Awaiting internal info', 'Ready for design', 'In design', 'In review', 'Approved', 'Scheduled', 'Published', 'Archived')),
  content_type text not null check (content_type in ('Email', 'Social post', 'Website update', 'Signage', 'Event promotion', 'Print piece', 'Ad', 'Announcement')),
  campaign_id text references campaigns(id) on delete set null,
  owner_id text not null references users(id) on delete restrict,
  due_date date not null,
  priority text not null check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  channel text not null check (channel in ('Email', 'Instagram', 'Facebook', 'Website', 'In-store', 'Print')),
  brief text not null default '',
  copy text not null default '',
  pricing_details text not null default '',
  notes text not null default '',
  attachment_placeholder text not null default '',
  approval_status text not null check (approval_status in ('Needs brief', 'In progress', 'Ready for review', 'Revision requested', 'Approved')),
  archived boolean not null default false,
  scheduled_date date,
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id text primary key,
  title text not null,
  content_item_id text references content_items(id) on delete set null,
  assigned_user_id text not null references users(id) on delete restrict,
  due_date date not null,
  status text not null check (status in ('To do', 'In progress', 'Blocked', 'Done')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists calendar_events (
  id text primary key,
  title text not null,
  date date not null,
  owner_id text not null references users(id) on delete restrict,
  channel text not null check (channel in ('Email', 'Instagram', 'Facebook', 'Website', 'In-store', 'Print')),
  status text not null,
  content_item_id text references content_items(id) on delete set null,
  campaign_id text references campaigns(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id text primary key,
  content_item_id text not null references content_items(id) on delete cascade,
  design_status text not null check (design_status in ('Needs brief', 'In progress', 'Ready for review', 'Revision requested', 'Approved')),
  reviewer_id text not null references users(id) on delete restrict,
  requested_edits text not null default '',
  approval_toggle boolean not null default false,
  version_label text not null default 'v1',
  updated_at timestamptz not null default now()
);

create table if not exists wiki_pages (
  id text primary key,
  title text not null,
  slug text unique not null,
  parent_id text references wiki_pages(id) on delete set null,
  summary text not null default '',
  body text not null default '',
  updated_at date not null default current_date
);

create table if not exists comments (
  id text primary key,
  content_item_id text references content_items(id) on delete cascade,
  approval_id text references approvals(id) on delete cascade,
  author_id text not null references users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  check (content_item_id is not null or approval_id is not null)
);

insert into users (id, name, email, role, avatar) values
  ('u1', 'Lena Hart', 'lena@gatewaygarden.com', 'owner', 'LH'),
  ('u2', 'Maya Brooks', 'maya@gatewaygarden.com', 'marketing_manager', 'MB'),
  ('u3', 'Theo Price', 'theo@gatewaygarden.com', 'designer', 'TP'),
  ('u4', 'Erin Cole', 'erin@gatewaygarden.com', 'staff', 'EC')
on conflict (id) do update set name = excluded.name, email = excluded.email, role = excluded.role, avatar = excluded.avatar;

insert into campaigns (id, name, theme, start_date, end_date, owner_id) values
  ('c1', 'Spring Opening Campaign', 'Fresh arrivals and kickoff offers', '2026-03-16', '2026-04-06', 'u2'),
  ('c2', 'Workshop Season', 'Classes, registrations, and in-store events', '2026-03-10', '2026-05-30', 'u2')
on conflict (id) do update set name = excluded.name, theme = excluded.theme, start_date = excluded.start_date, end_date = excluded.end_date, owner_id = excluded.owner_id;

insert into content_items (id, title, status, content_type, campaign_id, owner_id, due_date, priority, channel, brief, copy, pricing_details, notes, attachment_placeholder, approval_status, archived, scheduled_date, updated_at) values
  ('ci1', 'Fruit Tree Arrival Newsletter', 'Drafting', 'Email', 'c1', 'u2', '2026-03-18', 'High', 'Email', 'Announce early fruit tree inventory with urgency and planting tips.', 'Highlight apple, peach, and cherry arrivals with CTA to visit this weekend.', 'Buy 2 fruit trees, save 15%.', 'Need updated nursery availability list from staff.', 'Photo selects pending', 'In progress', false, '2026-03-20', now()),
  ('ci2', 'Seed Starting Workshop', 'In review', 'Event promotion', 'c2', 'u2', '2026-03-15', 'Urgent', 'Website', 'Fill remaining seats for Saturday workshop.', 'Push family-friendly angle, registration cap, and starter tray take-home.', '$25 per attendee, includes materials.', 'Need final hero image from Theo.', 'Workshop flyer v2', 'Ready for review', false, '2026-03-14', now()),
  ('ci3', 'Houseplant Arrival Promotion', 'Ready for design', 'Social post', 'c1', 'u4', '2026-03-19', 'Medium', 'Instagram', 'Spotlight uncommon tropicals and premium ceramics.', 'Use carousel format with care tips in final slide.', 'Ceramic bundle upsell on featured benches.', 'Include Monstera Thai Constellation only if shipment clears.', 'Phone photos from greenhouse', 'Needs brief', false, '2026-03-21', now()),
  ('ci4', 'Seasonal Sale Signage', 'In design', 'Signage', 'c1', 'u3', '2026-03-17', 'High', 'In-store', 'Refresh in-store sale signage for spring opening week.', 'Use concise pricing blocks and premium garden-center tone.', 'Annuals 20% off, mulch 4 for $12.', 'Need print sizes confirmed.', '8x10, 11x17, endcap signs', 'In progress', false, '2026-03-17', now()),
  ('ci5', 'Website Event Page Update', 'Scheduled', 'Website update', 'c2', 'u2', '2026-03-13', 'Medium', 'Website', 'Publish workshop details page and registration link.', 'Include map, FAQs, and refund policy.', '', 'Eventbrite link approved.', 'Screenshot placeholder', 'Approved', false, '2026-03-13', now())
on conflict (id) do update set
  title = excluded.title,
  status = excluded.status,
  content_type = excluded.content_type,
  campaign_id = excluded.campaign_id,
  owner_id = excluded.owner_id,
  due_date = excluded.due_date,
  priority = excluded.priority,
  channel = excluded.channel,
  brief = excluded.brief,
  copy = excluded.copy,
  pricing_details = excluded.pricing_details,
  notes = excluded.notes,
  attachment_placeholder = excluded.attachment_placeholder,
  approval_status = excluded.approval_status,
  archived = excluded.archived,
  scheduled_date = excluded.scheduled_date,
  updated_at = excluded.updated_at;

insert into tasks (id, title, content_item_id, assigned_user_id, due_date, status, notes) values
  ('t1', 'Collect fruit tree inventory counts', 'ci1', 'u4', '2026-03-13', 'In progress', 'Need final count by noon.'),
  ('t2', 'Finalize workshop hero image', 'ci2', 'u3', '2026-03-12', 'Blocked', 'Waiting on crop from photographer.'),
  ('t3', 'Approve spring signage price grid', 'ci4', 'u1', '2026-03-14', 'To do', 'Verify mulch promo before print.'),
  ('t4', 'Update greenhouse endcap display', null, 'u4', '2026-03-11', 'Done', 'Completed with new pottery set.')
on conflict (id) do update set title = excluded.title, content_item_id = excluded.content_item_id, assigned_user_id = excluded.assigned_user_id, due_date = excluded.due_date, status = excluded.status, notes = excluded.notes;

insert into calendar_events (id, title, date, owner_id, channel, status, content_item_id, campaign_id) values
  ('e1', 'Fruit Tree Newsletter Send', '2026-03-20', 'u2', 'Email', 'Scheduled', 'ci1', 'c1'),
  ('e2', 'Seed Starting Workshop', '2026-03-22', 'u2', 'Website', 'Approved', 'ci2', 'c2'),
  ('e3', 'Houseplant Carousel', '2026-03-21', 'u4', 'Instagram', 'Ready for design', 'ci3', 'c1'),
  ('e4', 'Spring Opening Weekend', '2026-03-28', 'u1', 'In-store', 'Planned', null, 'c1')
on conflict (id) do update set title = excluded.title, date = excluded.date, owner_id = excluded.owner_id, channel = excluded.channel, status = excluded.status, content_item_id = excluded.content_item_id, campaign_id = excluded.campaign_id;

insert into approvals (id, content_item_id, design_status, reviewer_id, requested_edits, approval_toggle, version_label, updated_at) values
  ('a1', 'ci2', 'Ready for review', 'u1', 'Tighten registration CTA and swap second image.', false, 'v2', now()),
  ('a2', 'ci4', 'In progress', 'u1', 'Need final price confirmation.', false, 'v1', now()),
  ('a3', 'ci5', 'Approved', 'u1', 'Approved for publish.', true, 'v1', now())
on conflict (id) do update set content_item_id = excluded.content_item_id, design_status = excluded.design_status, reviewer_id = excluded.reviewer_id, requested_edits = excluded.requested_edits, approval_toggle = excluded.approval_toggle, version_label = excluded.version_label, updated_at = excluded.updated_at;

insert into wiki_pages (id, title, slug, parent_id, summary, body, updated_at) values
  ('w1', 'Brand Voice Notes', 'brand-voice-notes', null, 'Premium, warm, practical tone guidelines.', 'Write with confidence, warmth, and local expertise. Keep copy concise and helpful. Avoid bargain-bin language.', '2026-03-10'),
  ('w2', 'Promo Guidelines', 'promo-guidelines', 'w1', 'How Gateway frames offers and urgency.', 'Lead with product value first, offer second. Always include redemption window and exclusions in signage.', '2026-03-09'),
  ('w3', 'Seasonal Dates', 'seasonal-dates', null, 'Key retail and event dates by season.', 'Spring opening: March 28. Mother''s Day gift push starts April 20. Fall mums launch August 25.', '2026-03-08'),
  ('w4', 'Newsletter Structure', 'newsletter-structure', null, 'Default email layout for weekly sends.', 'Subject line, seasonal hero, three featured blocks, workshop or event card, footer with store hours.', '2026-03-07')
on conflict (id) do update set title = excluded.title, slug = excluded.slug, parent_id = excluded.parent_id, summary = excluded.summary, body = excluded.body, updated_at = excluded.updated_at;

insert into comments (id, content_item_id, approval_id, author_id, body, created_at) values
  ('cm1', null, 'a1', 'u1', 'Please make the date and seat count more prominent.', now()),
  ('cm2', 'ci1', null, 'u4', 'Nursery team can confirm final counts after truck unload.', now())
on conflict (id) do update set content_item_id = excluded.content_item_id, approval_id = excluded.approval_id, author_id = excluded.author_id, body = excluded.body, created_at = excluded.created_at;
