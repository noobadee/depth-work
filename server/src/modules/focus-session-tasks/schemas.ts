import { z } from "zod";

export const createFocusSessionTaskSchema = z.object({
  taskId: z.uuid("Invalid task ID"),
  position: z
    .number()
    .int("Focus session task position must be an integer")
    .optional(),
});

export const updateFocusSessionTaskSchema = z.object({
  position: z
    .number()
    .int("Focus session task position must be an integer")
    .optional(),
  completedInSession: z.boolean().optional(),
});

export const focusSessionTaskParamsSchema = z.object({
  focus_id: z.uuid("Invalid focus ID"),
  task_id: z.uuid("Invalid task ID"),
});

export type CreateFocusSessionTaskBody = z.infer<
  typeof createFocusSessionTaskSchema
>;
export type UpdateFocusSessionTaskBody = z.infer<
  typeof updateFocusSessionTaskSchema
>;
export type FocusSessionTaskParams = z.infer<
  typeof focusSessionTaskParamsSchema
>;
