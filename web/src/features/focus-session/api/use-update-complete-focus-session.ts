import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCompleteFocusSession,
  focusSessionKeys,
} from "@/entities/focus-session";

export function useUpdateCompleteFocusSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompleteFocusSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionKeys.all }),
  });
}
