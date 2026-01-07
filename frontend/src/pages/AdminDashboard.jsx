// import { useState } from "react";

// export default function AdminDashboard() {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [total, setTotal] = useState(0);

//   const fetchTotal = async () => {
//     const res = await fetch(
//       `http://localhost:8080/api/admin/total-sale?from=${from}&to=${to}`
//     );
//     const data = await res.json();
//     setTotal(data.total);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">
//        DR- hotel Restaurant Total Sales Dashboard
//       </h1>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="date"
//           value={from}
//           onChange={(e) => setFrom(e.target.value)}
//           className="border p-2"
//         />
//         <input
//           type="date"
//           value={to}
//           onChange={(e) => setTo(e.target.value)}
//           className="border p-2"
//         />
//         <button
//           onClick={fetchTotal}
//           className="bg-blue-600 text-white px-4 rounded"
//         >
//           Apply
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded shadow text-xl font-semibold">
//         💰 Restaurant Total Sale: ₹ {total}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

export default function AdminDashboard() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [total, setTotal] = useState(0);

  const fetchTotal = async () => {
    const res = await fetch(
      `http://localhost:8080/api/admin/total-sale?from=${from}&to=${to}`
    );
    const data = await res.json();
    setTotal(data.total);
  };

  return (
    <div  className="flex  min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/bg3.png')",
  }} >
      <AdminSidebar/>
   

      {/* Main Content (SAME AS AddCharges) */}
      <div className="md:ml-64 flex-1  p-5 md:p-6">
        <h1 className="text-2xl font-bold text-amber-900 mb-6">
          🏨 Admin Hotel Dashboard
        </h1>

        {/* Top Stats */}
        <div className="grid grid-cols-2  md:grid-cols-4 gap-2 mb-8">
          <Card title="Rooms Occupied" value={stats.occupied} color="red" />
          <Card title="Rooms Available" value={stats.available} color="green" />
          <Card title="Check-ins Today" value={stats.todayCheckins} color="red" />
          <Card title="Check-outs Today" value={stats.todayCheckouts} color="red" />
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <Revenue title="Today Revenue" value={stats.todayRevenue} />
          <Revenue title="Monthly Revenue" value={stats.monthlyRevenue} />
          {/* <Revenue title="Pending Payments" value={stats.pending} danger /> */}
        </div>

        {/* Recent Bills */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">🧾 Recent Hotel Bills</h2>

          {bills.length === 0 ? (
            <p className="text-sm text-gray-500">No recent bills</p>
          ) : (
            <table className=" w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Bill No</th>
                  <th className="border hidden md:block px-3 py-2 text-left">Guest</th>
                  <th className="border px-3 py-2 text-left">Room</th>
                  <th className="border px-3 py-2 text-left">Amount</th>
                  <th className="border hidden md:block px-3 py-2 text-left">Status</th>
                  <th className="border px-3 py-2 text-left">Check Out By</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b.id}>
                    <td className="border px-3 py-2">H-{b.id}</td>
                    <td className="border hidden md:block px-3 py-2">{b.name}</td>
                    <td className="border px-3 py-2">{b.room_no}</td>
                    <td className="border px-3 py-2">
                      ₹ {Number(b.amount).toLocaleString()}
                    </td>
                    <td
                      className={`border hidden md:block px-3 py-2 font-bold ${
                        b.status === "paid" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {b.status}
                    </td>
                     <td
  className={`border px-3 py-2 font-medium ${
    b.checkout_receptionist?.trim() ? "text-gray-800" : "text-red-600"
  }`}
>
  {b.checkout_receptionist?.trim() ? b.checkout_receptionist : "Advance"}
</td>

                  </tr>

                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable ---------- */

function Card({ title, value, color }) {
  return (
    <div className="bg-white w-40 rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold text-${color}-700`}>
        {value}
      </p>
    </div>
  );
}

function Revenue({ title, value, danger }) {
  return (
    <div className="bg-white rounded-xl md:w-full w-[150px] shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${danger ? "text-red-700" : "text-green-700"}`}>
        ₹ {Number(value).toLocaleString()}
      </p>
    </div>
  );
}
