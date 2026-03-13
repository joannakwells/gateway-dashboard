import { ApprovalsWorkspace } from "@/components/approvals-workspace";
import { PageHeader } from "@/components/page-header";
import { getApprovals, getComments, getContentItems, getUsers } from "@/lib/repository";

export default async function ApprovalsPage() {
  const [approvals, contentItems, users, comments] = await Promise.all([
    getApprovals(),
    getContentItems(),
    getUsers(),
    getComments()
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 · Build"
        title="Design feedback and approvals"
        description="Track linked content items, reviewer ownership, requested edits, version history, comments, and the final approval toggle."
      />
      <ApprovalsWorkspace initialApprovals={approvals} contentItems={contentItems} users={users} comments={comments} />
    </div>
  );
}
