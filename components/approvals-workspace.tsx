"use client";

import { useRef, useMemo, useState } from "react";
import { Link, Paperclip, X } from "lucide-react";
import { applyContentOverrides } from "@/lib/client-overrides";
import { statusTone } from "@/lib/utils";
import type { Approval, Comment, ContentItem, User } from "@/lib/types";

export function ApprovalsWorkspace({
  initialApprovals,
  contentItems,
  users,
  comments
}: {
  initialApprovals: Approval[];
  contentItems: ContentItem[];
  users: User[];
  comments: Comment[];
}) {
  const allContentItems = applyContentOverrides(contentItems);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState({
    contentItemId: allContentItems[0]?.id ?? "",
    designStatus: "Needs brief",
    reviewerId: users[0]?.id ?? "",
    requestedEdits: "",
    approvalToggle: false,
    versionLabel: "v1",
    links: [] as string[],
    images: [] as string[]
  });
  const [linkInput, setLinkInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => approvals.filter((approval) => !filter || approval.designStatus === filter), [approvals, filter]);

  function addLink() {
    const url = linkInput.trim();
    if (!url) return;
    setDraft((d) => ({ ...d, links: [...d.links, url] }));
    setLinkInput("");
  }

  function removeLink(index: number) {
    setDraft((d) => ({ ...d, links: d.links.filter((_, i) => i !== index) }));
  }

  function handleImageFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setDraft((d) => ({ ...d, images: [...d.images, dataUrl] }));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setDraft((d) => ({ ...d, images: d.images.filter((_, i) => i !== index) }));
  }

  async function createApproval(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const record = (await response.json()) as Approval;
    setApprovals((current) => [record, ...current]);
    setDraft((d) => ({ ...d, links: [], images: [] }));
    setLinkInput("");
  }

  async function toggleApproval(approval: Approval) {
    const response = await fetch("/api/approvals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...approval,
        approvalToggle: !approval.approvalToggle,
        designStatus: !approval.approvalToggle ? "Approved" : "Revision requested"
      })
    });
    const updated = (await response.json()) as Approval;
    setApprovals((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.8fr]">
      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-bark">Design feedback and approvals</h3>
            <p className="mt-1 text-sm text-stone-600">Keep review simple: linked content, requested edits, comments, and a single approval toggle.</p>
          </div>
          <select className="field max-w-52" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All approval statuses</option>
            {["Needs brief", "In progress", "Ready for review", "Revision requested", "Approved"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="space-y-4">
          {filtered.map((approval) => {
            const item = contentItems.find((contentItem) => contentItem.id === approval.contentItemId);
            const reviewer = users.find((user) => user.id === approval.reviewerId);
            const approvalComments = comments.filter((comment) => comment.approvalId === approval.id);

            return (
              <div key={approval.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-bark">{item?.title ?? "Linked content removed"}</p>
                    <p className="mt-1 text-sm text-stone-600">Reviewer: {reviewer?.name ?? "Unknown"} · {approval.versionLabel}</p>
                  </div>
                  <span className={`badge ${statusTone(approval.designStatus)}`}>{approval.designStatus}</span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Requested edits</p>
                    <p className="mt-2 text-sm text-stone-700">{approval.requestedEdits || "No edit notes yet."}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Comments</p>
                    <div className="mt-2 space-y-2">
                      {approvalComments.length ? approvalComments.map((comment) => (
                        <div key={comment.id} className="rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-700">{comment.body}</div>
                      )) : <p className="text-sm text-stone-500">No comments logged.</p>}
                    </div>
                  </div>
                </div>
                {(approval.links?.length || approval.images?.length) ? (
                  <div className="mt-4 space-y-3">
                    {approval.links?.length ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Review links</p>
                        <div className="mt-2 space-y-1">
                          {approval.links.map((link, i) => (
                            <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-moss underline hover:opacity-80 truncate">
                              <Link className="h-3 w-3 shrink-0" />{link}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {approval.images?.length ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Attachments</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {approval.images.map((src, i) => (
                            <img key={i} src={src} alt={`attachment ${i + 1}`} className="h-24 w-24 rounded-xl object-cover border border-stone-100" />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-stone-500">Updated {approval.updatedAt}</p>
                  <button className={approval.approvalToggle ? "btn-secondary" : "btn-primary"} onClick={() => toggleApproval(approval)}>
                    {approval.approvalToggle ? "Mark revision needed" : "Approve version"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-bark">New approval request</h3>
        <form className="mt-5 space-y-3" onSubmit={createApproval}>
          <select className="field" value={draft.contentItemId} onChange={(e) => setDraft({ ...draft, contentItemId: e.target.value })}>
            <option value="">Select content item</option>
            {allContentItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <select className="field" value={draft.designStatus} onChange={(e) => setDraft({ ...draft, designStatus: e.target.value })}>
            {["Needs brief", "In progress", "Ready for review", "Revision requested", "Approved"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input className="field" value={draft.versionLabel} onChange={(e) => setDraft({ ...draft, versionLabel: e.target.value })} placeholder="Version label" />
          <textarea className="field min-h-32" value={draft.requestedEdits} onChange={(e) => setDraft({ ...draft, requestedEdits: e.target.value })} placeholder="Requested edits" />

          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-700">Review links</p>
            <div className="flex gap-2">
              <input className="field flex-1" placeholder="Paste URL to review" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }} />
              <button type="button" className="btn-secondary shrink-0" onClick={addLink}>Add</button>
            </div>
            {draft.links.length > 0 && (
              <div className="space-y-1">
                {draft.links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2 text-sm">
                    <Link className="h-3 w-3 shrink-0 text-stone-400" />
                    <span className="flex-1 truncate text-stone-700">{link}</span>
                    <button type="button" onClick={() => removeLink(i)}><X className="h-3 w-3 text-stone-400 hover:text-rose-500" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-700">Images</p>
            <button type="button" className="btn-secondary flex w-full items-center justify-center gap-2" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4" /> Upload images
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(e.target.files)} />
            {draft.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {draft.images.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt={`upload ${i + 1}`} className="h-20 w-20 rounded-xl object-cover border border-stone-100" />
                    <button type="button" className="absolute -right-1 -top-1 rounded-full bg-white shadow p-0.5" onClick={() => removeImage(i)}>
                      <X className="h-3 w-3 text-stone-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-primary w-full">Create approval request</button>
        </form>
      </section>
    </div>
  );
}
