import Link from "next/link";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { formatDate, dueTone, statusTone } from "@/lib/utils";
import type { Approval, CalendarEvent, ContentItem, DashboardData, Task, User } from "@/lib/types";

function ownerName(users: User[], id: string) {
  return users.find((user) => user.id === id)?.name ?? "Unassigned";
}

function listCard<T>({
  title,
  items,
  renderItem
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  if (!items.length) {
    return <EmptyState title={title} description="Nothing to show yet." />;
  }

  return (
    <div className="panel p-5">
      <h3 className="text-lg font-semibold text-bark">{title}</h3>
      <div className="mt-4 space-y-3">{items.map(renderItem)}</div>
    </div>
  );
}

export function DashboardOverview({
  data,
  users
}: {
  data: DashboardData;
  users: User[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Upcoming Deadlines" value={data.upcomingDeadlines.length} detail="High-visibility items due soon." />
        <StatCard label="This Week's Tasks" value={data.weeklyTasks.length} detail="Cross-team work scheduled this week." />
        <StatCard label="Pending Approvals" value={data.pendingApprovals.length} detail="Design and copy waiting on review." />
        <StatCard label="Recent Updates" value={data.recentItems.length} detail="Latest movement across content and operations." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {listCard<ContentItem>({
            title: "Upcoming deadlines",
            items: data.upcomingDeadlines,
            renderItem: (item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3">
                <div>
                  <Link href={`/content/${item.id}`} className="font-medium text-bark">{item.title}</Link>
                  <div className="mt-1 flex gap-2 text-xs text-stone-500">
                    <span className={`badge ${statusTone(item.status)}`}>{item.status}</span>
                    <span>{item.channel}</span>
                    <span>{ownerName(users, item.ownerId)}</span>
                  </div>
                </div>
                <span className={`text-sm font-medium ${dueTone(item.dueDate)}`}>{formatDate(item.dueDate)}</span>
              </div>
            )
          })}

          {listCard<Task>({
            title: "This week's content tasks",
            items: data.weeklyTasks,
            renderItem: (task) => (
              <div key={task.id} className="rounded-2xl border border-stone-100 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-bark">{task.title}</p>
                  <span className={`badge ${statusTone(task.status)}`}>{task.status}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Assigned to {ownerName(users, task.assignedUserId)} · Due {formatDate(task.dueDate)}
                </p>
              </div>
            )
          })}

          {listCard<ContentItem>({
            title: "Recently updated items",
            items: data.recentItems,
            renderItem: (item) => (
              <div key={item.id} className="rounded-2xl border border-stone-100 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/content/${item.id}`} className="font-medium text-bark">{item.title}</Link>
                  <span className={`badge ${statusTone(item.contentType)}`}>{item.contentType}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Updated {item.updatedAt} · {ownerName(users, item.ownerId)}
                </p>
              </div>
            )
          })}
        </div>

        <div className="space-y-6">
          {listCard<Approval>({
            title: "Pending approvals",
            items: data.pendingApprovals,
            renderItem: (approval) => (
              <div key={approval.id} className="rounded-2xl border border-stone-100 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <Link href="/approvals" className="font-medium text-bark">{approval.versionLabel}</Link>
                  <span className={`badge ${statusTone(approval.designStatus)}`}>{approval.designStatus}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Reviewer: {ownerName(users, approval.reviewerId)}
                </p>
              </div>
            )
          })}

          {listCard<CalendarEvent>({
            title: "Marketing calendar preview",
            items: data.calendarPreview,
            renderItem: (event) => (
              <div key={event.id} className="rounded-2xl border border-stone-100 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-bark">{event.title}</p>
                  <span className={`badge ${statusTone(event.status)}`}>{event.status}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  {formatDate(event.date)} · {event.channel}
                </p>
              </div>
            )
          })}

          <div className="panel p-5">
            <h3 className="text-lg font-semibold text-bark">Quick actions</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/content" className="btn-secondary justify-start gap-2"><Plus className="h-4 w-4" /> New content item</Link>
              <Link href="/calendar" className="btn-secondary justify-start gap-2"><Plus className="h-4 w-4" /> New calendar item</Link>
              <Link href="/approvals" className="btn-secondary justify-start gap-2"><Plus className="h-4 w-4" /> New approval request</Link>
              <Link href="/wiki" className="btn-secondary justify-start gap-2"><Plus className="h-4 w-4" /> New wiki page</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
