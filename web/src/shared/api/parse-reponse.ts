import { z } from "zod";

export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Received unexpected data shape from the server");
    console.error(
      "API response failed validation",
      z.prettifyError(result.error),
    );
    throw new Error("Received unexpected data shape from the server");
  }
  return result.data;
}
