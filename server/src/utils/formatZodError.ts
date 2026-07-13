import type { ZodError } from "zod";
import type { ErrorDetail } from "@/types/index.ts";

export function formatZodErrors(err: ZodError): ErrorDetail[] {
  return err.issues.map((issue) => ({
    path: issue.path.join(".") || "(root)",
    message: issue.message,
    code: issue.code,
  }));
}
