import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Navbar from '../components/common/Navbar';

import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import UpdatePasswordPage from '../pages/UpdatePasswordPage';
import HomePage from '../pages/HomePage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageStores from '../pages/admin/ManageStores';

import StoreListPage from '../pages/user/StoreListPage';

import OwnerDashboardPage from '../pages/StoreOwner/OwnerDashboardPage';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/update-password" element={
          <ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>
        } />
        <Route path="/user/change-password" element={<ProtectedRoute allowedRoles={['user']}><UpdatePasswordPage /></ProtectedRoute>} />
        <Route path="/owner/change-password" element={<ProtectedRoute allowedRoles={['store_owner']}><UpdatePasswordPage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['admin']}><ManageStores /></ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/add-store" element={<ProtectedRoute allowedRoles={['admin']}><ManageStores /></ProtectedRoute>} />

        {/* Normal user routes */}
        <Route path="/stores" element={
          <ProtectedRoute allowedRoles={['user']}><StoreListPage /></ProtectedRoute>
        } />
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><StoreListPage /></ProtectedRoute>} />
        <Route path="/user/stores" element={<ProtectedRoute allowedRoles={['user']}><StoreListPage /></ProtectedRoute>} />

        {/* Store owner routes */}
        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={['store_owner']}><OwnerDashboardPage /></ProtectedRoute>
        } />

        {/* Default redirect based on role */}
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
}
