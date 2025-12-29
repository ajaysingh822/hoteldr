import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardCheck,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function RestaurantSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      name: "Dashboard",
      path: "/restaurant-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "new bill",
      path: "/table-number",
      icon: PlusCircle,
    },
    {
      name: "Hotel Check-Out",
      path: "/hotel/check-out",
      icon: ClipboardCheck,
    },
  ];

  const logout = () => {
    localStorage.removeItem("counter_logged_in");
    navigate("/login");
  };

  return (
    <>
      {/* 🔹 Mobile top button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-950 text-white p-2 rounded-md shadow"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* 🔹 Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 bg-amber-950 text-amber-100
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex md:flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-lg text-white">
              Restaurant Billing
            </span>
          </div>

          {/* Close (mobile) */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive(item.path)
                    ? "bg-red-700 text-white shadow-md"
                    : "text-amber-200 hover:bg-amber-900 hover:text-white"
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-amber-900">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg
                       text-amber-300 hover:bg-amber-900 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
