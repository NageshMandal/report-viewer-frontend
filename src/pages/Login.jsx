import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/api';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email });
      const { token, role } = res.data;

      login(token, role);

      // Role-based redirect
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/reports');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center space-y-6 border border-gray-200">
        {/* Logo */}
        <img
          src="https://perceivenow.ai/images/logo.svg"
          alt="Perceive Now Logo"
          className="h-12 mx-auto"
        />

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">Login</h1>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F1470]"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#3F1470] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#2e0f57] transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
