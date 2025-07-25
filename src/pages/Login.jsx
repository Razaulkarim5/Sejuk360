// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const { email } = JSON.parse(stored);
      if (email.startsWith('admin')) {
        navigate('/admin');
      } else {
        navigate('/technician');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //// Removed: localStorage.setItem (handled by AuthContext)

      if (email.toLowerCase().startsWith('admin')) {
        navigate('/admin');
      } else {
        navigate('/technician');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="text-sm flex items-center mt-1 space-x-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Show Password</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In now
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{' '}
          <button
            type="button"
            className="text-green-600 hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign up here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
