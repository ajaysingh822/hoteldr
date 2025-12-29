import { useEffect, useState } from "react";
import Sidebar from "../../components/HotelSidebar";
import { useNavigate } from "react-router-dom";

export default function HotelCheckOut() {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("checkedInGuests")) || [];
    setGuests(data.filter(g => g.status === "checked_in"));
  }, []);

  const goToBilling = (guest) => {
    const all =
      JSON.parse(localStorage.getItem("checkedInGuests")) || [];

    const updated = all.map(g =>
      g.id === guest.id ? { ...g, status: "billing" } : g
    );

    localStorage.setItem("checkedInGuests", JSON.stringify(updated));

    navigate(`/hotel/billing/${guest.id}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-amber-50 min-h-screen p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

          <h1 className="text-2xl font-bold mb-6">
            ✅ Hotel Check-Out
          </h1>

          {guests.length === 0 ? (
            <p>No guests ready for checkout</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Guest</th>
                  <th className="border p-2">Room</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(g => (
                  <tr key={g.id}>
                    <td className="border p-2">{g.name}</td>
                    <td className="border p-2">{g.roomNo}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => goToBilling(g)}
                        className="bg-orange-600 text-white px-3 py-1 rounded"
                      >
                        Go to Billing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}
