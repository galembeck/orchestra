export class AppError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 409);
  }
}
