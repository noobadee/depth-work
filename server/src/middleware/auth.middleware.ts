import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "@/common/errors/index.ts";
import { auth } from "@/modules/auth/auth.ts";
import type { Session, User } from "@/modules/auth/auth.ts";
import type { Request, Response, NextFunction } from "express";

// ──── EXTEND EXPRESS REQUEST TYPE ────────────────────────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      session: Session["session"];
      user: User;
    }
  }
}

// ──── REQUIRE AUTH ────────────────────────────────────────────────────────────────────────────

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      next(new UnauthorizedError());
      return;
    }

    req.session = session.session;
    req.user = session.user;

    next();
  } catch (err) {
    next(err);
  }
}

// ──── OPTIONAL AUTH ────────────────────────────────────────────────────────────────────────────

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.session = session.session;
      req.user = session.user;
    }
  } catch {}

  next();
}

// ──── HELPERS ────────────────────────────────────────────────────────────────────────────

export function requireUser(req: Request): NonNullable<Request["user"]> {
  if (req.user === undefined) {
    throw new UnauthorizedError();
  }

  return req.user;
}

// Convert Express headers to Web Fetch Headers

// function fromExpressHeaders(req: Request): Headers {
//   const headers = new Headers();

//   for (const [key, value] of Object.entries(req.headers)) {
//     if (value === undefined) {
//       continue;
//     }
//     if (Array.isArray(value)) {
//       value.forEach((v) => headers.append(key, v));
//     } else {
//       headers.set(key, value);
//     }
//   }

//   return headers;
// }
