import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .max(255, "Project title must not exceed 255 characters"),
  description: z.string().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "archived"])
    .optional(),
  start_date: z.iso.datetime({ offset: true }).optional(),
  due_date: z.iso.datetime({ offset: true }).optional(),
  position: z.number().int("Project position must be an integer").optional(),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .max(255, "Project title must not exceed 255 characters")
    .optional(),
  description: z.string().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "archived"])
    .optional(),
  start_date: z.iso.datetime({ offset: true }).optional(),
  due_date: z.iso.datetime({ offset: true }).optional(),
  position: z.number().int("Project position must be an integer").optional(),
});

export const projectIdParamSchema = z.object({
  project_id: z.uuid("Invalid project ID"),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;
export type ProjectIdParam = z.infer<typeof projectIdParamSchema>;
