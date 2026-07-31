import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, taskKeys } from "@/entities/task";
import { projectKeys } from "@/entities/project";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...projectKeys.all, ...taskKeys.all],
      });
    },
  });
}
