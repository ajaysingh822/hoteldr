
// import { useState } from "react";
// import RestaurantSidebar from "../../src/components/ResturantSidebar.jsx";

// export default function Dashboard() {
//   const [customers, setCustomers] = useState([
   
//     { id: 3, name: "Aman", table: 4, bill: 0 },
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
//     <div className="min-h-screen bg-gray-100">
      
//       {/* 🔹 SIDEBAR */}
//       <RestaurantSidebar />

//       {/* 🔹 DASHBOARD CONTENT */}
//       <div className="p-6 md:ml-56">
//         <h1 className="text-2xl font-bold mb-6">
//            Restaurant Dashboard
//         </h1>

//         <div className="bg-white rounded-lg shadow p-4">
//           <table className="w-full border">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Table</th>
//                 <th className="p-2 border">Current Bill (₹)</th>
//                 <th className="p-2 border">Add Extra (₹)</th>
//                 <th className="p-2 border">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {customers.map((c) => (
//                 <tr key={c.id} className="text-center">
//                   <td className="p-2 border">{c.name}</td>
//                   <td className="p-2 border">{c.table}</td>
//                   <td className="p-2 border font-semibold">
//                     ₹ {c.bill}
//                   </td>

//                   <td className="p-2 border">
//                     <input
//                       type="number"
//                       className="border px-2 py-1 w-24"
//                       placeholder="Amount"
//                       value={extra[c.id] || ""}
//                       onChange={(e) =>
//                         setExtra({
//                           ...extra,
//                           [c.id]: e.target.value,
//                         })
//                       }
//                     />
//                   </td>

//                   <td className="p-2 border">
//                     <button
//                       onClick={() => addExtraAmount(c.id)}
//                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
//                     >
//                       Add
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// // }
// import { useEffect, useState } from "react";

// export default function RestaurantDashboard() {
//   const [tables, setTables] = useState(() => {
//     const saved = localStorage.getItem("restaurant_tables");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [tableNo, setTableNo] = useState("");
//   const [item, setItem] = useState("");
//   const [price, setPrice] = useState("");

//   // Save to localStorage
//   useEffect(() => {
//     localStorage.setItem("restaurant_tables", JSON.stringify(tables));
//   }, [tables]);

//   // Add new table/customer
//   const addTable = () => {
//     if (!tableNo) return;
//     setTables([
//       ...tables,
//       { tableNo, items: [] }
//     ]);
//     setTableNo("");
//   };

//   // Add item to table
//   const addItem = (index) => {
//     if (!item || !price) return;

//     const updated = [...tables];
//     updated[index].items.push({
//       name: item,
//       price: Number(price),
//     });
//     setTables(updated);
//     setItem("");
//     setPrice("");
//   };

//   // Total bill
//   const getTotal = (items) =>
//     items.reduce((sum, i) => sum + i.price, 0);

//   // Pay & close table
//   const payTable = (index) => {
//     alert("Payment Done ₹" + getTotal(tables[index].items));
//     const updated = tables.filter((_, i) => i !== index);
//     setTables(updated);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">
//        D R-Restaurant 
//       </h1>

//       {/* Add Customer */}
//       <div className="flex gap-2 mb-6">
//         <input
//           placeholder="Table No"
//           className="border p-2"
//           value={tableNo}
//           onChange={(e) => setTableNo(e.target.value)}
//         />
//         <button
//           onClick={addTable}
//           className="bg-blue-600 text-white px-4 rounded"
//         >
//           Add Customer
//         </button>
//       </div>

//       {/* Active Tables */}
//       <div className="grid md:grid-cols-2 gap-4">
//         {tables.map((t, index) => (
//           <div key={index} className="bg-white p-4 shadow rounded">
//             <h2 className="font-bold mb-2">
//               Table {t.tableNo}
//             </h2>

//             <div className="flex gap-2 mb-2">
//               <input
//                 placeholder="Item"
//                 className="border p-1 flex-1"
//                 value={item}
//                 onChange={(e) => setItem(e.target.value)}
//               />
//               <input
//                 placeholder="Price"
//                 type="number"
//                 className="border p-1 w-24"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//               <button
//                 onClick={() => addItem(index)}
//                 className="bg-green-600 text-white px-2"
//               >
//                 Add
//               </button>
//             </div>

//             <ul className="text-sm mb-2">
//               {t.items.map((i, idx) => (
//                 <li key={idx}>
//                   {i.name} - ₹{i.price}
//                 </li>
//               ))}
//             </ul>

//             <div className="font-semibold mb-2">
//               Total: ₹{getTotal(t.items)}
//             </div>

//             <button
//               onClick={() => payTable(index)}
//               className="bg-red-600 text-white w-full py-1 rounded"
//             >
//               PAY 
//             </button>
            
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";

export default function RestaurantDashboard() {
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem("restaurant_tables");
    return saved ? JSON.parse(saved) : [];
  });

  const [tableNo, setTableNo] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");

  // save running tables in localStorage (temporary)
  useEffect(() => {
    localStorage.setItem("restaurant_tables", JSON.stringify(tables));
  }, [tables]);

  // add new customer / table
  const addTable = () => {
    if (!tableNo) return;
    setTables([...tables, { tableNo, items: [] }]);
    setTableNo("");
  };

  // add item to a table
  const addItem = (index) => {
    if (!item || !price) return;

    const updated = [...tables];
    updated[index].items.push({
      name: item,
      price: Number(price),
    });
    setTables(updated);
    setItem("");
    setPrice("");
  };

  // calculate total
  const getTotal = (items) =>
    items.reduce((sum, i) => sum + i.price, 0);

  // PAY + SAVE TO DATABASE
 const payTable = async (index) => {
  const totalAmount = getTotal(tables[index].items);

  try {
    const res = await fetch("http://localhost:8080/api/payment/save", {
      method: "POST",
       mode: "cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: totalAmount }),
    });

    const data = await res.json();   // 👈 IMPORTANT LINE

    if (!res.ok) {
      throw new Error("API error");
    }

    // table close
    const updated = tables.filter((_, i) => i !== index);
    setTables(updated);

    alert("Payment saved ₹" + totalAmount);
    console.log("API response:", data);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Payment failed (frontend)");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        D R - Restaurant Billing
      </h1>

      {/* ADD CUSTOMER */}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Table No"
          className="border p-2"
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
        />
        <button
          onClick={addTable}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add Customer
        </button>
      </div>

      {/* ACTIVE TABLES */}
      <div className="grid md:grid-cols-2 gap-4">
        {tables.map((t, index) => (
          <div key={index} className="bg-white p-4 shadow rounded">
            <h2 className="font-bold mb-2">
              Table {t.tableNo}
            </h2>

            <div className="flex gap-2 mb-2">
              <input
                placeholder="Item"
                className="border p-1 flex-1"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
              <input
                placeholder="Price"
                type="number"
                className="border p-1 w-24"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <button
                onClick={() => addItem(index)}
                className="bg-green-600 text-white px-2"
              >
                Add
              </button>
            </div>

            <ul className="text-sm mb-2">
              {t.items.map((i, idx) => (
                <li key={idx}>
                  {i.name} - ₹{i.price}
                </li>
              ))}
            </ul>

            <div className="font-semibold mb-2">
              Total: ₹{getTotal(t.items)}
            </div>

            <button
              onClick={() => payTable(index)}
              className="bg-red-600 text-white w-full py-1 rounded"
            >
              PAY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
