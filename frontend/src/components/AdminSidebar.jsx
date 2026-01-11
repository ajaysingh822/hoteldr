import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut, Bed ,UtensilsCrossed , Key
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Rooms",
      path: "/room-number",
      icon: Bed,
    //   center: true, // 👈 mobile center button
    },
     {
      name: "Restaurent",
      path: "/admin/restaurant",
      icon: UtensilsCrossed,
    //   center: true, // 👈 mobile center button
    },
     {
      name: "Change Password",
      path: "/admin/change-password",
      icon: Key,
    //   center: true, // 👈 mobile center button
    },
  ];

  const logout = () => {
    localStorage.removeItem("counter_logged_in");
    navigate("/admin-login");
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-amber-950 text-amber-100 flex-col z-40">
        {/* Header */}
        <div className="p-6 border-b border-amber-900">
          <h2 className="font-bold text-lg text-white">
            DR-Restaurant 
          </h2>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive(item.path)
                    ? "bg-red-700 text-white"
                    : "hover:bg-amber-900 text-amber-200"
                }
              `}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-amber-900">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg
                       hover:bg-amber-900 text-amber-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow z-50">
        <div className="flex justify-around items-center h-14">

          {navItems.map((item) =>
            item.center ? (
              // Center floating button
              <Link
                key={item.path}
                to={item.path}
                className="bg-amber-600 text-white p-4 rounded-full -mt-8 shadow-lg"
              >
                <item.icon size={26} />
              </Link>
            ) : (
              // Normal bottom item
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center text-xs ${
                  isActive(item.path)
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          )}

          {/* Logout (mobile) */}
          <button
            onClick={logout}
            className="flex flex-col items-center text-xs text-gray-500"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>
      </div>
    </>
  );
}
