import { useProjects } from "@/app/providers/projects-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import { Folder } from "lucide-react";

export function ProjectBody() {
  const { projects } = useProjects();

  return (
    <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card
          key={project.project_id}
          className="min-w-[300px] flex flex-col justify-between"
        >
          <CardHeader className="relative">
            <CardTitle>{project.title}</CardTitle>
            <p className="text-muted-foreground">{project.description}</p>
            <Folder className="absolute top-0 right-4" />
          </CardHeader>
          <CardContent>
            <p>
              {project.status === "in_progress"
                ? "in progress"
                : project.status}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
