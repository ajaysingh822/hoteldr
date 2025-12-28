import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { Input } from "../shared/Input";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/admin/dashboard");
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1566073771259-6a8506099945')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl">
        
        {/* header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-8 py-7 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <span className="text-3xl">🏨</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Hotel Admin Login
          </h1>
          <p className="mt-1 text-sm text-red-100">
            Manage your hotel dashboard
          </p>
        </div>

        {/* form */}
        <form
          onSubmit={handleLogin}
          className="px-8 py-7 space-y-5"
        >
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="admin@hotel.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            Login to Dashboard
          </Button>
        </form>

        {/* footer */}
        <div className="border-t bg-gray-50 py-3 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Hotel Management System
        </div>
      </div>
    </div>
  );
}
