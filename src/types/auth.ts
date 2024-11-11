import { type LucideIcon } from 'lucide-react';

export enum Permission {
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  CLIENTS_READ = 'clients:read',
  CLIENTS_CREATE = 'clients:create',
  CLIENTS_UPDATE = 'clients:update',
  CLIENTS_DELETE = 'clients:delete',
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',
  ROLES_MANAGE = 'roles:manage',
  ROLES_MANAGE_ALL = 'roles:manage:all',
  AUDIT_READ = 'audit:read',
  AUDIT_EXPORT = 'audit:export',
  ESTIMATES_READ = 'estimates:read',
  ESTIMATES_CREATE = 'estimates:create',
  ESTIMATES_UPDATE = 'estimates:update',
  ESTIMATES_DELETE = 'estimates:delete',
  PROJECTS_READ = 'projects:read',
  PROJECTS_CREATE = 'projects:create',
  PROJECTS_UPDATE = 'projects:update',
  PROJECTS_DELETE = 'projects:delete',
}

export type Role = 'master_admin' | 'admin' | 'project_manager' | 'sales_rep';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDefinition {
  name: Role;
  displayName: string;
  description: string;
  permissions: Permission[];
  isClientSpecific?: boolean;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: 'create' | 'update' | 'delete';
  targetUserId: string;
  roleChanged?: {
    from: string;
    to: string;
  };
  timestamp: Date;
}

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  master_admin: {
    name: 'master_admin',
    displayName: 'Master Administrator',
    description: 'Full system access with all permissions',
    permissions: Object.values(Permission),
    isClientSpecific: false,
  },
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Client-specific administrator with full access to client features',
    permissions: [
      Permission.USERS_READ,
      Permission.USERS_CREATE,
      Permission.USERS_UPDATE,
      Permission.USERS_DELETE,
      Permission.ESTIMATES_READ,
      Permission.ESTIMATES_CREATE,
      Permission.ESTIMATES_UPDATE,
      Permission.ESTIMATES_DELETE,
      Permission.PROJECTS_READ,
      Permission.PROJECTS_CREATE,
      Permission.PROJECTS_UPDATE,
      Permission.PROJECTS_DELETE,
      Permission.ANALYTICS_READ,
      Permission.ANALYTICS_EXPORT,
    ],
    isClientSpecific: true,
  },
  project_manager: {
    name: 'project_manager',
    displayName: 'Project Manager',
    description: 'Manages projects and estimates',
    permissions: [
      Permission.PROJECTS_READ,
      Permission.PROJECTS_CREATE,
      Permission.PROJECTS_UPDATE,
      Permission.ESTIMATES_READ,
      Permission.ESTIMATES_CREATE,
      Permission.ESTIMATES_UPDATE,
      Permission.ANALYTICS_READ,
    ],
    isClientSpecific: true,
  },
  sales_rep: {
    name: 'sales_rep',
    displayName: 'Sales Representative',
    description: 'Creates and manages estimates',
    permissions: [
      Permission.ESTIMATES_READ,
      Permission.ESTIMATES_CREATE,
      Permission.ESTIMATES_UPDATE,
      Permission.PROJECTS_READ,
    ],
    isClientSpecific: true,
  },
};