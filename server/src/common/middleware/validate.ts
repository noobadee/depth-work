import { ValidationError } from "@/common/errors/index.ts";
import { formatZodErrors } from "@/utils/formatZodError.ts";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType, z } from "zod";

interface ValidationSchemas<
  TBody extends ZodType = ZodType,
  TParams extends ZodType = ZodType,
  TQuery extends ZodType = ZodType,
> {
  body?: TBody;
  params?: TParams;
  query?: TQuery;
}

// Augment Express's Request so `req.validated` is typed wherever this
// middleware runs, without clobbering the original body/params/query types.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export function validate<
  TBody extends ZodType,
  TParams extends ZodType,
  TQuery extends ZodType,
>(schemas: ValidationSchemas<TBody, TParams, TQuery>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = req.validated ?? {};

      if (schemas.body) {
        req.validated.body = parseOrThrow(schemas.body, req.body, "body");
        req.body = req.validated.body;
      }

      if (schemas.params) {
        req.validated.params = parseOrThrow(
          schemas.params,
          req.params,
          "params",
        );
        req.params = req.validated.params as Request["params"];
      }

      if (schemas.query) {
        req.validated.query = parseOrThrow(schemas.query, req.query, "query");
        defineQuery(req, req.validated.query);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

function parseOrThrow<T extends ZodType>(
  schema: T,
  data: unknown,
  source: "body" | "params" | "query",
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      `Invalid request ${source}`,
      formatZodErrors(result.error).map((d) => ({
        ...d,
        path: d.path === "(root)" ? source : `${source}.${d.path}`,
      })),
    );
  }

  return result.data;
}

/** Safely overwrite req.query even though Express 5 made it a getter. */
function defineQuery(req: Request, value: unknown): void {
  Object.defineProperty(req, "query", {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}
