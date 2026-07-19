import Router from "express";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import { WorkspaceMemberService } from "@/modules/workspace-members/service.ts";
import { WorkspaceMemberController } from "@/modules/workspace-members/controller.ts";
import {
  createWorkspaceMemberSchema,
  updateWorkspaceMemberSchema,
  workspaceMemberIdSchema,
} from "@/modules/workspace-members/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";

const router = Router();

const repository = new WorkspaceMemberRepository();
const service = new WorkspaceMemberService(repository);
const controller = new WorkspaceMemberController(service);

router.use(requireAuth);

router.get(
  "/:id",
  validate({ params: workspaceMemberIdSchema }),
  controller.getAll,
);

router.get(
  "/:id",
  validate({ params: workspaceMemberIdSchema }),
  controller.getOne,
);

router.post(
  "/",
  validate({
    body: createWorkspaceMemberSchema,
    params: workspaceMemberIdSchema,
  }),
  controller.create,
);

router.patch(
  "/:id",
  validate({
    body: updateWorkspaceMemberSchema,
    params: workspaceMemberIdSchema,
  }),
  controller.update,
);

router.delete(
  "/:id",
  validate({ params: workspaceMemberIdSchema }),
  controller.delete,
);

export { router as workspaceMembersRouter };
