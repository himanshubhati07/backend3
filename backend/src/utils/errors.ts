export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors: unknown[] = [],
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message = 'Bad request', errors: unknown[] = []): AppError {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = 'Authentication required'): AppError {
    return new AppError(401, message);
  }

  static forbidden(message = 'You do not have permission to perform this action'): AppError {
    return new AppError(403, message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, message);
  }

  static conflict(message = 'Resource already exists'): AppError {
    return new AppError(409, message);
  }
}
