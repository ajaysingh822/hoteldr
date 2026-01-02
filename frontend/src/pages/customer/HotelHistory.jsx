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
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);

    fetch(`/api/history?page=${page}&q=${query}&date=${date}`)
      .then(res => res.json())
      .then(data => {
        setRows(Array.isArray(data.rows) ? data.rows : []);
        setPages(data?.pagination?.total_pages || 1);
      })
      .catch(() => {
        setRows([]);
        setPages(1);
      })
      .finally(() => setLoading(false));
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
              placeholder="Search name / room"
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
                <th className="border p-2">Amount Paid</th>
                <th className="border p-2">Checkout Date</th>
                <th className="border p-2">Action</th>
                <th className="border p-2">Check Out By</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                rows.map(r => (
                  <tr key={r.guest_id}>
                    {/* Bill ID */}
                    <td className="border p-2">H-{r.guest_id}</td>

                    {/* Guest */}
                    <td className="border p-2">{r.name}</td>

                    {/* Room */}
                    <td className="border p-2">{r.room_no}</td>

                    {/* Amount */}
                    <td className="border p-2">
                    <td>₹{Number(r.grand_total).toFixed(2)}</td>

                    </td>

                    {/* Date */}
                    <td className="border p-2">
                      {r.check_out_time
                        ? new Date(r.check_out_time).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Action */}
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          navigate(`/hotel/history/${r.guest_id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View Details
                      </button>
                    </td>
                     <td className="border p-2">{r.checkout_receptionist}</td>
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
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
