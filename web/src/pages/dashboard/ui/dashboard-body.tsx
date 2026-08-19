import { useDashboard } from "@/app/providers/dashboard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import { Link } from "@tanstack/react-router";

export function DashboardBody() {
  const { projects, tasks } = useDashboard();

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex justify-between border-b">
          <CardTitle>Project Overview</CardTitle>
          <Link
            to="/$workspaceId/projects"
            className="text-gray-700 shadow-[inset_0_-1px_0_0_#777] hover:shadow-none transition-shadow"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {projects.map((project) => (
            <div key={project.project_id} className="border-b pb-2">
              <p className="text-base font-semibold">{project.title}</p>
              <p>{project.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex justify-between border-b">
          <CardTitle>My Tasks</CardTitle>
          <span>{tasks.length}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div key={task.task_id} className="border-b pb-1">
              <p className="font-normal">{task.title}</p>
              <p>{task.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex justify-between border-b">
          <CardTitle>Overdue</CardTitle>
          <span>0</span>
        </CardHeader>
        <CardContent>
          <p></p>
        </CardContent>
      </Card>
    </div>
  );
}
