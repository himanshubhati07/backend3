import { z } from 'zod';

/** Trims whitespace and strips control characters and angle brackets (basic XSS hardening). */
export function sanitizeText(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F<>]/g, '').trim();
}

export function cleanText(max: number, min = 1) {
  return z.string().transform(sanitizeText).pipe(z.string().min(min).max(max));
}
