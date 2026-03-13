# Gateway Garden Center Workspace

Desktop-first internal workspace MVP built with Next.js, TypeScript, Tailwind CSS, and Supabase-oriented data access.

## Setup

1. Install dependencies:
   `npm install`
2. Copy environment variables:
   `cp .env.example .env.local`
3. Add your Supabase project values to `.env.local`.
4. Run the SQL in [`supabase/schema.sql`](/Users/modelfarm/Desktop/Email/supabase/schema.sql) inside the Supabase SQL editor.
5. Start the app:
   `npm run dev`

## Runtime behavior

- If Supabase credentials are present, the app reads and writes against Supabase tables.
- If Supabase credentials are absent, the UI falls back to an in-memory seeded demo dataset so the MVP still renders end-to-end.

## QA checklist

- Dashboard renders deadlines, tasks, approvals, recent items, calendar preview, and quick actions.
- Content Hub supports create, read, update, delete, filters, and search.
- Marketing Calendar supports create and drag-drop rescheduling.
- Approvals support create and approval-state updates.
- Tasks support create, read, update, delete, kanban, my tasks, and overdue views.
- Wiki supports create, nested pages, search, and detail editing.
- Login page scaffolds Supabase magic-link auth.

## Suggested v2

- Role-based route protection and audit history
- Rich text editing for wiki and content copy
- Attachment uploads via Supabase Storage
- Recurring calendar templates for seasonal promotions
- Saved filtered views per role or campaign
