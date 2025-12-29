// import RestaurantSidebar from "../components/RestaurantSidebar";



// import { useState } from "react";

// export default function Dashboard() {
//   const [customers, setCustomers] = useState([
//     { id: 1, name: "Ajay", table: 1, bill: 350 },
//     { id: 2, name: "Ravi", table: 2, bill: 520 },
//     { id: 3, name: "Aman", table: 4, bill: 210 },
//   ]);

//   const [extra, setExtra] = useState({});

//   const addExtraAmount = (id) => {
//     if (!extra[id]) return;

//     setCustomers((prev) =>
//       prev.map((c) =>
//         c.id === id
//           ? { ...c, bill: c.bill + Number(extra[id]) }
//           : c
//       )
//     );

//     setExtra({ ...extra, [id]: "" });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-6">
//         🍽 Restaurant Dashboard
//       </h1>

//       <div className="bg-white rounded-lg shadow p-4">
//         <table className="w-full border">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Name</th>
//               <th className="p-2 border">Table</th>
//               <th className="p-2 border">Current Bill (₹)</th>
//               <th className="p-2 border">Add Extra (₹)</th>
//               <th className="p-2 border">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {customers.map((c) => (
//               <tr key={c.id} className="text-center">
//                 <td className="p-2 border">{c.name}</td>
//                 <td className="p-2 border">{c.table}</td>
//                 <td className="p-2 border font-semibold">
//                   ₹ {c.bill}
//                 </td>

//                 <td className="p-2 border">
//                   <input
//                     type="number"
//                     className="border px-2 py-1 w-24"
//                     placeholder="Amount"
//                     value={extra[c.id] || ""}
//                     onChange={(e) =>
//                       setExtra({
//                         ...extra,
//                         [c.id]: e.target.value,
//                       })
//                     }
//                   />
//                 </td>

//                 <td className="p-2 border">
//                   <button
//                     onClick={() => addExtraAmount(c.id)}
//                     className="bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Add
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import RestaurantSidebar from "../../src/components/ResturantSidebar.jsx";

export default function Dashboard() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Ajay", table: 1, bill: 350 },
    { id: 2, name: "Ravi", table: 2, bill: 520 },
    { id: 3, name: "Aman", table: 4, bill: 210 },
  ]);

  const [extra, setExtra] = useState({});

  const addExtraAmount = (id) => {
    if (!extra[id]) return;

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, bill: c.bill + Number(extra[id]) }
          : c
      )
    );

    setExtra({ ...extra, [id]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* 🔹 SIDEBAR */}
      <RestaurantSidebar />

      {/* 🔹 DASHBOARD CONTENT */}
      <div className="p-6 md:ml-56">
        <h1 className="text-2xl font-bold mb-6">
          🍽 Restaurant Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow p-4">
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Table</th>
                <th className="p-2 border">Current Bill (₹)</th>
                <th className="p-2 border">Add Extra (₹)</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="text-center">
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.table}</td>
                  <td className="p-2 border font-semibold">
                    ₹ {c.bill}
                  </td>

                  <td className="p-2 border">
                    <input
                      type="number"
                      className="border px-2 py-1 w-24"
                      placeholder="Amount"
                      value={extra[c.id] || ""}
                      onChange={(e) =>
                        setExtra({
                          ...extra,
                          [c.id]: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td className="p-2 border">
                    <button
                      onClick={() => addExtraAmount(c.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
