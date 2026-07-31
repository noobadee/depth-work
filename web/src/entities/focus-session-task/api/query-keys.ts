export const focusSessionTaskKeys = {
  all: ["focus-session-tasks"] as const,
  lists: () => [...focusSessionTaskKeys.all, "list"] as const,
  detail: (focusSessionTaskId: string) =>
    [...focusSessionTaskKeys.all, "detail", focusSessionTaskId] as const,
};
