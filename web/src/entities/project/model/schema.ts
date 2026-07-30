import { z } from "zod";

export const projectSchema = z.object({
  project_id: z.uuid("Invalid project ID"),
  workspaceId: z.uuid("Invalid workspace ID"),
  createdBy: z.string().min(1, "User ID must contain at least one character"),
  title: z
    .string()
    .min(1, "Project title is required")
    .max(255, "Project title must not exceed 255 characters"),
  description: z.string().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "archived"]),
  start_date: z.date().nullable(),
  due_date: z.date().nullable(),
  position: z.number().int("Project position must be an integer"),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const projectResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(projectSchema),
});

export type Project = z.infer<typeof projectResponseSchema>;
