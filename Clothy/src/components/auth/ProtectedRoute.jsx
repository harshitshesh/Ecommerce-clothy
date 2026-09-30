/**
 * ProtectedRoute — sends signed-out visitors to /login?redirect=<path>
 * Used for /checkout and every /account/* route. /cart stays viewable.
 */
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function ProtectedRoute({ children }) {
  const session = useAuthStore((s) => s.session);
  const location = useLocation();

  if (!session) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return children;
}
