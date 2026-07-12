export { makeTasks };

import { randomUUID } from "node:crypto";
import type { NewTask } from "@/db/schema/index.ts";

interface MakeTask {
  workspaceId: string;
  projectId: string;
  createdBy: string;
  assignedTo: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  position: number;
  due_date: Date | null;
  completed_at: Date | null;
}

function makeTasks(tasks: MakeTask[]): NewTask[] {
  const newTasks = tasks.map((task) => ({
    task_id: randomUUID(),
    workspace_id: task.workspaceId,
    project_id: task.projectId,
    createdBy: task.createdBy,
    assignedTo: task.assignedTo,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    due_date: task.due_date,
    completed_at: task.completed_at,
    position: task.position,
  }));

  return newTasks;
}
