import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/// Auth middleware out of scope for this take home
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  let userId = req.cookies?.user_id;

  if (!userId) {
    userId = randomUUID();
    res.cookie('user_id', userId, { 
      httpOnly: true, 
      sameSite: 'lax',
      path: '/',
    });
  }

  (req as Request & { userId: string }).userId = userId;
  next();
}
