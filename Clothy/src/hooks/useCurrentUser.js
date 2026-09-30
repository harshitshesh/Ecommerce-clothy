import { useMemo } from 'react';
import useAuthStore from '../store/useAuthStore';

/** The full record of whoever is signed in (undefined when signed out). */
export default function useCurrentUser() {
  const users = useAuthStore((s) => s.users);
  const sessionId = useAuthStore((s) => s.session?.id);
  return useMemo(() => users.find((u) => u.id === sessionId), [users, sessionId]);
}

/** Signed-in user's own address book — never seeded, never shared. */
const NO_ADDRESSES = [];

export function useAddresses() {
  const user = useCurrentUser();
  return user?.addresses || NO_ADDRESSES;
}

/** Convenience: signed-in session (id, name, email, phone, avatar). */
export function useSession() {
  return useAuthStore((s) => s.session);
}
