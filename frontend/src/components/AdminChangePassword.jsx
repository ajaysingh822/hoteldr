import { useState } from "react";
import toast from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminChangePassword() {
  const [role, setRole] = useState("admin");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // 👁 show / hide
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      return toast.error("All fields are required");
    }

    if (newPass !== confirmPass) {
      return toast.error("New password does not match");
    }

    const toastId = toast.loading("Changing password...");

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          old_password: oldPass,
          new_password: newPass,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success(data.message || "Password changed", { id: toastId });

        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        toast.error(data.message || "Failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Server error", { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 md:ml-64 p-6">
        <h2 className="text-2xl font-bold mb-6">
          🔐 Change Password
        </h2>

        <div className="bg-white p-6 rounded shadow max-w-md">

          {/* ROLE */}
          <select
            className="border p-2 w-full mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="counter">Counter</option>
          </select>

          {/* OLD PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Old Password"
              className="border p-2 w-full pr-12"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
            <span
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-600"
            >
              {showOld ? "Hide" : "Show"}
            </span>
          </div>

          {/* NEW PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              className="border p-2 w-full pr-12"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <span
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-600"
            >
              {showNew ? "Hide" : "Show"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-4">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              className="border p-2 w-full pr-12"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-600"
            >
              {showConfirm ? "Hide" : "Show"}
            </span>
          </div>

          <button
            onClick={submit}
            className="bg-amber-700 text-white px-4 py-2 rounded w-full"
          >
            Change Password
          </button>

        </div>
      </div>
    </div>
  );
}
