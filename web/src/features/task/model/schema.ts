import { z } from "zod";

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(255, "Task title must not exceed 255 characters"),
  assignedTo: z.string().min(1, "User ID is required").nullable().optional(),
  description: z
    .string()
    .min(1, "Task description must contain at least one character")
    .nullable()
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z.date().nullable().optional(),
  position: z.number().int("Task position must be an integer").optional(),
});

export const updateTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(255, "Task title must not exceed 255 characters")
    .optional(),
  assignedTo: z.string().min(1, "User ID is required").nullable().optional(),
  description: z
    .string()
    .min(1, "Task description must contain at least one character")
    .nullable()
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z.date().nullable().optional(),
  position: z.number().int("Task position must be an integer").optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;

export type UpdateTaskFormValues = z.infer<typeof updateTaskFormSchema>;
