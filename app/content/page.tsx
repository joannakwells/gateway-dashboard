import { ContentHub } from "@/components/content-hub";
import { PageHeader } from "@/components/page-header";
import { getCampaigns, getContentItems, getUsers } from "@/lib/repository";

export default async function ContentPage() {
  const [items, users, campaigns] = await Promise.all([getContentItems(), getUsers(), getCampaigns()]);

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 · Build"
        title="Content hub"
        description="Centralize campaign work, channel planning, approvals, copy, pricing details, and team ownership in one editable database."
      />
      <ContentHub initialItems={items} users={users} campaigns={campaigns} />
    </div>
  );
}
