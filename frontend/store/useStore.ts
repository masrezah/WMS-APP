import { create } from 'zustand';

export type AppRole = 'admin' | 'operator';

interface AppState {
  tenantName: string | null;
  setTenantName: (name: string) => void;
  role: AppRole;
  setRole: (role: AppRole) => void;
}

export const useStore = create<AppState>((set) => ({
  tenantName: null,
  setTenantName: (name) => set({ tenantName: name }),
  role: 'admin',
  setRole: (role) => set({ role }),
}));
