/**
 * CLOZARI — Auth Store (Zustand + persist)
 *
 * MOCK AUTHENTICATION ONLY.
 * Passwords are kept in plain text in localStorage purely so the showcase works
 * without a server. Real password hashing (bcrypt / argon2) and credential
 * verification belong on a backend — never ship this pattern to production.
 *
 * Persistence fans out into two localStorage keys:
 *   - `clozari-users`   → registered users (array)
 *   - `clozari-session` → the signed-in user (object) or null
 *
 * The session object NEVER contains the password.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useWalletStore from './useWalletStore';

const USERS_KEY = 'clozari-users';
const SESSION_KEY = 'clozari-session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Seeded on first load so the showcase can be demoed instantly. */
const DEMO_USER = {
  id: 'usr_demo',
  name: 'Demo Patron',
  email: 'demo@clozari.com',
  phone: '9876000000',
  password: 'Demo@123',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  joinedDate: '2026-01-15',
  addresses: [],
};

const normaliseEmail = (email = '') => String(email).trim().toLowerCase();

/** Public session shape — deliberately drops the password. */
const toSession = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  joinedDate: user.joinedDate,
});

/**
 * Custom persist storage: zustand hands us the whole state as one blob, we
 * split it across the two keys the app expects (`clozari-users` + `clozari-session`).
 */
const splitStorage = {
  getItem: (_name) => {
    try {
      const usersRaw = window.localStorage.getItem(USERS_KEY);
      const sessionRaw = window.localStorage.getItem(SESSION_KEY);
      if (usersRaw === null && sessionRaw === null) return null;
      return {
        state: {
          users: usersRaw ? JSON.parse(usersRaw) : [],
          session: sessionRaw ? JSON.parse(sessionRaw) : null,
        },
        version: 0,
      };
    } catch {
      return null;
    }
  },
  setItem: (_name, value) => {
    const state = value?.state ?? {};
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(state.users ?? []));
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(state.session ?? null));
    } catch {
      /* storage full / unavailable — auth simply stays in memory */
    }
  },
  removeItem: (_name) => {
    window.localStorage.removeItem(USERS_KEY);
    window.localStorage.removeItem(SESSION_KEY);
  },
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [],
      session: null,
      /** Add-to-cart attempt interrupted by the auth gate (see gateCartAction). */
      pendingCartAction: null,

      /** Create an account. Rejects duplicate emails. */
      signup: ({ name, email, phone, password }) => {
        const key = normaliseEmail(email);
        if (!name?.trim() || !key || !phone?.trim() || !password) {
          return { ok: false, error: 'Please fill in every field to continue.' };
        }
        if (!EMAIL_RE.test(key)) {
          return { ok: false, error: 'That doesn’t look like a valid email address.' };
        }
        if (String(password).length < 8) {
          return { ok: false, error: 'Choose a password of at least 8 characters.' };
        }
        if (get().users.some((u) => normaliseEmail(u.email) === key)) {
          return {
            ok: false,
            error: 'An account already exists for this email. Try logging in instead.',
          };
        }

        const user = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: key,
          phone: String(phone).trim(),
          password,
          avatar: null,
          joinedDate: new Date().toISOString().slice(0, 10),
          /** Addresses live inside the user record — nobody starts with any. */
          addresses: [],
        };

        set((state) => ({ users: [...state.users, user], session: toSession(user) }));
        useWalletStore.getState().ensureWallet(user.id);
        return { ok: true, user: toSession(user) };
      },

      /** Verify credentials against the mock user list. */
      login: ({ email, password }) => {
        const key = normaliseEmail(email);
        if (!key || !password) {
          return { ok: false, error: 'Enter your email and password to continue.' };
        }
        const user = get().users.find((u) => normaliseEmail(u.email) === key);
        if (!user) {
          return { ok: false, error: 'We couldn’t find an account for that email.' };
        }
        if (user.password !== password) {
          return { ok: false, error: 'That password doesn’t match our records. Please try again.' };
        }
        set({ session: toSession(user) });
        useWalletStore.getState().ensureWallet(user.id);
        return { ok: true, user: toSession(user) };
      },

      /** Sign out — clears the session and any interrupted action. */
      logout: () => set({ session: null, pendingCartAction: null }),

      isLoggedIn: () => get().session !== null,

      /** The full record (with addresses) of whoever is signed in. */
      getCurrentUser: () => {
        const session = get().session;
        if (!session) return null;
        return get().users.find((u) => u.id === session.id) || null;
      },

      /** Save an address on the signed-in user's record. */
      addAddress: (address) => {
        const session = get().session;
        if (!session) return null;
        let saved = null;
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== session.id) return u;
            const book = u.addresses || [];
            saved = {
              ...address,
              id: `addr_${Date.now()}`,
              phone: address.phone || session.phone || '',
              isDefault: Boolean(address.isDefault) || book.length === 0,
            };
            return { ...u, addresses: [...book, saved] };
          }),
        }));
        return saved;
      },

      /** Remove one of the signed-in user's addresses. */
      removeAddress: (id) => {
        const session = get().session;
        if (!session) return;
        set((state) => ({
          users: state.users.map((u) =>
            u.id === session.id
              ? { ...u, addresses: (u.addresses || []).filter((a) => a.id !== id) }
              : u
          ),
        }));
      },

      /**
       * Auth gate for add-to-cart.
       * Returns `false` when the visitor is signed in (caller proceeds with the
       * real add) and `true` when the attempt was intercepted — the caller must
       * then stop and let AuthPromptModal take over.
       */
      gateCartAction: (action) => {
        if (get().session) return false;
        set({ pendingCartAction: action });
        return true;
      },

      setPendingCartAction: (action) => set({ pendingCartAction: action }),
      clearPendingCartAction: () => set({ pendingCartAction: null }),
    }),
    {
      name: 'clozari-auth', // label only — splitStorage owns the real keys
      version: 0,
      storage: splitStorage,
      partialize: (state) => ({ users: state.users, session: state.session }),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted || {}) };
        if (!Array.isArray(merged.users) || merged.users.length === 0) {
          merged.users = [DEMO_USER];
        }
        // Every account owns its address book; nobody is seeded with one.
        merged.users = merged.users.map((u) => ({
          ...u,
          addresses: Array.isArray(u.addresses) ? u.addresses : [],
        }));
        // Rebuild the session defensively so a stray password never survives a reload.
        merged.session = merged.session ? toSession(merged.session) : null;
        return merged;
      },
    }
  )
);

export default useAuthStore;
