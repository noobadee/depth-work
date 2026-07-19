import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IWorkspaceMemberService } from "@/modules/workspace-members/types.ts";
import type {
  CreateWorkspaceMemberBody,
  UpdateWorkspaceMemberBody,
  WorkspaceMemberIdParams,
} from "@/modules/workspace-members/schemas.ts";

export class WorkspaceMemberController {
  constructor(private readonly service: IWorkspaceMemberService) {}

  getAll = async (req: Request, res: Response) => {
    const { id: workspaceId } = req.params as WorkspaceMemberIdParams;
    const workspaceMembers =
      await this.service.getWorkspaceMembers(workspaceId);
    sendSuccess({
      res,
      data: workspaceMembers,
      message: "Successfully fetched all workspace members",
    });
  };

  getOne = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { id: workspaceMemberId } = req.params as WorkspaceMemberIdParams;
    const workspaceMember = await this.service.getWorkspaceMember(
      workspaceMemberId,
      user.id,
    );
    sendSuccess({
      res,
      data: workspaceMember,
      message: `Successfully fetched a workspace member with ID: ${workspaceMemberId}`,
    });
  };

  create = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { id: workspaceId } = req.params as WorkspaceMemberIdParams;
    const body = req.body as CreateWorkspaceMemberBody;
    const newWorkspaceMember = await this.service.createWorkspaceMember({
      ...body,
      workspaceId,
      userId: user.id,
    });
    sendSuccess({
      res,
      data: newWorkspaceMember,
      message: "Successfully created a new workspace member",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { id: workspaceMemberId } = req.params as WorkspaceMemberIdParams;
    const body = req.body as UpdateWorkspaceMemberBody;
    const updatedWorkspaceMember = await this.service.updateWorkspaceMember(
      workspaceMemberId,
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: updatedWorkspaceMember,
      message: "Successfully updated a workspace member",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { id: workspaceMemberId } = req.params as WorkspaceMemberIdParams;
    await this.service.deleteWorkspaceMember(workspaceMemberId, user.id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a workspace member",
      httpStatus: 201,
    });
  };
}
