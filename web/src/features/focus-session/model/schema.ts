import { z } from "zod";

export const createFocusSessionFormSchema = z.object({
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

export const updateFocusSessionFormSchema = z.object({
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

export const updateCompleteFocusSessionFormSchema = z.object({
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

export type CreateFocusSessionFormValues = z.infer<
  typeof createFocusSessionFormSchema
>;

export type UpdateFocusSessionFormValues = z.infer<
  typeof updateFocusSessionFormSchema
>;

export type UpdateCompleteFocusSessionFormValues = z.infer<
  typeof updateCompleteFocusSessionFormSchema
>;
