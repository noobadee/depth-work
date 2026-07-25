import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IFocusSessionService } from "@/modules/focus-sessions/types.ts";
import type {
  CreateFocusSessionBody,
  UpdateFocusSessionBody,
  UpdateCompleteFocusSessionBody,
  FocusSessionIdParam,
} from "@/modules/focus-sessions/schemas.ts";

export class FocusSessionController {
  constructor(private readonly service: IFocusSessionService) {}

  getAll = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const focusSessions = await this.service.getFocusSessions(user.id);
    sendSuccess({
      res,
      data: focusSessions,
      message: "Successfully fetched all focus sessions",
    });
  };

  getOne = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { focus_id } = req.params as FocusSessionIdParam;
    const focusSession = await this.service.getFocusSession(focus_id, user.id);
    sendSuccess({
      res,
      data: focusSession,
      message: "Successfully fetched a focus session",
    });
  };

  create = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const body = req.body as CreateFocusSessionBody;
    const newFocusSession = await this.service.createFocusSession(
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: newFocusSession,
      message: "Successfully created a new focus session",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { focus_id } = req.params as FocusSessionIdParam;
    const body = req.body as UpdateFocusSessionBody;
    const updatedFocusSession = await this.service.updateFocusSession(
      focus_id,
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: updatedFocusSession,
      message: "Successfully updated a focus session",
      httpStatus: 201,
    });
  };

  updateComplete = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { focus_id } = req.params as FocusSessionIdParam;
    const body = req.body as UpdateCompleteFocusSessionBody;
    const completedFocusSession = await this.service.updateCompleteFocusSession(
      focus_id,
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: completedFocusSession,
      message: "Successfully updated a focus session",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { focus_id } = req.params as FocusSessionIdParam;
    await this.service.deleteFocusSession(focus_id, user.id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a focus session",
      httpStatus: 201,
    });
  };
}
