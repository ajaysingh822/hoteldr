import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function HotelSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/dashboard`,{
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setRooms(data.occupied_rooms || []);
        }
      })
      .catch(console.error);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      name: "Dashboard",
      path: "/hotel-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Hotel Check-In",
      path: "/hotel/check-in",
      icon: PlusCircle,
    },
    {
      name: "Hotel Check-Out",
      path: "/hotel/check-out",
      icon: ClipboardCheck,
    },
    {
      name: "View History",
      path: "/hotel/history",
      icon: ClipboardCheck,
    },
  ];

  const logout = () => {
    localStorage.removeItem("counter_logged_in");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-950 text-white p-2 rounded-md shadow"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
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
        <div className="p-5 border-b border-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏨</span>
            <span className="font-bold text-white">
              DR Hotel Billing
            </span>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                ${
                  isActive(item.path)
                    ? "bg-red-700 text-white"
                    : "text-amber-200 hover:bg-amber-900 hover:text-white"
                }
              `}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}

          {/* Occupied Rooms */}
          <div className="mt-4">
            <h6 className="text-xs font-bold text-amber-300 mb-2">
              🔴 Occupied Rooms
            </h6>

            <div className="grid grid-cols-4 gap-1">
              {rooms.map((r, i) => (
                <div
                  key={i}
                  className="bg-red-900 text-white rounded
                             flex items-center justify-center
                             text-[11px] font-bold py-1"
                >
                  {r.room_no}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-amber-900 p-3 space-y-1">
          <Link
            to="/restaurant-dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md
                       text-amber-200 hover:bg-amber-900 hover:text-white"
          >
            <LayoutDashboard size={18} />
            <span className="text-sm">Go to Restaurant</span>
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md
                       text-amber-300 hover:bg-amber-900 hover:text-white"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* 🔻 FOOTER (exact screenshot style) */}
        <div className="mt-auto border-t border-amber-900 px-3 py-2
                        text-[11px] text-amber-400 flex justify-between">
          <span>
            Copyright ©{" "}
            <span className="text-amber-300 font-medium">
              DR Hotel And Restaurent
            </span>
            . All rights reserved. 
          </span>
          <span>Help 💬: 9343185294 , 8224950286
</span>
          <span className="text-amber-500">
            Version 3.2.0
          </span>
        </div>
      </div>
    </>
  );
}
