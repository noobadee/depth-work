export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  detail: (taskId: string) => [...taskKeys.all, "detail", taskId] as const,
};
