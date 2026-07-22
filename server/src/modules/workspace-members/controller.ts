import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IWorkspaceMemberService } from "@/modules/workspace-members/types.ts";
import type {
  CreateWorkspaceMemberBody,
  UpdateWorkspaceMemberBody,
  WorkspaceMemberParams,
} from "@/modules/workspace-members/schemas.ts";
import type { WorkspaceIdParam } from "@/modules/workspaces/schemas.ts";

export class WorkspaceMemberController {
  constructor(private readonly service: IWorkspaceMemberService) {}

  getAll = async (req: Request, res: Response) => {
    const { workspace_id } = req.params as WorkspaceIdParam;
    const workspaceMembers =
      await this.service.getWorkspaceMembers(workspace_id);
    sendSuccess({
      res,
      data: workspaceMembers,
      message: "Successfully fetched all workspace members",
    });
  };

  // getOne = async (req: Request, res: Response) => {
  //   // find by email and user_id (path parameter)
  //   const { member_id, workspace_id } = req.params as WorkspaceMemberParams;
  //   const workspaceMember = await this.service.getWorkspaceMember(
  //     member_id,
  //     workspace_id,
  //   );
  //   sendSuccess({
  //     res,
  //     data: workspaceMember,
  //     message: `Successfully fetched a workspace member with ID: ${member_id}`,
  //   });
  // };

  create = async (req: Request, res: Response) => {
    const { workspace_id } = req.params as WorkspaceIdParam;
    const body = req.body as CreateWorkspaceMemberBody;
    const newWorkspaceMember = await this.service.createWorkspaceMember(
      workspace_id,
      body,
    );
    sendSuccess({
      res,
      data: newWorkspaceMember,
      message: "Successfully created a new workspace member",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const { user_id, workspace_id } = req.params as WorkspaceMemberParams;
    const body = req.body as UpdateWorkspaceMemberBody;
    const updatedWorkspaceMember = await this.service.updateWorkspaceMember(
      user_id,
      workspace_id,
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
    // const user = requireUser(req);
    const { user_id, workspace_id } = req.params as WorkspaceMemberParams;
    await this.service.deleteWorkspaceMember(user_id, workspace_id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a workspace member",
      httpStatus: 201,
    });
  };
}
