import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { WikiDetail } from "@/components/wiki-detail";
import { getWikiPage, getWikiPages } from "@/lib/repository";

export default async function WikiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [page, pages] = await Promise.all([getWikiPage(id), getWikiPages()]);
  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Wiki detail"
        title={page.title}
        description="Edit page content inline and place documentation into the correct nested location."
      />
      <WikiDetail page={page} pages={pages} />
    </div>
  );
}
