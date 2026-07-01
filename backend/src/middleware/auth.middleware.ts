import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRole } from '../models/User';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'nutri_mind_jwt_secret_key_2026_enterprise_level_secure';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Access token is invalid or expired' });
      }

      req.user = user as AuthenticatedRequest['user'];
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header with Bearer token is required' });
  }
};

export const restrictTo = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access Denied: Insufficient permissions for this request' });
    }

    next();
  };
};
