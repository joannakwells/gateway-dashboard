"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { WikiPage } from "@/lib/types";

export function WikiWorkspace({ initialPages }: { initialPages: WikiPage[] }) {
  const [pages, setPages] = useState(initialPages);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({
    title: "",
    slug: "",
    parentId: "",
    summary: "",
    body: ""
  });

  const filtered = useMemo(
    () => pages.filter((page) => `${page.title} ${page.summary} ${page.body}`.toLowerCase().includes(query.toLowerCase())),
    [pages, query]
  );

  async function createPage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/wiki", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        parentId: draft.parentId || undefined,
        slug: draft.slug || draft.title.toLowerCase().replaceAll(" ", "-")
      })
    });
    const record = (await response.json()) as WikiPage;
    setPages((current) => [record, ...current]);
    setDraft({ title: "", slug: "", parentId: "", summary: "", body: "" });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="panel p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="field pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search SOPs, guidelines, templates, or dates" />
        </div>
        <div className="mt-5 space-y-3">
          {filtered.map((page) => {
            const parent = pages.find((item) => item.id === page.parentId);
            return (
              <Link key={page.id} href={`/wiki/${page.id}`} className="block rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4 transition hover:bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-bark">{page.title}</p>
                    <p className="mt-1 text-sm text-stone-600">{page.summary}</p>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    {parent ? <p>Nested under {parent.title}</p> : <p>Top level</p>}
                    <p className="mt-1">Updated {page.updatedAt}</p>
                  </div>
                </div>
              </Link>
            );
          })}
          {!filtered.length ? <div className="rounded-2xl border border-dashed border-stone-200 p-8 text-center text-sm text-stone-500">No wiki pages matched your search.</div> : null}
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-bark">New wiki page</h3>
        <p className="mt-1 text-sm text-stone-600">Use nested pages for standards, SOPs, workshop templates, and recurring reference material.</p>
        <form className="mt-5 space-y-3" onSubmit={createPage}>
          <input className="field" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <input className="field" placeholder="Slug (optional)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <select className="field" value={draft.parentId} onChange={(e) => setDraft({ ...draft, parentId: e.target.value })}>
            <option value="">Top level page</option>
            {pages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}
          </select>
          <input className="field" placeholder="Summary" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
          <textarea className="field min-h-40" placeholder="Page body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <button className="btn-primary w-full">Create page</button>
        </form>
      </section>
    </div>
  );
}
