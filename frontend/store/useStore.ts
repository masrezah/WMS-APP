import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppRole = 'admin' | 'operator';

interface AppState {
  tenantName: string | null;
  setTenantName: (name: string) => void;
  role: AppRole;
  setRole: (role: AppRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (onboarded: boolean) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tenantName: null,
      setTenantName: (name) => set({ tenantName: name }),
      role: 'admin',
      setRole: (role) => set({ role }),
      isAuthenticated: false,
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      isOnboarded: false,
      setIsOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
      logout: () => set({ 
        isAuthenticated: false, 
        isOnboarded: false, 
        tenantName: null, 
        role: 'admin' 
      }),
    }),
    {
      name: 'wms-storage',
    }
  )
);
