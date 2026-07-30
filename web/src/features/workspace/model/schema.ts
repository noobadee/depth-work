import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters"),
  type: z.enum(["personal", "team"]),
});

export type CreateWorkspaceFormValues = z.infer<
  typeof createWorkspaceFormSchema
>;
