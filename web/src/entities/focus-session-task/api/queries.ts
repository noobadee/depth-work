import { queryOptions } from "@tanstack/react-query";
import {
  fetchFocusSessionTasks,
  focusSessionKeys,
} from "@/entities/focus-session-task";

export function focusSessionTasksQueryOptions(focusId: string) {
  return queryOptions({
    queryKey: focusSessionKeys.all,
    queryFn: () => fetchFocusSessionTasks(focusId),
  });
}
