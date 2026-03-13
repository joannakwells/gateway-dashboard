"use client";

import { useState } from "react";
import type { Campaign, Comment, ContentItem, Task, User } from "@/lib/types";

export function ContentDetail({
  item,
  users,
  campaigns,
  relatedTasks,
  comments
}: {
  item: ContentItem;
  users: User[];
  campaigns: Campaign[];
  relatedTasks: Task[];
  comments: Comment[];
}) {
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const response = await fetch(`/api/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });
      const saved = await response.json() as typeof draft;
      setDraft(saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="panel p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-stone-700">Title</span>
            <input className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Status</span>
            <select className="field" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ContentItem["status"] })}>
              {["Idea", "Drafting", "Awaiting internal info", "Ready for design", "In design", "In review", "Approved", "Scheduled", "Published", "Archived"].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Approval status</span>
            <select className="field" value={draft.approvalStatus} onChange={(e) => setDraft({ ...draft, approvalStatus: e.target.value as ContentItem["approvalStatus"] })}>
              {["Needs brief", "In progress", "Ready for review", "Revision requested", "Approved"].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Campaign</span>
            <select className="field" value={draft.campaignId ?? ""} onChange={(e) => setDraft({ ...draft, campaignId: e.target.value || undefined })}>
              <option value="">No campaign</option>
              {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Owner</span>
            <input className="field" placeholder="Owner name" value={draft.ownerName ?? ""} onChange={(e) => setDraft({ ...draft, ownerName: e.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Due date</span>
            <input className="field" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Scheduled date</span>
            <input className="field" type="date" value={draft.scheduledDate ?? ""} onChange={(e) => setDraft({ ...draft, scheduledDate: e.target.value || undefined })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Priority</span>
            <select className="field" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as ContentItem["priority"] })}>
              {["Low", "Medium", "High", "Urgent"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Channel</span>
            <select className="field" value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value as ContentItem["channel"] })}>
              {["Email", "Instagram", "Facebook", "Website", "In-store", "Print"].map((channel) => <option key={channel} value={channel}>{channel}</option>)}
            </select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-stone-700">Brief / objective</span>
            <textarea className="field min-h-28" value={draft.brief} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-stone-700">Copy / messaging</span>
            <textarea className="field min-h-36" value={draft.copy} onChange={(e) => setDraft({ ...draft, copy: e.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Pricing / promotion details</span>
            <input className="field" value={draft.pricingDetails} onChange={(e) => setDraft({ ...draft, pricingDetails: e.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">Attachment placeholder</span>
            <input className="field" value={draft.attachmentPlaceholder} onChange={(e) => setDraft({ ...draft, attachmentPlaceholder: e.target.value })} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-stone-700">Additional notes</span>
            <textarea className="field min-h-28" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold text-bark">Linked tasks</h3>
          <div className="mt-4 space-y-3">
            {relatedTasks.length ? relatedTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3">
                <p className="font-medium text-bark">{task.title}</p>
                <p className="mt-1 text-sm text-stone-600">{task.status} · Due {task.dueDate}</p>
              </div>
            )) : <p className="text-sm text-stone-500">No linked tasks yet.</p>}
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="text-lg font-semibold text-bark">Comments</h3>
          <div className="mt-4 space-y-3">
            {comments.length ? comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-stone-100 bg-white px-4 py-3">
                <p className="text-sm text-bark">{comment.body}</p>
                <p className="mt-2 text-xs text-stone-500">{comment.createdAt}</p>
              </div>
            )) : <p className="text-sm text-stone-500">No comments yet.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
