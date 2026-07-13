export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    options?: { isOperational?: boolean; details?: unknown; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    ((this.isOperational = options?.isOperational ?? true),
      (this.details = options?.details));

    // Restore prototype chain — extending built-ins in TS
    Object.setPrototypeOf(this, new.target.prototype);

    // Excludes the constructor call itself from the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}
