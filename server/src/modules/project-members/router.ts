import express from "express";
import { ProjectMemberRepository } from "@/modules/project-members/repository.ts";
import { ProjectMemberService } from "@/modules/project-members/service.ts";
import { ProjectMemberController } from "@/modules/project-members/controller.ts";
import { projectIdParamSchema } from "@/modules/projects/schemas.ts";
import {
  createProjectMemberSchema,
  projectMemberParamsSchema,
} from "@/modules/project-members/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";
import { projectMemberGuard } from "@/middleware/project-member.middleware.ts";

const router = express.Router({ mergeParams: true });

const repository = new ProjectMemberRepository();
const service = new ProjectMemberService(repository);
const controller = new ProjectMemberController(service);

router.use(requireAuth);

router.get(
  "/:project_id/members",
  validate({ params: projectIdParamSchema }),
  controller.getAll,
);

router.post(
  "/:project_id/members",
  validate({ body: createProjectMemberSchema, params: projectIdParamSchema }),
  projectMemberGuard(),
  controller.create,
);

router.delete(
  "/:project_id/members/:user_id",
  validate({ params: projectMemberParamsSchema }),
  projectMemberGuard({ withUserIdParam: true }),
  controller.delete,
);

export { router as projectMembersRouter };
