import { env } from "@/shared/config/env";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  path: string,
  { body, headers, ...rest }: RequestOptions = {},
): Promise<T> {
  // get token?
  // set token here?
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${env.apiBaseUrl}/api${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  // 204 No Content and similar have no body to parse.
  const hasJsonBody = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = hasJsonBody ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(response.status, payload, readErrorMessage(payload));
  }

  return payload as T;
}

function readErrorMessage(payload: unknown): string | undefined {
  if (payload && typeof payload === "object" && "message" in payload) {
    const { message } = payload as { message?: unknown };
    if (typeof message === "string") return message;
  }
  return undefined;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
