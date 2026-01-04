import Sidebar from "../../components/HotelSidebar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HotelBilling() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guest, setGuest] = useState(null);
  const [charges, setCharges] = useState([]);
  const [extraTotal, setExtraTotal] = useState(0);
  const [advance, setAdvance] = useState(0);

  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receptionout , setReceptionout] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch(`/api/guest/${id}`)
      .then(res => res.json())
      .then(data => {
        setGuest({
          ...data.guest,
          rate: Number(data.guest.rate) || 0,
        });

        setCharges(data.charges || []);
        setExtraTotal(Number(data.extra_total) || 0);
        setAdvance(Number(data.advance_paid) || 0);
      });
  }, [id]);

  if (!guest) {
    return (
      <div className="flex min-h-screen bg-amber-50">
        <Sidebar />
        <div className="flex-1 p-6">Loading...</div>
      </div>
    );
  }

  /* ================= CALCULATIONS ================= */
  const roomTotal = guest.rate * Number(days);
  const totalBill = roomTotal + extraTotal;
  const remainingPayable = Math.max(0, totalBill - advance);
  const refundAmount = advance > totalBill ? advance - totalBill : 0;

  /* ================= CHECKOUT ================= */
  const confirmPayment = async () => {
    if (!receptionout.trim()) {
    alert("Checkout receptionist name required");
    return;
  }
    setLoading(true);

    const res = await fetch(`/api/checkout/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        days,
        total: remainingPayable, // ✅ ONLY REMAINING
        payment_method: paymentMethod,
        checkout_receptionist: receptionout,
      }),
    });

    const data = await res.json();
    setLoading(false);

  if (data.status === "success") {
  navigate(`/bill/${id}`, {
    state: {
      bill: {
        bill_no: id,
        shop_name: "DR HOTEL & RESTAURENT",
        address: " Maksi Road Bypass",
        city: "DEWAS M.P (455001) ",
        tel: "9131700422 , 9977904180",
        date: new Date().toLocaleString(),
        operator: receptionout,
        room_no: guest.room_no,
        room_charges : guest.rate,
        guest: guest.name,
        room_Total : roomTotal,
        days : days ,
        mobile_no : guest.mobile_no,
        items: charges,
        sub_total: totalBill,
        cgst: 0,
        sgst: 0,
        total: totalBill,
        advance,
        payable: remainingPayable
      }
    }
  });
}}

//        {
//     navigate("/hotel/check-out", {
      
//   state: { checkoutSuccess: true }
// });

//     } else {
//       alert("Payment failed");
//     }
//   };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-amber-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

          <h1 className="text-xl font-bold mb-4">
            💰 Billing & Payment
          </h1>

          <p><b>Guest:</b> {guest.name}</p>
          <p><b>Room:</b> {guest.room_no}</p>
          <p><b>Rate / Day:</b> ₹{guest.rate}</p>

          <label className="block mt-4">Days Stayed</label>
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border px-3 py-2 w-full rounded"
          />

          <hr className="my-4" />

          <h2 className="font-bold mb-2">🧾 Bill Details</h2>

          <table className="w-full border text-sm mb-4">
            <tbody>
              <tr>
                <td className="border p-2">
                  Room Charge ({guest.rate} × {days} days)
                </td>
                <td className="border p-2 text-right">
                  ₹{roomTotal.toFixed(2)}
                </td>
              </tr>

              {charges.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">{c.title}</td>
                  <td className="border p-2 text-right">
                    ₹{Number(c.amount).toFixed(2)}
                  </td>
                </tr>
              ))}

              <tr className="font-bold bg-gray-100">
                <td className="border p-2">Extra Charges Total</td>
                <td className="border p-2 text-right">
                  ₹{extraTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <p><b>Total Bill:</b> ₹{totalBill.toFixed(2)}</p>
          <p className="text-green-700">
            <b>Advance Paid:</b> ₹{advance.toFixed(2)}
          </p>

          {refundAmount > 0 && (
            <p className="text-blue-700 font-semibold">
              Refund Amount: ₹{refundAmount.toFixed(2)}
            </p>
          )}

          <h2 className="mt-2 text-lg font-bold text-red-700">
            Remaining Payable: ₹{remainingPayable.toFixed(2)}
          </h2>

          <label className="block mt-4">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
         <div>
         <label className="block mb-1 font-medium">Reciptionist Name</label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={receptionout}
                onChange={(e) => setReceptionout(e.target.value)}
                placeholder="Enter current receptionist name" 
              />
  </div>
          <button
            onClick={confirmPayment}
            disabled={loading}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Payment & Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
