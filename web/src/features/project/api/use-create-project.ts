import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, projectKeys } from "@/entities/project";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
