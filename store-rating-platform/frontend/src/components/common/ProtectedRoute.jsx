import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Usage: <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
 * - Not logged in -> redirect to /login
 * - Logged in but wrong role -> redirect to their own home
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
