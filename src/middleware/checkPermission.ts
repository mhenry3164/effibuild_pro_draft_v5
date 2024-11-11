import { Request, Response, NextFunction } from 'express';
import { Permission } from '@/types/auth';

export const checkPermission = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get user from request (added by auth middleware)
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Master admin has all permissions
    if (user.role === 'master_admin') {
      return next();
    }

    // Check if user has all required permissions
    const hasPermission = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}