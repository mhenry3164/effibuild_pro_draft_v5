import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { Permission } from '../types/auth';

describe('useAuth', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.signOut();
    });
    localStorage.clear();
  });

  describe('initialization', () => {
    it('initializes with null user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
    });

    it('initializes with no loading state', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('authentication', () => {
    it('handles sign in successfully', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      expect(result.current.user).toBeTruthy();
      expect(result.current.user?.email).toBe('admin@effibuildpro.com');
      expect(result.current.error).toBeNull();
    });

    it('handles invalid credentials', async () => {
      const { result } = renderHook(() => useAuth());

      try {
        await act(async () => {
          await result.current.signIn('wrong@email.com', 'wrongpass');
        });
      } catch (error) {
        expect(error.message).toBe('Invalid email or password');
      }

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid email or password');
    });

    it('handles sign out', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      act(() => {
        result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('permission checks', () => {
    it('checks valid permissions correctly', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      expect(result.current.hasPermission(Permission.USERS_READ)).toBe(true);
      expect(result.current.hasPermission('nonexistent:permission')).toBe(false);
    });

    it('handles empty or null permission sets', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      expect(result.current.hasAllPermissions([])).toBe(true);
      expect(result.current.hasAnyPermission([])).toBe(true);
    });

    it('handles client-specific permissions', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      expect(result.current.hasPermission(Permission.USERS_READ, 'client-1')).toBe(true);
      expect(result.current.hasPermission(Permission.USERS_READ, 'non-existent-client')).toBe(true);
    });

    it('checks multiple permissions correctly', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      expect(result.current.hasAllPermissions([Permission.USERS_READ, Permission.USERS_CREATE])).toBe(true);
      expect(result.current.hasAnyPermission([Permission.USERS_READ, 'nonexistent:permission' as Permission])).toBe(true);
    });
  });

  describe('role checks', () => {
    it('identifies master admin correctly', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('admin@effibuildpro.com', 'Mattox$14');
      });

      expect(result.current.isMasterAdmin()).toBe(true);
    });

    it('handles non-master admin roles correctly', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isMasterAdmin()).toBe(false);
    });
  });
});