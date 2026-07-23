import { z } from "zod";

export const createProjectMemberSchema = z.object({
  email: z.email(),
});

export const projectMemberParamsSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  project_id: z.uuid("Invalid project ID"),
});

export type CreateProjectMemberBody = z.infer<typeof createProjectMemberSchema>;
export type ProjectMemberParams = z.infer<typeof projectMemberParamsSchema>;
