import express from "express";
import { FocusSessionRepository } from "@/modules/focus-sessions/repository.ts";
import { FocusSessionService } from "@/modules/focus-sessions/service.ts";
import { FocusSessionController } from "@/modules/focus-sessions/controller.ts";
import {
  createFocusSessionSchema,
  updateFocusSessionSchema,
  updateCompleteFocusSessionSchema,
  focusSessionIdParamSchema,
} from "@/modules/focus-sessions/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";

const router = express.Router({ mergeParams: true });

const repository = new FocusSessionRepository();
const service = new FocusSessionService(repository);
const controller = new FocusSessionController(service);

router.use(requireAuth);

router.get("/", controller.getAll);

router.get(
  "/:focus_id",
  validate({ params: focusSessionIdParamSchema }),
  controller.getOne,
);

router.post(
  "/",
  validate({ body: createFocusSessionSchema }),
  controller.create,
);

router.patch(
  "/:focus_id",
  validate({
    body: updateFocusSessionSchema,
    params: focusSessionIdParamSchema,
  }),
  controller.update,
);

router.patch(
  "/:focus_id/complete",
  validate({
    body: updateCompleteFocusSessionSchema,
    params: focusSessionIdParamSchema,
  }),
  controller.updateComplete,
);

router.delete(
  "/:focus_id",
  validate({ params: focusSessionIdParamSchema }),
  controller.delete,
);

export { router as focusSessionsRouter };
