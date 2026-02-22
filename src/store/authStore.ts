import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, isStaff as isStaffHelper, isSuperAdmin as isSuperAdminHelper } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isSuperAdmin: () => boolean;
  isStaff: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      isSuperAdmin: () => {
        const role = get().user?.role;
        return role ? isSuperAdminHelper(role) : false;
      },
      isStaff: () => {
        const role = get().user?.role;
        return role ? isStaffHelper(role) : false;
      },
    }),
    { name: 'auth-storage' }
  )
);
