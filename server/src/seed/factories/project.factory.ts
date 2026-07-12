export { makeProjects, makeProjectMembers };

import { randomUUID } from "node:crypto";
import type { NewProject, NewProjectMember } from "@/db/schema/index.ts";

interface MakeProject {
  workspaceId: string;
  createdBy: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "archived";
  start_date: Date | null;
  due_date: Date | null;
  position: number;
}

interface MakeProjectMember {
  projectId: string;
  userId: string;
}

function makeProjects(projects: MakeProject[]): NewProject[] {
  const newProjects = projects.map((project) => ({
    project_id: randomUUID(),
    workspaceId: project.workspaceId,
    createdBy: project.createdBy,
    title: project.title,
    description: project.description,
    status: project.status,
    start_date: project.start_date,
    due_date: project.due_date,
    position: project.position,
  }));

  return newProjects;
}

function makeProjectMembers(
  projectMembers: MakeProjectMember[],
): NewProjectMember[] {
  const newProjectMembers = projectMembers.map((projectMember) => ({
    id: randomUUID(),
    projectId: projectMember.projectId,
    userId: projectMember.userId,
  }));

  return newProjectMembers;
}
