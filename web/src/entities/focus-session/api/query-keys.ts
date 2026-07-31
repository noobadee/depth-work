export const focusSessionKeys = {
  all: ["focus-sessions"] as const,
  lists: () => [...focusSessionKeys.all, "list"] as const,
  detail: (focusId: string) =>
    [...focusSessionKeys.all, "detail", focusId] as const,
};
