import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { PageHeader } from "@/components/page-header";
import { getCampaigns, getComments, getContentItem, getTasks, getUsers } from "@/lib/repository";

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, users, campaigns, tasks, comments] = await Promise.all([
    getContentItem(id),
    getUsers(),
    getCampaigns(),
    getTasks(),
    getComments()
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Content detail"
        title={item.title}
        description="Edit the full brief, messaging, promotional detail, scheduling, and review status inline."
      />
      <ContentDetail
        item={item}
        users={users}
        campaigns={campaigns}
        relatedTasks={tasks.filter((task) => task.contentItemId === item.id)}
        comments={comments.filter((comment) => comment.contentItemId === item.id)}
      />
    </div>
  );
}
