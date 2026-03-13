import { PageHeader } from "@/components/page-header";
import { TaskWorkspace } from "@/components/task-workspace";
import { getContentItems, getTasks, getUsers } from "@/lib/repository";

export default async function TasksPage() {
  const [tasks, users, contentItems] = await Promise.all([getTasks(), getUsers(), getContentItems()]);

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 · Build"
        title="Task management"
        description="Support linked content tasks and standalone operational work with table, kanban, my tasks, and overdue views."
      />
      <TaskWorkspace initialTasks={tasks} users={users} contentItems={contentItems} />
    </div>
  );
}
