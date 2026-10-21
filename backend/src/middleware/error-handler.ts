import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { sendError } from '../utils/api-response';
import { AppError } from '../utils/errors';

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next);
  };

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

interface PgError {
  code?: string;
}

/** Centralized error handler: never leaks stack traces or internal messages for unexpected errors. */
export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
    sendError(res, 400, 'Validation failed', details);
    return;
  }
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message, error.errors);
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    sendError(res, 400, 'Malformed JSON body');
    return;
  }
  const code = (error as PgError).code;
  if (code === '23505') {
    sendError(res, 409, 'A record with the same unique value already exists');
    return;
  }
  if (code === '23503') {
    sendError(res, 409, 'The operation conflicts with related records');
    return;
  }
  logger.error({ err: error, method: req.method, url: req.originalUrl }, 'Unhandled error');
  sendError(res, 500, 'Internal server error');
}
