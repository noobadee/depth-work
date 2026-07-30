import { z } from "zod";

export const createProjectFormSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .max(255, "Project title must not exceed 255 characters"),
  description: z.string().nullable().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "archived"])
    .optional(),
  startDate: z.date().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  position: z.number().int("Project position must be an integer").optional(),
});

export const updateProjectFormSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .max(255, "Project title must not exceed 255 characters")
    .optional(),
  description: z.string().nullable().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "archived"])
    .optional(),
  startDate: z.date().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  position: z.number().int("Project position must be an integer").optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;

export type UpdateProjectFormValues = z.infer<typeof updateProjectFormSchema>;
