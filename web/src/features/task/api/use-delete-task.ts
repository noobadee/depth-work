import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, taskKeys } from "@/entities/task";
import { projectKeys } from "@/entities/project";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...projectKeys.all, ...taskKeys.all],
      });
    },
  });
}
