import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        credentials: "include", // 🔥 CI session ke liye MUST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid ID or Password");
      }

      toast.success("Login successful ✅");
      navigate("/select-type", { replace: true });

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url(bg3.png)",
      }}
    >

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-8 py-7 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <span className="text-3xl">🏨</span>
          </div>
          <h1 className="text-xl font-bold text-white">Counter Login</h1>
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
              placeholder="Enter username"
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
              placeholder="••••••••"
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
     <p className="text-center "> 
      <button className="bg-slate-400 rounded-xl p-2 text-white hover:bg-slate-600" onClick={()=> navigate("/admin-login")}>CLick Here For Admin</button></p>
        <div className="border-t bg-gray-50 py-3 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Billing Management
        </div>
      </div>
      <div></div> 
    </div>
    
  );
}
