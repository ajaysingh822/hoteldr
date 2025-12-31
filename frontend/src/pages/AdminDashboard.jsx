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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER IMAGE */}
        <div className="h-48 w-full">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
            alt="DR Hotel"
            className="h-full w-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="p-8 text-center">
          <h1 className="text-3xl font-extrabold text-amber-900">
            DR Hotel & Restaurant
          </h1>
          <p className="text-gray-500 mt-1">
            Admin Sales Dashboard
          </p>

          {/* FILTER */}
          <div className="flex flex-col md:flex-row gap-3 justify-center mt-6">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={fetchTotal}
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold"
            >
              View Report
            </button>
          </div>

          {/* TOTAL SALE */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p className="text-gray-600 text-lg">
              Total Restaurant Sale
            </p>
            <p className="text-4xl font-bold text-amber-900 mt-2">
              ₹ {total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
