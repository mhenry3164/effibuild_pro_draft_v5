import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Permission } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
  requireAll?: boolean;
  clientId?: string;
}

export function ProtectedRoute({
  children,
  permissions = [],
  requireAll = true,
  clientId,
}: ProtectedRouteProps) {
  const { user, hasAllPermissions, hasAnyPermission, isMasterAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Master Admin bypasses all permission checks
  if (isMasterAdmin()) {
    return <>{children}</>;
  }

  if (permissions.length > 0) {
    const hasPermission = requireAll
      ? hasAllPermissions(permissions, clientId)
      : hasAnyPermission(permissions, clientId);

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}