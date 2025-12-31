import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/HotelSidebar";

export default function HotelHistoryDetail() {
  const { billId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/history/${billId}`)
      .then(res => res.json())
      .then(d => {
        if (d.status === "success") setData(d);
      });
  }, [billId]);

  if (!data) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <Sidebar />
        <div className=" flex-1 p-6">Loading...</div>
      </div>
    );
  }

  const { bill, charges } = data;

  return (
    <div className="flex min-h-screen bg-amber-50">
      <Sidebar />

      <div className="md:ml-64 flex-1 p-6">
        <div className="max-w-2xl bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold mb-4">
            🧾 Bill Details (H-{bill.bill_id})
          </h1>

          <p><b>Guest:</b> {bill.guest}</p>
          <p><b>Room:</b> {bill.room_no}</p>
          <p><b>Payment:</b> {bill.payment_method}</p>
          <p><b>Date:</b> {new Date(bill.paid_at).toLocaleString()}</p>

          <hr className="my-4" />
<h2 className="text-lg font-bold mb-2">👤 Basic Details</h2>

<div className="grid grid-cols-2 gap-2 text-sm mb-4">
  <p><b>Guest Name:</b> {bill.guest}</p>
  <p><b>Mobile:</b> {bill.mobile}</p>

  <p><b>Room No:</b> {bill.room_no}</p>
  <p><b>Members:</b> {bill.members}</p>

  <p><b>Vehicle No:</b> {bill.vehicle_no || "—"}</p>
  <p><b>Rate / Day:</b> ₹{bill.rate}</p>

  <p><b>Check-in:</b> {new Date(bill.check_in_time).toLocaleString()}</p>
  <p><b>Check-out:</b> {new Date(bill.check_out_time).toLocaleString()}</p>

  <p><b>Advance Paid:</b> ₹{bill.advance_paid}</p>
  <p><b>Payment Method:</b> {bill.payment_method}</p>
</div>

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
                  <td className="border p-2 text-right">₹{c.amount}</td>
                </tr>
              ))}

              <tr className="font-bold bg-gray-100">
                <td className="border p-2">Extra Charges Total</td>
                <td className="border p-2 text-right">
                  ₹{bill.extra_total}
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-lg font-bold text-green-700">
            Grand Total: ₹{bill.grand_total}
          </h2>
        </div>
      </div>
    </div>
  );
}
