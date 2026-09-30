/**
 * AdminProtectedRoute — Guards `/admin/*` routes
 * Redirects unauthenticated sessions to `/admin/login`
 */
import { Navigate, useLocation } from 'react-router-dom';
import useAdminAuthStore from '../../store/useAdminAuthStore';

export default function AdminProtectedRoute({ children }) {
  const isAuthenticated = useAdminAuthStore((s) => s.admin !== null);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
