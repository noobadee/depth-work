import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFocusSessionTask,
  focusSessionTaskKeys,
} from "@/entities/focus-session-task";

export function useCreateFocusSessionTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFocusSessionTask,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionTaskKeys.all }),
  });
}
