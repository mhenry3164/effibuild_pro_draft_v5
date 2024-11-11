import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types/auth';

interface RoleGateProps {
  children: ReactNode;
  roles: Role[];
  fallback?: ReactNode;
}

export function RoleGate({ children, roles, fallback = null }: RoleGateProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{roles.includes(user.role) ? children : fallback}</>;
}