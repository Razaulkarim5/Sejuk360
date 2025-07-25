// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import JobDetails from './pages/JobDetails';
import Navbar from './components/Navbar';
import KPIDashboard from './pages/KPIDashboard';
import OrderForm from './components/OrderForm';
import TechnicianForm from './components/TechnicianForm';
import { useAuth } from './utils/AuthContext';

function App() {
  const { user, checking } = useAuth();

  if (checking) return <div className="p-10 text-center">Loading authentication...</div>;

  return (
    <Router>
      {/* ✅ Show Navbar only after login */}
      {user && <Navbar />}

      <Routes>
        {/* ✅ Default Route: Always go to /login if not logged in */}
        <Route path="/" element={<Navigate to={user ? "/technician" : "/login"} />} />

        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Admin-only Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/order" element={
          <ProtectedRoute role="admin">
            <OrderForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute role="admin">
            <KPIDashboard />
          </ProtectedRoute>
        } />

        {/* ✅ Technician (or Admin) Routes */}
        <Route path="/technician" element={
          <ProtectedRoute role="tech">
            <TechnicianDashboard />
          </ProtectedRoute>
        } />
        <Route path="/technician/job/:jobId" element={
          <ProtectedRoute role="tech">
            <TechnicianForm />
          </ProtectedRoute>
        } />

        {/* ✅ Catch-all: Redirect all unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
