import Router from "express";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import { WorkspaceMemberService } from "@/modules/workspace-members/service.ts";
import { WorkspaceMemberController } from "@/modules/workspace-members/controller.ts";
import {
  createWorkspaceMemberSchema,
  updateWorkspaceMemberSchema,
  workspaceIdSchema,
  workspaceMemberIdSchema,
} from "@/modules/workspace-members/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";

const router = Router();

const repository = new WorkspaceMemberRepository();
const service = new WorkspaceMemberService(repository);
const controller = new WorkspaceMemberController(service);

router.use(requireAuth);

router.get("/", validate({ body: workspaceIdSchema }), controller.getAll);

router.get(
  "/:id",
  validate({ params: workspaceMemberIdSchema, body: workspaceIdSchema }),
  controller.getOne,
);

router.post(
  "/",
  validate({
    body: createWorkspaceMemberSchema,
  }),
  controller.create,
);

router.patch(
  "/:id",
  validate({
    params: workspaceMemberIdSchema,
    body: updateWorkspaceMemberSchema,
  }),
  controller.update,
);

router.delete(
  "/:id",
  validate({ params: workspaceMemberIdSchema, body: workspaceIdSchema }),
  controller.delete,
);

export { router as workspaceMembersRouter };
