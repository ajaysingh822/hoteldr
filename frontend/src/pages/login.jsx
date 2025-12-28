import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("counter_logged_in", "true");
    navigate("/select-billing");
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-8 py-7 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <span className="text-3xl">🏨</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Counter Login
          </h1>
          <p className="mt-1 text-sm text-red-100">
            Hotel & Restaurant Billing System
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="px-8 py-7 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              required
              placeholder="Enter username"
              className="
                w-full h-11 rounded-lg border border-gray-300
                bg-gray-50 px-4 text-sm
                focus:outline-none focus:ring-2
                focus:ring-red-500 focus:border-red-500
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="
                w-full h-11 rounded-lg border border-gray-300
                bg-gray-50 px-4 text-sm
                focus:outline-none focus:ring-2
                focus:ring-red-500 focus:border-red-500
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full h-11 rounded-lg
              bg-red-700 text-white font-semibold
              hover:bg-red-800 transition
              shadow-md
            "
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="border-t bg-gray-50 py-3 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Billing Management
        </div>
      </div>
    </div>
  );
}
