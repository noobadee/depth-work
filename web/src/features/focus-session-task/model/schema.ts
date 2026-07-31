import { z } from "zod";

export const createFocusSessionTaskFormSchema = z.object({
  taskId: z.uuid("Invalid task ID"),
  position: z
    .number()
    .int("Focus session task position must be an integer")
    .optional(),
});

export const updateFocusSessionTaskFormSchema = z.object({
  position: z
    .number()
    .int("Focus session task position must be an integer")
    .optional(),
  completedInSession: z.boolean().optional(),
});

export type CreateFocusSessionTaskFormValues = z.infer<
  typeof createFocusSessionTaskFormSchema
>;

export type UpdateFocusSessionTaskFormValues = z.infer<
  typeof updateFocusSessionTaskFormSchema
>;
