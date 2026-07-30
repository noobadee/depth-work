export { projectsQueryOptions, projectQueryOptions };

import { queryOptions } from "@tanstack/react-query";
import { fetchProjects, fetchProject, projectKeys } from "@/entities/project";

function projectsQueryOptions(workspaceId: string) {
  return queryOptions({
    queryKey: projectKeys.all,
    queryFn: () => fetchProjects(workspaceId),
  });
}

function projectQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
  });
}
