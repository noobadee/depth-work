import { ZodError } from "zod";
import { AppError, NotFoundError } from "@/common/errors/index.ts";
import { env } from "@/config/env.ts";
import { formatZodErrors } from "@/utils/formatZodError.ts";
import type { ErrorRequestHandler, RequestHandler } from "express";
import type { ErrorDetail, ErrorResponseBody } from "@/types/index.ts";

interface Logger {
  error: (message: string, meta?: Record<string, unknown>) => void;
}

const defaultLogger: Logger = {
  error: (message, meta) => console.error(message, meta ?? ""),
};

export function createErrorHandler(options?: {
  logger?: Logger;
}): ErrorRequestHandler {
  const logger = options?.logger ?? defaultLogger;
  const isProd = env.NODE_ENV === "production";

  return (err, req, res, _next) => {
    let statusCode = 500;
    let code = "INTERNAL_SERVER_ERROR";
    let message = "Something went wrong";
    let details: ErrorDetail[] | unknown;
    let isOperational = false;

    if (err instanceof AppError) {
      statusCode = err.statusCode;
      code = err.errorCode;
      message = err.message;
      details = err.details;
      isOperational = true;
    } else if (err instanceof ZodError) {
      statusCode = 422;
      code = "VALIDATION_ERROR";
      message = "Request validation failed";
      details = formatZodErrors(err);
      isOperational = true;
    } else if (err instanceof SyntaxError && "body" in err) {
      // express.json() throws a SyntaxError with a `body` property
      // when it can't parse the request body.
      statusCode = 400;
      code = "MALFORMED_JSON";
      message = "Request body contains malformed JSON";
      isOperational = true;
    } else if (err instanceof Error) {
      message = err.message;
    }

    const logPayload = {
      code,
      statusCode,
      path: req.originalUrl,
      method: req.method,
      requestId: req.headers["x-request-id"],
      ...(isOperational
        ? {}
        : { stack: err instanceof Error ? err.stack : err }),
    };

    if (isOperational) {
      logger.error(`[${code} ${message}]`, logPayload);
    } else {
      logger.error(`Unhandled error: ${message}`, logPayload);
    }

    const body: ErrorResponseBody = {
      success: false,
      error: {
        code,
        // Never leak internal error messages for non-operational
        // (bug) errors in production — swap in a generic message.
        message: !isOperational && isProd ? "Internal server error" : message,
        ...(details !== undefined ? { details } : {}),
        ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
      },
    };

    res.status(statusCode).json(body);
  };
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};
