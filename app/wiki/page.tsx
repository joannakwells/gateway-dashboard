import { PageHeader } from "@/components/page-header";
import { WikiWorkspace } from "@/components/wiki-workspace";
import { getWikiPages } from "@/lib/repository";

export default async function WikiPageIndex() {
  const pages = await getWikiPages();

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 · Build"
        title="Internal wiki"
        description="Store brand voice guidance, promo standards, seasonal dates, workshop templates, newsletter structures, signage standards, and SOPs with nested pages."
      />
      <WikiWorkspace initialPages={pages} />
    </div>
  );
}
