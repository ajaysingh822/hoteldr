import RestaurentSidebar from "../../components/ResturantSidebar";
import { useEffect, useState } from "react";

export default function RestaurantHistory() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch("/api/restaurant/payments/today")
      .then(res => res.json())
      .then(data => setBills(data));
  }, []);

  return (
    <div className="flex bg-gray-100 p-6">
      <RestaurentSidebar />

      <div className="md:ml-64 flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Today Bills</h2>

        {bills.length === 0 && <p>No bills found</p>}

        {bills.map(b => (
          <div key={b.id} className="bg-white p-4 mb-3 shadow rounded">
            <p><b>Amount:</b> ₹{b.amount}</p>
            <p><b>Payment:</b> {b.payment_mode}</p>
            <p><b>Date:</b> {b.payment_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
