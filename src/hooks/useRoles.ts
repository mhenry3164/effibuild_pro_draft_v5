import { useState } from 'react';
import axios from 'axios';
import type { Role, Permission, RoleDefinition } from '@/types/auth';

interface UseRolesReturn {
  roles: RoleDefinition[];
  isLoading: boolean;
  error: string | null;
  fetchRoles: (clientId?: string) => Promise<void>;
  createRole: (roleData: CreateRoleData) => Promise<void>;
  updateRole: (name: Role, roleData: UpdateRoleData) => Promise<void>;
  deleteRole: (name: Role) => Promise<void>;
}

interface CreateRoleData {
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  isClientSpecific?: boolean;
  clientId?: string;
}

interface UpdateRoleData {
  displayName?: string;
  description?: string;
  permissions?: Permission[];
}

// Mock data for development
const INITIAL_ROLES: RoleDefinition[] = [
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full access to client-specific features and settings',
    permissions: [
      'quotes:read',
      'quotes:create',
      'quotes:update',
      'quotes:delete',
      'clients:read',
      'clients:create',
      'clients:update',
      'clients:delete',
      'analytics:read',
      'analytics:export',
      'users:read',
      'users:create',
      'users:update',
      'users:delete',
      'roles:manage'
    ],
    isClientSpecific: true,
  },
  {
    name: 'project_manager',
    displayName: 'Project Manager',
    description: 'Manage projects and team performance',
    permissions: [
      'quotes:read',
      'quotes:create',
      'quotes:update',
      'analytics:read',
      'analytics:export'
    ],
    isClientSpecific: true,
  }
];

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async (clientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // In development, use mock data
      // In production, this would be an API call
      setRoles(INITIAL_ROLES);
    } catch (err) {
      setError('Failed to fetch roles');
      console.error('Error fetching roles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async (roleData: CreateRoleData) => {
    setError(null);
    try {
      // In development, update local state
      // In production, this would be an API call
      const newRole: RoleDefinition = {
        name: roleData.name as Role,
        displayName: roleData.displayName,
        description: roleData.description,
        permissions: roleData.permissions,
        isClientSpecific: roleData.isClientSpecific,
      };
      setRoles(prev => [...prev, newRole]);
    } catch (err) {
      setError('Failed to create role');
      console.error('Error creating role:', err);
      throw err;
    }
  };

  const updateRole = async (name: Role, roleData: UpdateRoleData) => {
    setError(null);
    try {
      // In development, update local state
      // In production, this would be an API call
      setRoles(prev =>
        prev.map(role =>
          role.name === name
            ? { ...role, ...roleData }
            : role
        )
      );
    } catch (err) {
      setError('Failed to update role');
      console.error('Error updating role:', err);
      throw err;
    }
  };

  const deleteRole = async (name: Role) => {
    setError(null);
    try {
      // In development, update local state
      // In production, this would be an API call
      setRoles(prev => prev.filter(role => role.name !== name));
    } catch (err) {
      setError('Failed to delete role');
      console.error('Error deleting role:', err);
      throw err;
    }
  };

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}