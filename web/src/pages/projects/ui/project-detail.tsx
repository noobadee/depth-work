import { projectQueryOptions } from "@/entities/project";
import { projectTasksQueryOptions } from "@/entities/task";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const routeApi = getRouteApi(
  "/_authenticated/$workspaceId/projects/$projectId",
);

export function ProjectDetail() {
  const { projectId } = routeApi.useParams();
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));
  const { data: tasks } = useSuspenseQuery(
    projectTasksQueryOptions(project.project_id),
  );

  return (
    <>
      <Link to="/$workspaceId/projects" className="flex gap-2">
        <ArrowLeft />
        <span>Back to Projects</span>
      </Link>

      <h2>{project.title}</h2>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.task_id}>- {task.title}</li>
        ))}
      </ul>
    </>
  );
}
