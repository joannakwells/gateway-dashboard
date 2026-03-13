import type {
  Approval,
  CalendarEvent,
  Campaign,
  Comment,
  ContentItem,
  Task,
  User,
  WikiPage
} from "@/lib/types";

export const users: User[] = [
  { id: "u1", name: "Lena Hart", email: "lena@gatewaygarden.com", role: "owner", avatar: "LH" },
  { id: "u2", name: "Maya Brooks", email: "maya@gatewaygarden.com", role: "marketing_manager", avatar: "MB" },
  { id: "u3", name: "Theo Price", email: "theo@gatewaygarden.com", role: "designer", avatar: "TP" },
  { id: "u4", name: "Erin Cole", email: "erin@gatewaygarden.com", role: "staff", avatar: "EC" }
];

export const campaigns: Campaign[] = [
  { id: "c1", name: "Spring Opening Campaign", theme: "Fresh arrivals and kickoff offers", startDate: "2026-03-16", endDate: "2026-04-06", ownerId: "u2" },
  { id: "c2", name: "Workshop Season", theme: "Classes, registrations, and in-store events", startDate: "2026-03-10", endDate: "2026-05-30", ownerId: "u2" }
];

export const contentItems: ContentItem[] = [
  {
    id: "ci1",
    title: "Fruit Tree Arrival Newsletter",
    status: "Drafting",
    contentType: "Email",
    campaignId: "c1",
    ownerId: "u2",
    dueDate: "2026-03-18",
    priority: "High",
    channel: "Email",
    brief: "Announce early fruit tree inventory with urgency and planting tips.",
    copy: "Highlight apple, peach, and cherry arrivals with CTA to visit this weekend.",
    pricingDetails: "Buy 2 fruit trees, save 15%.",
    notes: "Need updated nursery availability list from staff.",
    attachmentPlaceholder: "Photo selects pending",
    approvalStatus: "In progress",
    archived: false,
    scheduledDate: "2026-03-20",
    updatedAt: "2026-03-12"
  },
  {
    id: "ci2",
    title: "Seed Starting Workshop",
    status: "In review",
    contentType: "Event promotion",
    campaignId: "c2",
    ownerId: "u2",
    dueDate: "2026-03-15",
    priority: "Urgent",
    channel: "Website",
    brief: "Fill remaining seats for Saturday workshop.",
    copy: "Push family-friendly angle, registration cap, and starter tray take-home.",
    pricingDetails: "$25 per attendee, includes materials.",
    notes: "Need final hero image from Theo.",
    attachmentPlaceholder: "Workshop flyer v2",
    approvalStatus: "Ready for review",
    archived: false,
    scheduledDate: "2026-03-14",
    updatedAt: "2026-03-11"
  },
  {
    id: "ci3",
    title: "Houseplant Arrival Promotion",
    status: "Ready for design",
    contentType: "Social post",
    campaignId: "c1",
    ownerId: "u4",
    dueDate: "2026-03-19",
    priority: "Medium",
    channel: "Instagram",
    brief: "Spotlight uncommon tropicals and premium ceramics.",
    copy: "Use carousel format with care tips in final slide.",
    pricingDetails: "Ceramic bundle upsell on featured benches.",
    notes: "Include Monstera Thai Constellation only if shipment clears.",
    attachmentPlaceholder: "Phone photos from greenhouse",
    approvalStatus: "Needs brief",
    archived: false,
    scheduledDate: "2026-03-21",
    updatedAt: "2026-03-10"
  },
  {
    id: "ci4",
    title: "Seasonal Sale Signage",
    status: "In design",
    contentType: "Signage",
    campaignId: "c1",
    ownerId: "u3",
    dueDate: "2026-03-17",
    priority: "High",
    channel: "In-store",
    brief: "Refresh in-store sale signage for spring opening week.",
    copy: "Use concise pricing blocks and premium garden-center tone.",
    pricingDetails: "Annuals 20% off, mulch 4 for $12.",
    notes: "Need print sizes confirmed.",
    attachmentPlaceholder: "8x10, 11x17, endcap signs",
    approvalStatus: "In progress",
    archived: false,
    scheduledDate: "2026-03-17",
    updatedAt: "2026-03-12"
  },
  {
    id: "ci5",
    title: "Website Event Page Update",
    status: "Scheduled",
    contentType: "Website update",
    campaignId: "c2",
    ownerId: "u2",
    dueDate: "2026-03-13",
    priority: "Medium",
    channel: "Website",
    brief: "Publish workshop details page and registration link.",
    copy: "Include map, FAQs, and refund policy.",
    pricingDetails: "",
    notes: "Eventbrite link approved.",
    attachmentPlaceholder: "Screenshot placeholder",
    approvalStatus: "Approved",
    archived: false,
    scheduledDate: "2026-03-13",
    updatedAt: "2026-03-12"
  }
];

