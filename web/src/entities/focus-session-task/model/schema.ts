import { z } from "zod";

export const focusSessionTaskSchema = z.object({
  focus_task_id: z.uuid("Invalid focus task ID"),
  focusId: z.uuid("Invalid focus ID"),
  taskId: z.uuid("Invalid task ID"),
  position: z.number().int("Focus session task must be an integer"),
  completed_in_session: z.boolean(),
  added_at: z.iso.datetime(),
});

export const focusSessionTaskResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(focusSessionTaskSchema),
});

export type FocusSessionTask = z.infer<typeof focusSessionTaskResponseSchema>;
