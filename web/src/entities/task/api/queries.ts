export { tasksQueryOptions, projectTasksQueryOptions, taskQueryOptions };

import { queryOptions } from "@tanstack/react-query";
import {
  fetchTasks,
  fetchProjectTasks,
  fetchTask,
  taskKeys,
} from "@/entities/task";
import { projectKeys } from "@/entities/project";

function tasksQueryOptions(workspaceId: string) {
  return queryOptions({
    queryKey: taskKeys.all,
    queryFn: () => fetchTasks(workspaceId),
  });
}

function projectTasksQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: [...projectKeys.all, ...taskKeys.all],
    queryFn: () => fetchProjectTasks(projectId),
  });
}

function taskQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => fetchTask(taskId),
  });
}
