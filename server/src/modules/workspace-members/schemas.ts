import { z } from "zod";

export const createWorkspaceMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
  email: z.email(),
});

export const updateWorkspaceMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
});

export const memberParamsSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  workspace_id: z.uuid("Invalid workspace ID"),
});

export type CreateWorkspaceMemberBody = z.infer<
  typeof createWorkspaceMemberSchema
>;

export type UpdateWorkspaceMemberBody = z.infer<
  typeof updateWorkspaceMemberSchema
>;

export type WorkspaceMemberParams = z.infer<typeof memberParamsSchema>;
