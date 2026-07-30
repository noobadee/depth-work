export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  detail: (workspaceId: string) =>
    [...workspaceKeys.all, "detail", workspaceId] as const,
};
