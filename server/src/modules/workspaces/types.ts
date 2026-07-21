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
  getWorkspaces(ownerId: string): Promise<Workspace[]>;
  getWorkspace(id: string, ownerId: string): Promise<Workspace>;
  createWorkspace(
    ownerId: string,
    body: CreateWorkspaceInput,
  ): Promise<Workspace>;
  updateWorkspace(
    id: string,
    ownerId: string,
    body: UpdateWorkspaceInput,
  ): Promise<Workspace>;
  deleteWorkspace(id: string, ownerId: string): Promise<void>;
}

export interface CreateWorkspaceInput {
  name: string;
  type: "personal" | "team";
}

export interface UpdateWorkspaceInput {
  name: string;
}
