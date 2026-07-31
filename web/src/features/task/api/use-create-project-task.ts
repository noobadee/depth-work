import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectTask, taskKeys } from "@/entities/task";
import { projectKeys } from "@/entities/project";

export function useCreateProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...projectKeys.all, ...taskKeys.all],
      });
    },
  });
}
