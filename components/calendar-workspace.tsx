"use client";

import { addDays, endOfMonth, endOfWeek, format, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { useMemo, useState } from "react";
import { statusTone } from "@/lib/utils";
import type { CalendarEvent, Campaign, ContentItem, User } from "@/lib/types";

function daysForMonth(dateValue: string) {
  const date = parseISO(dateValue);
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  const days: string[] = [];
  let current = start;
  while (current <= end) {
    days.push(format(current, "yyyy-MM-dd"));
    current = addDays(current, 1);
  }
  return days;
}

function daysForWeek(dateValue: string) {
  const start = startOfWeek(parseISO(dateValue));
  return Array.from({ length: 7 }, (_, index) => format(addDays(start, index), "yyyy-MM-dd"));
}

export function CalendarWorkspace({
  initialEvents,
  users,
  contentItems,
  campaigns
}: {
  initialEvents: CalendarEvent[];
  users: User[];
  contentItems: ContentItem[];
  campaigns: Campaign[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [month, setMonth] = useState("2026-03-01");
  const [view, setView] = useState<"month" | "week">("month");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [draft, setDraft] = useState({
    title: "",
    date: "2026-03-12",
    ownerId: users[1]?.id ?? users[0]?.id ?? "",
    channel: "Website",
    status: "Planned",
    contentItemId: "",
    campaignId: ""
  });

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const matchOwner = !ownerFilter || event.ownerId === ownerFilter;
      const matchChannel = !channelFilter || event.channel === channelFilter;
      const matchStatus = !statusFilter || event.status === statusFilter;
      const matchCampaign = !campaignFilter || event.campaignId === campaignFilter;
      return matchOwner && matchChannel && matchStatus && matchCampaign;
    });
  }, [events, ownerFilter, channelFilter, statusFilter, campaignFilter]);

  const days = useMemo(() => daysForMonth(month), [month]);
  const weekDays = useMemo(() => daysForWeek(draft.date), [draft.date]);
  const activeDays = view === "month" ? days : weekDays;

  async function createEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        contentItemId: draft.contentItemId || undefined,
        campaignId: draft.campaignId || undefined
      })
    });
    const record = (await response.json()) as CalendarEvent;
    setEvents((current) => [record, ...current]);
    setDraft({ ...draft, title: "", contentItemId: "", campaignId: "" });
  }

  async function moveEvent(id: string, date: string) {
    const nextEvent = events.find((event) => event.id === id);
    if (!nextEvent) {
      return;
    }

    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nextEvent, date })
    });
    const updated = (await response.json()) as CalendarEvent;
    setEvents((current) => current.map((event) => (event.id === updated.id ? updated : event)));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
      <section className="space-y-4">
        <div className="panel flex flex-wrap items-center gap-3 p-4">
          <input className="field max-w-44" type="month" value={month.slice(0, 7)} onChange={(e) => setMonth(`${e.target.value}-01`)} />
          <div className="rounded-xl bg-stone-100 p-1">
            <button className={view === "month" ? "btn-primary" : "px-4 py-2 text-sm text-stone-600"} onClick={() => setView("month")}>Month</button>
            <button className={view === "week" ? "btn-primary" : "px-4 py-2 text-sm text-stone-600"} onClick={() => setView("week")}>Week</button>
          </div>
          <select className="field max-w-40" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value="">All owners</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <select className="field max-w-40" value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
            <option value="">All channels</option>
            {["Email", "Instagram", "Facebook", "Website", "In-store", "Print"].map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
          <select className="field max-w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {[...new Set(events.map((event) => event.status))].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select className="field max-w-44" value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)}>
            <option value="">All campaigns</option>
            {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {activeDays.map((day) => (
            <div
              key={day}
              className="panel min-h-44 p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("text/plain");
                moveEvent(id, day);
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-bark">{format(parseISO(day), "MMM d")}</p>
                <button className="text-xs text-moss" onClick={() => setDraft({ ...draft, date: day })}>+ add</button>
              </div>
              <div className="space-y-2">
                {visibleEvents.filter((event) => event.date === day).map((event) => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(dragEvent) => dragEvent.dataTransfer.setData("text/plain", event.id)}
                    className={`cursor-move rounded-xl px-3 py-2 text-xs ${statusTone(event.channel)}`}
                  >
                    <p className="font-medium">{event.title}</p>
                    <p className="mt-1 opacity-80">{event.channel}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-bark">New calendar item</h3>
        <p className="mt-1 text-sm text-stone-600">Click a date to prefill it, then add or link scheduled work.</p>
        <form className="mt-5 space-y-3" onSubmit={createEvent}>
          <input className="field" placeholder="Calendar title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <input className="field" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          <select className="field" value={draft.ownerId} onChange={(e) => setDraft({ ...draft, ownerId: e.target.value })}>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <select className="field" value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value })}>
            {["Email", "Instagram", "Facebook", "Website", "In-store", "Print"].map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
          <select className="field" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
            {["Planned", "Idea", "Drafting", "Ready for design", "In review", "Approved", "Scheduled", "Published"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select className="field" value={draft.contentItemId} onChange={(e) => setDraft({ ...draft, contentItemId: e.target.value })}>
            <option value="">No linked content item</option>
            {contentItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <select className="field" value={draft.campaignId} onChange={(e) => setDraft({ ...draft, campaignId: e.target.value })}>
            <option value="">No campaign</option>
            {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
          </select>
          <button className="btn-primary w-full">Create calendar item</button>
        </form>
      </section>
    </div>
  );
}
