import { CalendarWorkspace } from "@/components/calendar-workspace";
import { PageHeader } from "@/components/page-header";
import { getCalendarEvents, getCampaigns, getContentItems, getUsers } from "@/lib/repository";

export default async function CalendarPage() {
  const [events, users, contentItems, campaigns] = await Promise.all([
    getCalendarEvents(),
    getUsers(),
    getContentItems(),
    getCampaigns()
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 · Build"
        title="Marketing calendar"
        description="Use the month view by default, switch to a week snapshot, and drag scheduled work between dates when plans shift."
      />
      <CalendarWorkspace initialEvents={events} users={users} contentItems={contentItems} campaigns={campaigns} />
    </div>
  );
}
