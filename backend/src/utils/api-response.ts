import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message = 'Request completed successfully', status = 200): void {
  res.status(status).json({ success: true, message, data });
}

export function sendError(res: Response, status: number, message: string, errors: unknown[] = []): void {
  res.status(status).json({ success: false, message, errors });
}
