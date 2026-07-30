export { workspacesQueryOptions, workspaceQueryOptions };

import { queryOptions } from "@tanstack/react-query";
import {
  fetchWorkspace,
  fetchWorkspaces,
  workspaceKeys,
} from "@/entities/workspace/index";

function workspacesQueryOptions() {
  return queryOptions({
    queryKey: workspaceKeys.all,
    queryFn: fetchWorkspaces,
  });
}

function workspaceQueryOptions(workspaceId: string) {
  return queryOptions({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => fetchWorkspace(workspaceId),
  });
}
