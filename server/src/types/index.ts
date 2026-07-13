export interface ErrorDetail {
  path: string;
  message: string;
  code?: string;
}

export interface ErrorResponseBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[] | unknown;
    stack?: string; // for production (NODE_ENV = "production")
  };
}
