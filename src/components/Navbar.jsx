import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // First redirect
    window.location.reload(); // Then force full page reload
  };  

  return (
    <nav className="flex items-center justify-between px-6 py-3 border border-gray-200 rounded-xl shadow-sm bg-white">
      {/* Left Section: Logo and Nav Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://market-now.perceivenow.ai/_next/image?url=%2Fassets%2Flogo.svg&w=384&q=75"
            alt="Market Now Logo"
            className="w-40 h-10"
          />
        </Link>

        <div className="flex gap-6 text-gray-600 font-medium">
          <Link to="/">Home</Link>
          <Link to="/reports">Reports</Link>
          {user?.role === "admin" && (
            <Link to="/admin">Add User</Link>
          )}
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="border border-[#3F1470] text-[#3F1470] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#f5f3fa] transition"
        >
          Logout
        </button>
        <button className="bg-[#3F1470] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#33105e] transition">
          Explore
        </button>
      </div>
    </nav>
  );
}
