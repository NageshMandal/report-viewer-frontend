import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import Reports from '@/pages/Reports';
import AdminPanel from '@/pages/AdminPanel';

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/reports" /> : <Login />} />
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
