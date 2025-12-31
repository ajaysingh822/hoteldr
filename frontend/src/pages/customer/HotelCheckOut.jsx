import { useEffect, useState } from "react";
import Sidebar from "../../components/HotelSidebar";
import { useNavigate } from "react-router-dom";

export default function HotelCheckOut() {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/guests/checked-in")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setGuests(data.guests);
        }
      });
  }, []);

  return ( 
    <div className="flex  bg-cover bg-center" 
    >
      <Sidebar />

      <div className="flex-1 bg-amber-50 min-h-screen md:ml-64 p-6 bg-cover bg-center"  
        style={{
    backgroundImage: "url('/bg2.png')",
  }} 
      >
        <div className="max-w-6xl mx-auto bg-white md:p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">
            ✅ Hotel Check-Out
          </h1>

          {guests.length === 0 ? (
            <p>No guests ready for checkout</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Guest</th>
                  <th className="border p-2">Room</th>
                  <th className="border p-2">Room Bill / Day</th>
                  <th className="border p-2">Extra Charges</th>
                  <th className="border p-2">Total Till Now</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {guests.map(g => {
                const totalTillNow =
  parseFloat(g.rate) + parseFloat(g.extra_total || 0);


                  return (
                    <tr key={g.id}>
                      <td className="border p-2">{g.name}</td>
                      <td className="border p-2">{g.room_no}</td>
                      <td className="border p-2">₹{g.rate}</td>
                      <td className="border p-2">₹{g.extra_total}</td>
                      <td className="border p-2 font-bold">
                        ₹{totalTillNow}
                      </td>
                      <td className="border p-2 space-x-2">
                        <button
                          onClick={() => navigate(`/hotel/charges/${g.id}`)}
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          + Charges
                        </button>

                        <button
                          onClick={() => navigate(`/hotel/billing/${g.id}`)}
                          className="bg-orange-600 text-white px-2 py-1 rounded"
                        >
                          Billing
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
