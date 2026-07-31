import { z } from "zod";

export const focusSessionSchema = z.object({
  focus_id: z.uuid("Invalid focus ID"),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Focus title must contain at least one character"),
  status: z.enum(["active", "paused", "completed"]),
  started_at: z.iso.datetime(),
  ended_at: z.iso.datetime().nullable,
  duration_seconds: z
    .number()
    .int("Focus session duration seconds must be an integer")
    .nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const focusSessionResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(focusSessionSchema),
});

export type FocusSession = z.infer<typeof focusSessionResponseSchema>;
