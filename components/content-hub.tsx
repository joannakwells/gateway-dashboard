"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { formatDate, statusTone } from "@/lib/utils";
import type { Campaign, ContentItem, User } from "@/lib/types";

interface Props {
  initialItems: ContentItem[];
  users: User[];
  campaigns: Campaign[];
}

const defaultItem = {
  title: "",
  status: "Idea",
  contentType: "Email",
  campaignId: "",
  ownerId: "",
  ownerName: "",
  dueDate: "2026-03-12",
  priority: "Medium",
  channel: "Email",
  brief: "",
  copy: "",
  pricingDetails: "",
  notes: "",
  attachmentPlaceholder: "",
  approvalStatus: "Needs brief",
  archived: false,
  scheduledDate: "2026-03-12"
};

export function ContentHub({ initialItems, users, campaigns }: Props) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [draft, setDraft] = useState({ ...defaultItem });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.brief.toLowerCase().includes(query.toLowerCase());
      const matchOwner = !ownerFilter || item.ownerId === ownerFilter;
      const matchStatus = !statusFilter || item.status === statusFilter;
      const matchChannel = !channelFilter || item.channel === channelFilter;
      return matchQuery && matchOwner && matchStatus && matchChannel;
    });
  }, [items, query, ownerFilter, statusFilter, channelFilter]);

  async function createItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const item = (await response.json()) as ContentItem;
    setItems((current) => [item, ...current]);
    setDraft({ ...defaultItem });
    setSaving(false);
  }

  async function removeItem(id: string) {
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 px-5 py-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input className="field pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search content, briefs, or campaign ideas" />
          </div>
          <select className="field max-w-44" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value="">All owners</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <select className="field max-w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {[...new Set(items.map((item) => item.status))].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select className="field max-w-44" value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
            <option value="">All channels</option>
            {[...new Set(items.map((item) => item.channel))].map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-stone-100">
                  <td className="px-5 py-4">
                    <Link href={`/content/${item.id}`} className="font-medium text-bark">{item.title}</Link>
                    <p className="mt-1 max-w-sm text-xs text-stone-500">{item.brief}</p>
                  </td>
                  <td className="px-5 py-4"><span className={`badge ${statusTone(item.status)}`}>{item.status}</span></td>
                  <td className="px-5 py-4">{item.contentType}</td>
                  <td className="px-5 py-4">{item.ownerName || (users.find((user) => user.id === item.ownerId)?.name ?? "—")}</td>
                  <td className="px-5 py-4">{formatDate(item.dueDate)}</td>
                  <td className="px-5 py-4">{item.channel}</td>
                  <td className="px-5 py-4"><span className={`badge ${statusTone(item.priority)}`}>{item.priority}</span></td>
                  <td className="px-5 py-4">
                    <button className="text-stone-500 transition hover:text-rose-600" onClick={() => removeItem(item.id)} aria-label={`Delete ${item.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-stone-500">No content items match the current filters.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-bark">New content item</h3>
        <p className="mt-1 text-sm text-stone-600">Create from the same view your team uses to plan and review work.</p>
        <form className="mt-5 space-y-3" onSubmit={createItem}>
          <input className="field" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <div className="grid gap-3 md:grid-cols-2">
            <select className="field" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
              {["Idea", "Drafting", "Awaiting internal info", "Ready for design", "In design", "In review", "Approved", "Scheduled", "Published", "Archived"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select className="field" value={draft.contentType} onChange={(e) => setDraft({ ...draft, contentType: e.target.value })}>
              {["Email", "Social post", "Website update", "Signage", "Event promotion", "Print piece", "Ad", "Announcement"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select className="field" value={draft.campaignId} onChange={(e) => setDraft({ ...draft, campaignId: e.target.value })}>
              <option value="">No campaign</option>
              {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
            </select>
            <input className="field" placeholder="Owner name" value={draft.ownerName} onChange={(e) => setDraft({ ...draft, ownerName: e.target.value })} />
            <input className="field" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
            <select className="field" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
              {["Low", "Medium", "High", "Urgent"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </div>
          <select className="field" value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value })}>
            {["Email", "Instagram", "Facebook", "Website", "In-store", "Print"].map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
          <textarea className="field min-h-24" placeholder="Brief / objective" value={draft.brief} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} />
          <textarea className="field min-h-24" placeholder="Copy / messaging" value={draft.copy} onChange={(e) => setDraft({ ...draft, copy: e.target.value })} />
          <input className="field" placeholder="Pricing / promotion details" value={draft.pricingDetails} onChange={(e) => setDraft({ ...draft, pricingDetails: e.target.value })} />
          <input className="field" placeholder="Attachment placeholder" value={draft.attachmentPlaceholder} onChange={(e) => setDraft({ ...draft, attachmentPlaceholder: e.target.value })} />
          <textarea className="field min-h-24" placeholder="Additional notes" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Create content item"}</button>
        </form>
      </section>
    </div>
  );
}
