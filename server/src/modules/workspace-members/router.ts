import express from "express";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import { WorkspaceMemberService } from "@/modules/workspace-members/service.ts";
import { WorkspaceMemberController } from "@/modules/workspace-members/controller.ts";
import { workspaceIdParamSchema } from "@/modules/workspaces/schemas.ts";
import {
  createWorkspaceMemberSchema,
  updateWorkspaceMemberSchema,
  memberParamsSchema,
} from "@/modules/workspace-members/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";
import { requireRole } from "@/middleware/require-role.middleware.ts";

const router = express.Router({ mergeParams: true });

const repository = new WorkspaceMemberRepository();
const service = new WorkspaceMemberService(repository);
const controller = new WorkspaceMemberController(service);

router.use(requireAuth);

router.get(
  "/",
  validate({ params: workspaceIdParamSchema }),
  controller.getAll,
);

// router.get(
//   "/:id",
//   validate({ params: workspaceMemberIdSchema, body: workspaceIdSchema }),
//   controller.getOne,
// );

router.post(
  "/",
  validate({
    body: createWorkspaceMemberSchema,
    params: workspaceIdParamSchema,
  }),
  requireRole(["owner", "admin"]),
  controller.create,
);

router.patch(
  "/:user_id",
  validate({
    body: updateWorkspaceMemberSchema,
    params: memberParamsSchema,
  }),
  requireRole(["owner", "admin"], { withUserIdParam: true }),
  controller.update,
);

router.delete(
  "/:user_id",
  validate({ params: memberParamsSchema }),
  requireRole(["owner", "admin"], { withUserIdParam: true }),
  controller.delete,
);

export { router as workspaceMembersRouter };
