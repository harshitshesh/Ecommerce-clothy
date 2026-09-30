/**
 * CLOZARI — Admin Auth Store (Zustand + persist → localStorage `clozari-admin-auth`)
 *
 * Mock staff/admin authentication:
 * Seeded credentials:
 *   Email: admin@clozari.com
 *   Password: Admin@123
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ADMIN_AUTH_KEY = 'clozari-admin-auth';

const SEEDED_ADMIN = {
  id: 'adm_master',
  name: 'Clozari Master Admin',
  email: 'admin@clozari.com',
  role: 'Store Manager',
};

const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,

      login: ({ email, password }) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        if (cleanEmail === 'admin@clozari.com' && password === 'Admin@123') {
          set({ admin: SEEDED_ADMIN });
          return { ok: true, admin: SEEDED_ADMIN };
        }
        return {
          ok: false,
          error: 'Invalid admin credentials. Use admin@clozari.com / Admin@123',
        };
      },

      logout: () => set({ admin: null }),

      isAuthenticated: () => get().admin !== null,
    }),
    {
      name: ADMIN_AUTH_KEY,
      partialize: (state) => ({ admin: state.admin }),
    }
  )
);

export default useAdminAuthStore;
