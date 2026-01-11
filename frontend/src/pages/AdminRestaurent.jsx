import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminRestaurant() {
  const [today, setToday] = useState(0);
  const [month, setMonth] = useState(0);
  const [rangeTotal, setRangeTotal] = useState(0);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch("/api/extra-charges/today-grand")
      .then(r => r.json())
      .then(d => d.status === "success" && setToday(d.grand_total || 0));

    fetch("/api/extra-charges/month-grand")
      .then(r => r.json())
      .then(d => d.status === "success" && setMonth(d.grand_total || 0));
  }, []);

  const fetchRange = () => {
    if (!from || !to) return;

    fetch(`/api/extra-charges/range-grand?from=${from}&to=${to}`)
      .then(r => r.json())
      .then(d => d.status === "success" && setRangeTotal(d.grand_total || 0));
  };

  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminSidebar />

      <div className="flex-1 md:ml-64 p-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">
          🍽️ Restaurant Dashboard
        </h1>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card title="Today Sale" value={today} />
          <Card title="This Month Sale" value={month} />
        </div>

        {/* Custom range */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">
            📅 Custom Date Range
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <button
              onClick={fetchRange}
              className="bg-amber-700 text-white px-4 py-2 rounded"
            >
              Get Total
            </button>
          </div>

          <div className="mt-6 text-xl font-bold text-green-700">
            ₹ {Number(rangeTotal).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-green-700">
        ₹ {Number(value).toLocaleString()}
      </p>
    </div>
  );
}
