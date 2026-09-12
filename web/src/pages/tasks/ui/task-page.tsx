import { tasksQueryOptions } from "@/entities/task";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/_authenticated/$workspaceId/tasks");

export function TaskPage() {
  const { workspaceId } = routeApi.useParams();
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions(workspaceId));

  return (
    <>
      <h2>Tasks</h2>
      <p>{tasks.length} tasks across your workspace.</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.task_id}>- {task.title}</li>
        ))}
      </ul>
    </>
  );
}
