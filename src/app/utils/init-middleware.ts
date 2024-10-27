// utils/init-middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

type ApiMiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result?: unknown) => void
) => void;

type AppMiddlewareFunction = (
  req: NextRequest,
  res: NextResponse,
  next: (result?: unknown) => void
) => void;

// For API routes
export function initApiMiddleware(middleware: ApiMiddlewareFunction) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// For App Router
export function initAppMiddleware(middleware: AppMiddlewareFunction) {
  return (req: NextRequest, res: NextResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
