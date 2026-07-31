import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, taskKeys } from "@/entities/task";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
