# Gateway Garden Center Workspace MVP

## App sitemap

- `/` Dashboard
- `/content` Content Hub
- `/content/[id]` Content detail page
- `/calendar` Marketing Calendar
- `/approvals` Design Feedback and Approvals
- `/tasks` Task Management
- `/wiki` Internal Wiki
- `/wiki/[id]` Wiki detail page
- `/login` Email login scaffold

## Feature map by page

### Dashboard
- Upcoming deadlines
- This week's content tasks
- Pending approvals
- Recently updated items
- Marketing calendar preview
- Quick actions for content, calendar, approval, and wiki creation

### Content Hub
- Central content table with search and filters
- Inline creation form
- Detail pages for editing content fields
- Deletion from table

### Marketing Calendar
- Month view default and week view toggle
- Date click to prefill creation form
- Drag and drop scheduled events between dates
- Filters by owner, channel, status, and campaign

### Approvals
- Linked content item view
- Reviewer, requested edits, comments, version label
- Approval toggle
- Create new approval requests

### Tasks
- Table view
- Kanban board
- My tasks
- Overdue tasks
- Create and update task status

### Internal Wiki
- Search
- Nested pages via parent-child relationship
- Page creation and detail editing

## Database schema

### Tables
- `users`
- `campaigns`
- `content_items`
- `tasks`
- `calendar_events`
- `approvals`
- `wiki_pages`
- `comments`

### Key relationships
- `content_items.owner_id -> users.id`
- `content_items.campaign_id -> campaigns.id`
- `tasks.content_item_id -> content_items.id`
- `tasks.assigned_user_id -> users.id`
- `calendar_events.content_item_id -> content_items.id`
- `calendar_events.owner_id -> users.id`
- `calendar_events.campaign_id -> campaigns.id`
- `approvals.content_item_id -> content_items.id`
- `approvals.reviewer_id -> users.id`
- `comments.content_item_id -> content_items.id`
- `comments.approval_id -> approvals.id`
- `comments.author_id -> users.id`
- `wiki_pages.parent_id -> wiki_pages.id`

## User roles

- `owner`: leadership approvals and campaign visibility
- `marketing_manager`: content planning, calendar management, approvals coordination
- `designer`: design execution and revision handling
- `staff`: contributes promos, pricing, events, and inventory updates

## Component list

- `AppShell`
- `PageHeader`
- `StatCard`
- `EmptyState`
- `DashboardOverview`
- `ContentHub`
- `ContentDetail`
- `CalendarWorkspace`
- `ApprovalsWorkspace`
- `TaskWorkspace`
- `WikiWorkspace`
- `WikiDetail`
- `LoginForm`

## Suggested folder structure

```text
app/
  api/
  approvals/
  calendar/
  content/
  login/
  tasks/
  wiki/
components/
lib/
  repository.ts
  seed.ts
  store.ts
  supabase.ts
  types.ts
supabase/
  schema.sql
docs/
  planning.md
```
