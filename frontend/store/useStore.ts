import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppRole = 
  | 'SUPER_ADMIN' 
  | 'TENANT_ADMIN' 
  | 'PURCHASING'
  | 'RESOURCES'
  | 'WAREHOUSE_OPERATOR' 
  | 'FINANCE'
  | 'PRODUCTION'
  | 'SHIPMENT';

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
  activeModules: string[];
  toggleAddon: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tenantName: null,
      setTenantName: (name) => set({ tenantName: name }),
      role: 'TENANT_ADMIN', // Defaulting to Tenant Admin for demonstration
      setRole: (role) => set({ role }),
      isAuthenticated: false,
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      isOnboarded: false,
      setIsOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
      logout: () => set({ 
        isAuthenticated: false, 
        isOnboarded: false, 
        tenantName: null, 
        role: 'TENANT_ADMIN',
        activeModules: ['inventory-valuation']
      }),
      activeModules: ['inventory-valuation'],
      toggleAddon: (id) => set((state) => ({
        activeModules: state.activeModules.includes(id)
          ? state.activeModules.filter(modId => modId !== id)
          : [...state.activeModules, id]
      })),
    }),
    {
      name: 'wms-storage',
    }
  )
);
