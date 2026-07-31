export { focusSessionsQueryOptions, focusSessionQueryOptions };

import { queryOptions } from "@tanstack/react-query";
import {
  fetchFocusSessions,
  fetchFocusSession,
  focusSessionKeys,
} from "@/entities/focus-session";

function focusSessionsQueryOptions() {
  return queryOptions({
    queryKey: focusSessionKeys.all,
    queryFn: fetchFocusSessions,
  });
}

function focusSessionQueryOptions(focusId: string) {
  return queryOptions({
    queryKey: focusSessionKeys.detail(focusId),
    queryFn: () => fetchFocusSession(focusId),
  });
}
