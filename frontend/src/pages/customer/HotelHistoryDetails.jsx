import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HotelSidebar from "../../components/HotelSidebar";

export default function HotelHistoryDetail() {
  const { billId } = useParams(); // guest_id
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/history/${billId}`,{
      credentials :"include",
    })
      .then(res => res.json())
      .then(d => {
        if (d.status === "success") {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [billId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <HotelSidebar />
        <div className="flex-1 p-6">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <HotelSidebar />
        <div className="flex-1 p-6 text-red-600">
          Failed to load data
        </div>
      </div>
    );
  }

  const { bill, charges, members_list } = data;

  return (
    <div className="flex min-h-screen bg-amber-50">
      <HotelSidebar />

      <div className="md:ml-64 flex-1 p-6">
        <div className="max-w-2xl bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold mb-4">
            🧾 Stay Summary (Guest #{bill.guest_id})
          </h1>

          <hr className="my-3" />

          {/* ================= GUEST DETAILS ================= */}
          <h2 className="text-lg font-bold mb-2">👤 Guest Details</h2>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <p><b>Name:</b> {bill.guest}</p>
            <p><b>Mobile:</b> {bill.mobile}</p>

            <p><b>Room No:</b> {bill.room_no}</p>
            <p><b>Members:</b> {bill.members}</p>

            <p><b>Vehicle No:</b> {bill.vehicle_no || "—"}</p>
            <p><b>Rate / Day:</b> ₹{bill.rate}</p>

            <p>
              <b>Check-in:</b>{" "}
              {bill.check_in_time
                ? new Date(bill.check_in_time).toLocaleString()
                : "—"}
            </p>
            <p>
              <b>Check-out:</b>{" "}
              {bill.check_out_time
                ? new Date(bill.check_out_time).toLocaleString()
                : "—"}
            </p>

            <p><b>Advance Paid:</b> ₹{bill.advance_paid}</p>
            <p><b>Total Paid:</b> ₹{bill.total_paid}</p>

          <div style={{ display: "flex", gap: "16px" }}>
  <img src={bill.id_image_url} width="200" />
  <img src={bill.id_image_url2} width="200" />
</div>

          </div>

          {/* ================= MEMBERS DETAILS ================= */}
          {members_list && members_list.length > 0 && (
            <>
              <h2 className="text-lg font-bold mb-2 mt-4">
                👥 Members Details
              </h2>

              <table className="w-full border text-sm mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">#</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Age</th>
                    <th className="border p-2">Sex</th>
                    <th className="border p-2">ID Number</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {members_list.map((m, i) => (
                    <tr key={i}>
                      <td className="border p-2 text-center">
                        {i + 2}
                      </td>
                      <td className="border p-2">
                        {m.name || "—"}
                      </td>
                      <td className="border p-2 text-center">
                        {m.age || "—"}
                      </td>
                      <td className="border p-2 text-center">
                        {m.sex || "—"}
                      </td>
                      <td className="border p-2">
                        {m.id_number || "—"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ================= BILL BREAKUP ================= */}
          <h2 className="text-lg font-bold mb-2">💰 Bill Breakup</h2>

          <table className="w-full border text-sm mb-4">
            <tbody>
              <tr>
                <td className="border p-2">
                  Room Charge ({bill.rate} × {bill.days} days)
                </td>
                <td className="border p-2 text-right">
                  ₹{bill.room_total}
                </td>
                
              </tr>

              {charges.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">{c.title}</td>
                  <td className="border p-2 text-right">
                    ₹{c.amount}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

          {/* ================= TOTAL ================= */}
          <div className="text-right space-y-1">
            <p>
              <b>Grand Total:</b> ₹{bill.grand_total}
            </p>
            <p className="text-green-700 font-bold">
              Balance: ₹{bill.grand_total - bill.total_paid}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
