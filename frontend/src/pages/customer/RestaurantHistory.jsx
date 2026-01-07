import ResturantSidebar from "../../components/ResturantSidebar";
import { useEffect, useState } from "react";

export default function RestaurantHistory() {
  const [bills, setBills] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // today date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTodayBills();
  }, []);

  const fetchTodayBills = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/restaurant/history?date=${today}`
      );

      const data = await res.json();
      setBills(data || []);

      const sum = (data || []).reduce(
        (acc, b) => acc + Number(b.amount),
        0
      );
      setTotal(sum);
    } catch (err) {
      console.error("Failed to load restaurant history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ResturantSidebar />

      <div className="md:ml-64 flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          Restaurant Billing History (Today)
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* TOTAL CARD */}
            <div className="bg-white p-4 rounded shadow mb-6">
              <div className="text-lg font-semibold">
                Today Total Collection
              </div>
              <div className="text-3xl font-bold text-green-700">
                ₹ {total}
              </div>
            </div>

            {/* HISTORY TABLE */}
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Payment</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bills.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        No bills found for today
                      </td>
                    </tr>
                  )}

                  {bills.map((b, i) => (
                    <tr key={b.id} className="border-t">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">₹ {b.amount}</td>
                      <td className="p-2">{b.payment_mode}</td>
                      <td className="p-2">
                        {new Date(b.payment_time).toLocaleTimeString()}
                      </td>
                      <td className="p-2">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
