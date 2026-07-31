import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateFocusSessionTask,
  focusSessionTaskKeys,
} from "@/entities/focus-session-task";

export function useUpdateFocusSessionTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFocusSessionTask,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionTaskKeys.all }),
  });
}
