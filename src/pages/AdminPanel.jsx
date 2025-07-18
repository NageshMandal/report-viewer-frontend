import { useState } from "react";
import API from "@/api/api";
import Navbar from "@/components/Navbar"; // adjust path as needed

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [msg, setMsg] = useState("");

  const handleAdd = async () => {
    try {
      await API.post("/admin/add-user", { email, role });
      setMsg("✅ Role assigned successfully!");
      setEmail("");
    } catch (err) {
      setMsg(err.response?.data?.error || "❌ Failed to assign role.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#3F1470]">Admin Panel</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
            <input
              type="email"
              placeholder="Enter user email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3F1470]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3F1470]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-[#3F1470] text-white py-2 rounded-md font-medium hover:bg-[#34115d] transition-colors"
          >
            Assign Role
          </button>

          {msg && (
            <p className="text-center text-sm mt-2 text-gray-700">{msg}</p>
          )}
        </div>
      </div>
    </>
  );
}
