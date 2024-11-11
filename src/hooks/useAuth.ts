import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';
import { Permission } from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasPermission: (permission: string, clientId?: string) => boolean;
  hasAnyPermission: (permissions: Permission[], clientId?: string) => boolean;
  hasAllPermissions: (permissions: Permission[], clientId?: string) => boolean;
  isMasterAdmin: () => boolean;
}

// Mock user database
const MOCK_USERS = {
  'admin@effibuildpro.com': {
    id: '1',
    email: 'admin@effibuildpro.com',
    password: 'Mattox$14',
    name: 'Master Admin',
    role: 'master_admin',
    permissions: Object.values(Permission),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const mockUser = MOCK_USERS[email.toLowerCase()];
          if (!mockUser || mockUser.password !== password) {
            set({ user: null, error: 'Invalid email or password', isLoading: false });
            throw new Error('Invalid email or password');
          }

          const { password: _, ...userWithoutPassword } = mockUser;
          set({ user: userWithoutPassword, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign in', 
            isLoading: false 
          });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, error: null });
      },

      hasPermission: (permission: string, clientId?: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Master Admin has all permissions
        if (user.role === 'master_admin') return true;
        
        // For client-specific roles, check clientId match
        if (clientId && user.clientId && user.clientId !== clientId) return false;

        // Check if permission exists in Permission enum
        const isValidPermission = Object.values(Permission).includes(permission as Permission);
        if (!isValidPermission) return false;
        
        return user.permissions.includes(permission as Permission);
      },

      hasAnyPermission: (permissions: Permission[], clientId?: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Master Admin has all permissions
        if (user.role === 'master_admin') return true;
        
        // For client-specific roles, check clientId match
        if (clientId && user.clientId && user.clientId !== clientId) return false;
        
        return permissions.some(p => user.permissions.includes(p));
      },

      hasAllPermissions: (permissions: Permission[], clientId?: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Master Admin has all permissions
        if (user.role === 'master_admin') return true;
        
        // For client-specific roles, check clientId match
        if (clientId && user.clientId && user.clientId !== clientId) return false;
        
        return permissions.every(p => user.permissions.includes(p));
      },

      isMasterAdmin: () => {
        const { user } = get();
        return user?.role === 'master_admin';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);