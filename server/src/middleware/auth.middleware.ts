import type { Request, Response, NextFunction } from "express";
import { auth } from "../modules/auth/auth.ts";
import type { Session, User } from "../modules/auth/auth.ts";

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
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromExpressHeaders(req),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.session = session.session;
    req.user = session.user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ──── OPTIONAL AUTH ────────────────────────────────────────────────────────────────────────────

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromExpressHeaders(req),
    });

    if (session) {
      req.session = session.session;
      req.user = session.user;
    }
  } catch {}

  next();
}

// ──── HELPER: Convert Express headers to Web Fetch Headers ────────────────────────────────────────────────────────────────────────────

function fromExpressHeaders(req: Request): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else {
      headers.set(key, value);
    }
  }

  return headers;
}
