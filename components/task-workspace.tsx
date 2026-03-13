"use client";

import { isPast, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { formatDate, statusTone } from "@/lib/utils";
import type { ContentItem, Task, User } from "@/lib/types";

const columns: Task["status"][] = ["To do", "In progress", "Blocked", "Done"];

export function TaskWorkspace({
  initialTasks,
  users,
  contentItems
}: {
  initialTasks: Task[];
  users: User[];
  contentItems: ContentItem[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<"table" | "kanban" | "mine" | "overdue">("table");
  const [draft, setDraft] = useState({
    title: "",
    contentItemId: "",
    assignedUserId: users[1]?.id ?? users[0]?.id ?? "",
    dueDate: "2026-03-12",
    status: "To do",
    notes: ""
  });

  const visibleTasks = useMemo(() => {
    if (view === "mine") {
      return tasks.filter((task) => task.assignedUserId === users[1]?.id);
    }
    if (view === "overdue") {
      return tasks.filter((task) => task.status !== "Done" && isPast(parseISO(task.dueDate)));
    }
    return tasks;
  }, [tasks, users, view]);

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, contentItemId: draft.contentItemId || undefined })
    });
    const record = (await response.json()) as Task;
    setTasks((current) => [record, ...current]);
    setDraft({ ...draft, title: "", notes: "", contentItemId: "" });
  }

  async function moveTask(task: Task, status: Task["status"]) {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status })
    });
    const updated = (await response.json()) as Task;
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  async function removeTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.82fr]">
      <section className="space-y-4">
        <div className="panel flex flex-wrap items-center gap-3 p-4">
          {[
            ["table", "Table view"],
            ["kanban", "Kanban board"],
            ["mine", "My tasks"],
            ["overdue", "Overdue tasks"]
          ].map(([key, label]) => (
            <button type="button" key={key} className={view === key ? "btn-primary" : "btn-secondary"} onClick={() => setView(key as typeof view)}>{label}</button>
          ))}
        </div>
        {view === "kanban" ? (
          <div className="grid gap-4 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column} className="panel p-4">
                <p className="font-semibold text-bark">{column}</p>
                <div className="mt-4 space-y-3">
                  {tasks.filter((task) => task.status === column).map((task) => (
                    <div key={task.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                      <p className="font-medium text-bark">{task.title}</p>
                      <p className="mt-1 text-sm text-stone-600">{formatDate(task.dueDate)}</p>
                      <select className="field mt-3" value={task.status} onChange={(e) => moveTask(task, e.target.value as Task["status"])}>
                        {columns.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Linked item</th>
                  <th className="px-5 py-3 font-medium">Assigned</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Notes</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task) => (
                  <tr key={task.id} className="border-t border-stone-100">
                    <td className="px-5 py-4 font-medium text-bark">{task.title}</td>
                    <td className="px-5 py-4">{contentItems.find((item) => item.id === task.contentItemId)?.title ?? "Standalone"}</td>
                    <td className="px-5 py-4">{users.find((user) => user.id === task.assignedUserId)?.name ?? "Unknown"}</td>
                    <td className="px-5 py-4">{formatDate(task.dueDate)}</td>
                    <td className="px-5 py-4">
                      <select className={`field min-w-36 ${statusTone(task.status)}`} value={task.status} onChange={(e) => moveTask(task, e.target.value as Task["status"])}>
                        {columns.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{task.notes}</td>
                    <td className="px-5 py-4">
                      <button className="text-stone-500 transition hover:text-rose-600" onClick={() => removeTask(task.id)} aria-label={`Delete ${task.title}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-bark">New task</h3>
        <form className="mt-5 space-y-3" onSubmit={createTask}>
          <input className="field" placeholder="Task title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <select className="field" value={draft.contentItemId} onChange={(e) => setDraft({ ...draft, contentItemId: e.target.value })}>
            <option value="">Standalone task</option>
            {contentItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <select className="field" value={draft.assignedUserId} onChange={(e) => setDraft({ ...draft, assignedUserId: e.target.value })}>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <input className="field" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
          <select className="field" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
            {columns.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <textarea className="field min-h-28" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Notes" />
          <button className="btn-primary w-full">Create task</button>
        </form>
      </section>
    </div>
  );
}
