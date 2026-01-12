import RestaurentSidebar from "../../components/ResturantSidebar";
import { useEffect, useState } from "react";

export default function RestaurantHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/restaurant/payments/today`,{
      credentials : "include"
    })
      .then((res) => res.json())
      .then((data) => {
        // 🔥 MAIN FIX: sirf ARRAY hi state me jaayega
        if (Array.isArray(data)) {
          setBills(data);
        } else if (Array.isArray(data.data)) {
          setBills(data.data);
        } else {
          setBills([]);
        }
      })
      .catch(() => {
        setBills([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <RestaurentSidebar />

      <div className="md:ml-64 flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Today Bills</h2>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* NO DATA */}
        {!loading && bills.length === 0 && (
          <p className="text-gray-600">No bills found</p>
        )}

        {/* BILLS LIST */}
        {!loading &&
          bills.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 mb-3 shadow rounded"
            >
              <p>
                <b>Amount:</b> ₹{b.amount}
              </p>
              <p>
                <b>Payment:</b> {b.payment_mode}
              </p>
              <p>
                <b>Date:</b> {b.payment_time}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
