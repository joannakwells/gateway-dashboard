import { DashboardOverview } from "@/components/dashboard-overview";
import { PageHeader } from "@/components/page-header";
import { getDashboardData, getUsers } from "@/lib/repository";

export default async function DashboardPage() {
  const [data, users] = await Promise.all([getDashboardData(), getUsers()]);

  return (
    <div>
      <PageHeader
        eyebrow="Step 1 · Dashboard"
        title="Weekly operating view"
        description="A compact command center for deadlines, upcoming content work, pending approvals, and what changed most recently."
      />
      <DashboardOverview data={data} users={users} />
    </div>
  );
}
