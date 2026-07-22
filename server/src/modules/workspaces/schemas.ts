import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters"),
  type: z.enum(["personal", "team"]),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters"),
});

export const workspaceIdParamSchema = z.object({
  workspace_id: z.uuid("Invalid workspace ID"),
});

export type CreateWorkspaceBody = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceBody = z.infer<typeof updateWorkspaceSchema>;
export type WorkspaceIdParam = z.infer<typeof workspaceIdParamSchema>;
