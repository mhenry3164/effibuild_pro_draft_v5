import { useState } from 'react';
import type { User } from '@/types';

// Mock data for development
let mockUsers: User[] = [
  {
    id: '1',
    name: 'Master Admin',
    email: 'admin@effibuildpro.com',
    role: 'master_admin',
    permissions: [
      'roles:manage:all',
      'audit:read',
      'audit:export',
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
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In development, use mock data
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    setError(null);
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name!,
        email: userData.email!,
        role: userData.role!,
        permissions: userData.permissions || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update mock storage
      mockUsers = [...mockUsers, newUser];
      
      // Update state
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setError(null);
    try {
      // Update mock storage
      mockUsers = mockUsers.map(user =>
        user.id === id
          ? {
              ...user,
              ...userData,
              updatedAt: new Date(),
            }
          : user
      );
      
      // Update state
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    setError(null);
    try {
      // Update mock storage
      mockUsers = mockUsers.filter(user => user.id !== id);
      
      // Update state
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}