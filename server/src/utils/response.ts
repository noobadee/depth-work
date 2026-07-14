import type { Response } from "express";

interface SendSuccess<T = unknown> {
  status: "success";
  message: string;
  data: T;
}

interface SendSuccessOptions<T = unknown> {
  res: Response;
  data: T;
  message?: string;
  httpStatus?: number;
}

export function sendSuccess({
  res,
  data,
  message = "OK",
  httpStatus = 200,
}: SendSuccessOptions): void {
  const body: SendSuccess = {
    status: "success",
    message,
    data,
  };
  res.status(httpStatus).json(body);
}
