// src/pages/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, checking } = useAuth();

  if (checking) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const email = user.email?.toLowerCase();
  const isAdmin = email.startsWith('admin');

  // 🔒 Technician trying to access admin route
  if (role === 'admin' && !isAdmin) return <Navigate to="/login" />;

  // 🔒 Technicians can access their own routes only
  if (role === 'tech' && isAdmin === true) {
    // Admins can access tech routes too ✅
    return children;
  }

  // ✅ All good
  return children;
};

export default ProtectedRoute;
