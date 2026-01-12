import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function Roomnumber() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/dashboard`,{
      credentials: "include",
    })   // 👈 SAME API
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setRooms(data.occupied_rooms || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-amber-50 bg-cover"  style={{ backgroundImage: "url('/bg3.png')" }}>
      <AdminSidebar />

      <div className="flex-1 md:ml-64 p-5 md:p-6 pb-20">
        <h1 className="text-2xl font-bold text-amber-900 mb-6">
          🔴 Occupied Rooms
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500">No occupied rooms</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {rooms.map((r, i) => (
              <div
                key={i}
                className="bg-red-900 text-white rounded-xl shadow
                           flex items-center justify-center
                           h-20 font-bold text-lg p-5" 
              >
               Room No. {r.room_no}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
