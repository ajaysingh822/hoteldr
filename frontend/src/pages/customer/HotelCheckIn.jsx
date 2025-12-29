import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function HotelCheckIn() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [rate, setRate] = useState("");

  const handleCheckIn = () => {
    if (!name || !roomNo || !rate) {
      alert("Please fill all details");
      return;
    }

    const existing =
      JSON.parse(localStorage.getItem("checkedInGuests")) || [];

    const newGuest = {
      id: Date.now(),
      name,
      roomNo,
      rate: Number(rate),
      checkInTime: new Date().toLocaleString(),
      status: "checked_in",
    };

    localStorage.setItem(
      "checkedInGuests",
      JSON.stringify([...existing, newGuest])
    );

    navigate("/hotel/check-out");
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="md:ml-64 bg-amber-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">
            ➕ Hotel Check-In
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Guest Name"
              className="border px-4 py-2 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Room No"
              className="border px-4 py-2 rounded-lg"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
            />

            <input
              type="number"
              placeholder="Room Rate / Day"
              className="border px-4 py-2 rounded-lg"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <button
            onClick={handleCheckIn}
            className="mt-6 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800"
          >
            Save Check-In
          </button>
        </div>
      </div>
    </>
  );
}
