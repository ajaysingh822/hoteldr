import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ VERY IMPORTANT
    setLoading(true);

    try {
      const res = await fetch("https://api.drhotel.site/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        localStorage.setItem("admin", JSON.stringify(data.admin));

        toast.success("Admin Login Successful");
        navigate("/admin-dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url(bg3.png)" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-red-600 px-8 py-7 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <span className="text-3xl">🏨</span>
          </div>
          <h1 className="text-xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-red-100">
            Hotel Dr & Restaurant Billing System
          </p>
        </div>

        <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-red-700 text-white font-semibold
                       hover:bg-red-800 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
      <button className="bg-slate-400 w-full rounded-xl p-2 text-white hover:bg-slate-600" onClick={()=> navigate("/login")}>CLick Here For COunter</button></p>

        <div className="border-t bg-gray-50 py-3 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} DR Billing Management Support : 9343185294 , 8224950286 
        </div>
      </div>
    </div>
  );
}
