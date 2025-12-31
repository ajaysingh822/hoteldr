import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/HotelSidebar";

export default function HotelHistory() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");

 useEffect(() => {
  fetch(`/api/history?page=${page}&q=${query}&date=${date}`)
    .then(res => res.json())
    .then(data => {
      setRows(Array.isArray(data.rows) ? data.rows : []);
      setPages(data?.pagination?.total_pages || 1);
    })
    .catch(() => {
      setRows([]);
      setPages(1);
    });
}, [page, query, date]);


  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 md:p-6 py-10 bg-amber-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white md:p-6 rounded-xl shadow">

          <h1 className="text-2xl font-bold mb-4">📜 Billing History</h1>

          {/* 🔍 Filters */}
          <div className="flex gap-4 mb-4">
            <input
              placeholder="Search name / room / bill"
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
              className="border px-3 py-2 rounded w-1/3"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => {
                setPage(1);
                setDate(e.target.value);
              }}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* 📋 Table */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Bill ID</th>
                <th className="border p-2">Guest</th>
                <th className="border p-2">Room</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
           <tbody>
  {rows.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center p-4 text-gray-500">
        No records found
      </td>
    </tr>
  ) : (
    rows.map(r => (
      <tr key={r.bill_id}>
        <td className="border p-2">{r.bill_id}</td>
        <td className="border p-2">{r.name}</td>
        <td className="border p-2">{r.room_no}</td>
        <td className="border p-2">₹{r.amount}</td>
        <td className="border p-2">
          {r.created_at?.split(" ")[0]}
        </td>
        <td className="border p-2">
          <button
            onClick={() => navigate(`/hotel/history/${r.bill_id}`)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            View Details
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>

          {/* 🔁 Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span>
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
