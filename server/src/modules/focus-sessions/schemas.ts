import { z } from "zod";

export const createFocusSessionSchema = z.object({
  title: z
    .string()
    .min(1, "Focus session title must contain at least one character")
    .max(255, "Focus session title must not exceed 255 characters")
    .nullable()
    .optional(),
  status: z.enum(["active", "paused", "completed"]).optional(),
  endedAt: z.date().nullable().optional(),
  durationSeconds: z
    .number()
    .int("Duration seconds must be an integer")
    .nullable()
    .optional(),
});

export const updateFocusSessionSchema = z.object({
  title: z
    .string()
    .min(1, "Focus session title must contain at least one character")
    .max(255, "Focus session title must not exceed 255 characters")
    .nullable()
    .optional(),
  status: z.enum(["active", "paused", "completed"]).optional(),
  endedAt: z.date().nullable().optional(),
  durationSeconds: z
    .number()
    .int("Duration seconds must be an integer")
    .nullable()
    .optional(),
});

export const updateCompleteFocusSessionSchema = z.object({
  title: z
    .string()
    .min(1, "Focus session title must contain at least one character")
    .max(255, "Focus session title must not exceed 255 characters")
    .nullable()
    .optional(),
  status: z.enum(["active", "paused", "completed"]),
  startedAt: z.iso.datetime({ offset: true }).transform((val) => new Date(val)),
  endedAt: z.date().nullable().optional(),
  durationSeconds: z.number().int("Duration seconds must be an integer"),
});

export const focusSessionIdParamSchema = z.object({
  focus_id: z.uuid("Invalid focus session ID"),
});

export type CreateFocusSessionBody = z.infer<typeof createFocusSessionSchema>;
export type UpdateFocusSessionBody = z.infer<typeof updateFocusSessionSchema>;
export type UpdateCompleteFocusSessionBody = z.infer<
  typeof updateCompleteFocusSessionSchema
>;
export type FocusSessionIdParam = z.infer<typeof focusSessionIdParamSchema>;
