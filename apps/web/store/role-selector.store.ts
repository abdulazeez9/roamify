import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomerRole } from '@zagotours/types';

interface RoleState {
  role: string | CustomerRole;
  setRole: (newRole: string | CustomerRole) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: '',
      setRole: (newRole) => set({ role: newRole }),
    }),
    {
      name: 'user-role-storage',
    },
  ),
);
