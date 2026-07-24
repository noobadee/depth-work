import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(255, "Task title must not exceed 255 characters"),
  assignedTo: z.string().min(1, "User ID is required").optional(),
  description: z.string().min(1, "Task description is required").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z.date().nullable().optional(),
  position: z.number().int("Task position must be an integer").optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(255, "Task title must not exceed 255 characters")
    .optional(),
  assignedTo: z.string().min(1, "User ID is required").optional(),
  description: z.string().min(1, "Task description is required").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z.date().nullable().optional(),
  position: z.number().int("Task position must be an integer").optional(),
});

export const taskIdParamSchema = z.object({
  task_id: z.uuid("Invalid task ID"),
});

export type CreateTaskBody = z.infer<typeof createTaskSchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
