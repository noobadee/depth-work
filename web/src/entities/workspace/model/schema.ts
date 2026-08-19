import { z } from "zod";

export const workspaceSchema = z.object({
  workspace_id: z.uuid("Invalid workspace ID"),
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters"),
  type: z.enum(["personal", "team"]),
  ownerId: z.string().min(1, "Workspace ownder ID is required"),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const workspaceResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(workspaceSchema),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;
