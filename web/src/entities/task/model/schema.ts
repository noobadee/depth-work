import { z } from "zod";

export const tasksSchema = z.object({
  task_id: z.uuid("Invalid task ID"),
  workspace_id: z.uuid("Invalid workspace ID"),
  projectId: z.uuid("Invalid project ID").nullable(),
  createdBy: z
    .string()
    .min(1, "User ID must contain at least one character")
    .nullable(),
  assignedTo: z
    .string()
    .min(1, "User ID must contain at least one character")
    .nullable(),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(255, "Task title must not exceed 255 characters"),
  description: z
    .string()
    .min(1, "Task description must contain at least one character")
    .nullable(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
  due_date: z.date().nullable(),
  completed_at: z.iso.datetime().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const tasksResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(tasksSchema),
});

export type Task = z.infer<typeof tasksSchema>;
export type TaskResponse = z.infer<typeof tasksResponseSchema>;
