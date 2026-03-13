"use client";

import { useState } from "react";
import type { WikiPage } from "@/lib/types";

export function WikiDetail({ page, pages }: { page: WikiPage; pages: WikiPage[] }) {
  const [draft, setDraft] = useState(page);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const response = await fetch(`/api/wiki/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });
      const saved = await response.json() as WikiPage;
      setDraft(saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="panel p-6">
        <div className="grid gap-4">
          <input className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <input className="field" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <select className="field" value={draft.parentId ?? ""} onChange={(e) => setDraft({ ...draft, parentId: e.target.value || undefined })}>
            <option value="">Top level page</option>
            {pages.filter((item) => item.id !== page.id).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <input className="field" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
          <textarea className="field min-h-[420px]" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
        </div>
        <div className="mt-5 flex justify-end">
          <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save page"}</button>
        </div>
      </section>
      <aside className="panel p-5">
        <h3 className="text-lg font-semibold text-bark">Page context</h3>
        <p className="mt-3 text-sm text-stone-600">Use nested pages for brand standards, recurring operational notes, workshop templates, and SOPs that non-technical staff can update inline.</p>
        <div className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
          <p>Last updated {page.updatedAt}</p>
          <p className="mt-2">Parent: {pages.find((item) => item.id === page.parentId)?.title ?? "Top level"}</p>
        </div>
      </aside>
    </div>
  );
}