export const tasks: Task[] = [
  { id: "t1", title: "Collect fruit tree inventory counts", contentItemId: "ci1", assignedUserId: "u4", dueDate: "2026-03-13", status: "In progress", notes: "Need final count by noon." },
  { id: "t2", title: "Finalize workshop hero image", contentItemId: "ci2", assignedUserId: "u3", dueDate: "2026-03-12", status: "Blocked", notes: "Waiting on crop from photographer." },
  { id: "t3", title: "Approve spring signage price grid", contentItemId: "ci4", assignedUserId: "u1", dueDate: "2026-03-14", status: "To do", notes: "Verify mulch promo before print." },
  { id: "t4", title: "Update greenhouse endcap display", assignedUserId: "u4", dueDate: "2026-03-11", status: "Done", notes: "Completed with new pottery set." }
];

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Fruit Tree Newsletter Send", date: "2026-03-20", ownerId: "u2", channel: "Email", status: "Scheduled", contentItemId: "ci1", campaignId: "c1" },
  { id: "e2", title: "Seed Starting Workshop", date: "2026-03-22", ownerId: "u2", channel: "Website", status: "Approved", contentItemId: "ci2", campaignId: "c2" },
  { id: "e3", title: "Houseplant Carousel", date: "2026-03-21", ownerId: "u4", channel: "Instagram", status: "Ready for design", contentItemId: "ci3", campaignId: "c1" },
  { id: "e4", title: "Spring Opening Weekend", date: "2026-03-28", ownerId: "u1", channel: "In-store", status: "Planned", campaignId: "c1" }
];

export const approvals: Approval[] = [
  { id: "a1", contentItemId: "ci2", designStatus: "Ready for review", reviewerId: "u1", requestedEdits: "Tighten registration CTA and swap second image.", approvalToggle: false, versionLabel: "v2", updatedAt: "2026-03-12T09:30:00.000Z" },
  { id: "a2", contentItemId: "ci4", designStatus: "In progress", reviewerId: "u1", requestedEdits: "Need final price confirmation.", approvalToggle: false, versionLabel: "v1", updatedAt: "2026-03-11T15:00:00.000Z" },
  { id: "a3", contentItemId: "ci5", designStatus: "Approved", reviewerId: "u1", requestedEdits: "Approved for publish.", approvalToggle: true, versionLabel: "v1", updatedAt: "2026-03-12T08:00:00.000Z" }
];

export const comments: Comment[] = [
  { id: "cm1", approvalId: "a1", authorId: "u1", body: "Please make the date and seat count more prominent.", createdAt: "2026-03-12T09:31:00.000Z" },
  { id: "cm2", contentItemId: "ci1", authorId: "u4", body: "Nursery team can confirm final counts after truck unload.", createdAt: "2026-03-11T16:15:00.000Z" }
];

export const wikiPages: WikiPage[] = [
  { id: "w1", title: "Brand Voice Notes", slug: "brand-voice-notes", summary: "Premium, warm, practical tone guidelines.", body: "Write with confidence, warmth, and local expertise. Keep copy concise and helpful. Avoid bargain-bin language.", updatedAt: "2026-03-10" },
  { id: "w2", title: "Promo Guidelines", slug: "promo-guidelines", parentId: "w1", summary: "How Gateway frames offers and urgency.", body: "Lead with product value first, offer second. Always include redemption window and exclusions in signage.", updatedAt: "2026-03-09" },
  { id: "w3", title: "Seasonal Dates", slug: "seasonal-dates", summary: "Key retail and event dates by season.", body: "Spring opening: March 28. Mother's Day gift push starts April 20. Fall mums launch August 25.", updatedAt: "2026-03-08" },
  { id: "w4", title: "Newsletter Structure", slug: "newsletter-structure", summary: "Default email layout for weekly sends.", body: "Subject line, seasonal hero, three featured blocks, workshop/event card, footer with store hours.", updatedAt: "2026-03-07" }
];
