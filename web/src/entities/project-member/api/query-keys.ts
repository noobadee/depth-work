export const projectMemberKeys = {
  all: ["project-members"] as const,
  lists: () => [...projectMemberKeys.all, "list"] as const,
  detail: (projectMemberId: string) =>
    [...projectMemberKeys.all, "detail", projectMemberId] as const,
};
