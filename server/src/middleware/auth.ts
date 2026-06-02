import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(payload: AuthUser): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Phiên đăng nhập hết hạn' });
  }
}

export function adminRequired(req: Request, res: Response, next: NextFunction) {
  authRequired(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    next();
  });
}
