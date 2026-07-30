export const workspaceMemberKeys = {
  all: ["workspace-members"] as const,
  lists: () => [...workspaceMemberKeys.all, "list"] as const,
  detail: (workspaceMemberId: string) =>
    [...workspaceMemberKeys.all, "detail", workspaceMemberId] as const,
};
