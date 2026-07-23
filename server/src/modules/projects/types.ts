import type { NewProject, Project } from "@/db/schema/index.ts";

export interface IProjectRepository {
  findAllByWorkspace(workspaceId: string): Promise<Project[] | null>;
  findById(id: string): Promise<Project | null>;
  findByTitle(title: string): Promise<Project | null>;
  create(data: NewProject): Promise<Project | null>;
  update(
    id: string,
    data: Partial<
      Pick<
        Project,
        | "title"
        | "description"
        | "status"
        | "start_date"
        | "due_date"
        | "position"
      >
    >,
  ): Promise<Project | null>;
  delete(id: string): Promise<void>;
}

export interface IProjectService {
  getProjects(workspaceId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project>;
  createProject(
    creatorId: string,
    workspaceId: string,
    body: CreateProjectInput,
  ): Promise<Project>;
  updateProject(
    id: string,
    body: Partial<UpdateProjectInput>,
  ): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}

export interface CreateProjectInput {
  title: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed" | "archived";
  startDate?: Date | null;
  dueDate?: Date | null;
  position?: number;
}

export interface UpdateProjectInput {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "archived";
  startDate: Date | null;
  dueDate: Date | null;
  position: number;
}
