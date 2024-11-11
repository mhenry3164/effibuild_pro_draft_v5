import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/auth';

interface PermissionGateProps {
  children: ReactNode;
  permissions: Permission[];
  clientId?: string;
}

export function PermissionGate({ children, permissions, clientId }: PermissionGateProps) {
  const { hasPermission } = useAuth();

  if (!permissions.every(permission => hasPermission(permission, clientId))) {
    return null;
  }

  return <>{children}</>;
}