import type { NewWorkspace, Workspace } from "@/db/schema/index.ts";

export interface IWorkspaceRepository {
  findAllByOwner(ownerId: string): Promise<Workspace[] | null>;
  findById(id: string): Promise<Workspace | null>;
  findByName(name: string): Promise<Workspace | null>;
  create(data: NewWorkspace): Promise<Workspace | null>;
  update(id: string, data: Pick<Workspace, "name">): Promise<Workspace | null>;
  delete(id: string): Promise<void>;
}

export interface IWorkspaceService {
  getWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: string, userId: string): Promise<Workspace>;
  createWorkspace(data: CreateWorkspaceInput): Promise<Workspace>;
  updateWorkspace(
    id: string,
    userId: string,
    data: UpdateWorkspaceInput,
  ): Promise<Workspace>;
  deleteWorkspace(id: string, userId: string): Promise<void>;
}

export interface CreateWorkspaceInput {
  name: string;
  type: "personal" | "team";
  ownerId: string;
}

export interface UpdateWorkspaceInput {
  name: string;
}
