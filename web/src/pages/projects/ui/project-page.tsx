import { ProjectsContextProvider } from "@/app/providers/projects-context";
import { ProjectContent } from "@/pages/projects";

export function ProjectPage() {
  return (
    <ProjectsContextProvider>
      <ProjectContent />
    </ProjectsContextProvider>
  );
}
