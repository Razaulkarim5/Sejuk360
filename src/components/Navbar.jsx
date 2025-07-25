// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null; // 🔒 Hide navbar if not logged in

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed');
    }
  };

  const linkClass = (path) =>
    location.pathname.startsWith(path)
      ? 'font-bold underline text-yellow-300'
      : 'hover:underline';

  return (
    <nav className="bg-blue-600 text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
      <h1 className="font-bold text-lg">Sejuk Sejuk Service Sdn Bhd</h1>
      <div className="flex items-center gap-4 text-sm">
        <NavLink to="/admin" className={linkClass('/admin')}>Admin</NavLink>
        <NavLink to="/technician" className={linkClass('/technician')}>Technician</NavLink>
        <NavLink to="/dashboard" className={linkClass('/dashboard')}>Dashboard</NavLink>
        <button
          onClick={handleLogout}
          className="underline hover:text-red-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
