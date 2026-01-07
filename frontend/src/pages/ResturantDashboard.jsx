
// import RestaurentSidebar from "../components/ResturantSidebar";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function RestaurantDashboard() {
//   const navigate = useNavigate();

//   const [tables, setTables] = useState([]);
//   const [tableNo, setTableNo] = useState("");
//   const [paymentMode, setPaymentMode] = useState("CASH");

//   useEffect(() => {
//     const saved = localStorage.getItem("restaurant_tables");
//     if (saved) setTables(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("restaurant_tables", JSON.stringify(tables));
//   }, [tables]);

//   const addTable = () => {
//     if (!tableNo) return;
//     setTables([...tables, { tableNo, items: [], item: "", price: "" }]);
//     setTableNo("");
//   };

//   const addItem = (index) => {
//     const updated = [...tables];
//     const table = updated[index];

//     if (!table.item || !table.price) return;

//     table.items.push({
//       name: table.item,
//       amount: Number(table.price),
//     });

//     table.item = "";
//     table.price = "";
//     setTables(updated);
//   };

//   const getTotal = (items) =>
//     items.reduce((sum, i) => sum + i.amount, 0);

//   const payTable = async (index) => {
//     const table = tables[index];
//     const totalAmount = getTotal(table.items);
//     const billNo = Date.now();

//     const bill = {
//       bill_no: billNo,
//       shop_name: "MY RESTAURANT",
//       date: new Date().toLocaleString(),
//       table_no: table.tableNo,
//       items: table.items,
//       total: totalAmount,
//       payment_mode: paymentMode,
//     };

//     try {
//       const res = await fetch("/api/payment/save", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: totalAmount,
//           payment_mode: paymentMode,
//         }),
//       });

//       if (!res.ok) throw new Error("API error");

//       setTables(tables.filter((_, i) => i !== index));
//       navigate(`/restaurant/bill/${billNo}`, { state: { bill } });

//     } catch (err) {
//       console.error(err);
//       alert("Payment failed");
//     }
//   };

//   return (
//     <div className="flex bg-gray-100 p-6">
//       <RestaurentSidebar />

//       <div className="md:ml-64 flex-1 p-6">
//         <div className="flex gap-2 mb-6">
//           <input
//             placeholder="Table No"
//             className="border p-2"
//             value={tableNo}
//             onChange={(e) => setTableNo(e.target.value)}
//           />
//           <button
//             onClick={addTable}
//             className="bg-blue-600 text-white px-4 rounded"
//           >
//             Add Table
//           </button>
//         </div>

//         <div className="grid md:grid-cols-2 gap-4">
//           {tables.map((t, index) => (
//             <div key={index} className="bg-white p-4 shadow rounded">
//               <h2 className="font-bold mb-2">Table {t.tableNo}</h2>

//               <div className="flex gap-2 mb-2">
//                 <input
//                   placeholder="Item"
//                   className="border p-1 flex-1"
//                   value={t.item}
//                   onChange={(e) => {
//                     const u = [...tables];
//                     u[index].item = e.target.value;
//                     setTables(u);
//                   }}
//                 />
//                 <input
//                   placeholder="Price"
//                   type="number"
//                   className="border p-1 w-24"
//                   value={t.price}
//                   onChange={(e) => {
//                     const u = [...tables];
//                     u[index].price = e.target.value;
//                     setTables(u);
//                   }}
//                 />
//                 <button
//                   onClick={() => addItem(index)}
//                   className="bg-green-600 text-white px-2"
//                 >
//                   Add
//                 </button>
//               </div>

//               <ul className="text-sm mb-2">
//                 {t.items.map((i, idx) => (
//                   <li key={idx}>{i.name} - ₹{i.amount}</li>
//                 ))}
//               </ul>

//               <div className="font-semibold mb-2">
//                 Total: ₹{getTotal(t.items)}
//               </div>

//               <select
//                 className="border p-2 w-full mb-2"
//                 value={paymentMode}
//                 onChange={(e) => setPaymentMode(e.target.value)}
//               >
//                 <option value="CASH">CASH</option>
//                 <option value="UPI">UPI</option>
//               </select>

//               <button
//                 onClick={() => payTable(index)}
//                 className="bg-red-600 text-white w-full py-1 rounded"
//               >
//                 PAY & PRINT BILL
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import RestaurentSidebar from "../components/ResturantSidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantDashboard() {
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");

  // ✅ NEW FLAG
  const [loaded, setLoaded] = useState(false);

  // ✅ LOAD tables (refresh safe)
  useEffect(() => {
    const saved = localStorage.getItem("restaurant_tables");
    if (saved) {
      setTables(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // ✅ SAVE tables (sirf load hone ke baad)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("restaurant_tables", JSON.stringify(tables));
  }, [tables, loaded]);

  const addTable = () => {
    if (!tableNo) return;
    setTables([...tables, { tableNo, items: [], item: "", price: "" }]);
    setTableNo("");
  };

  const addItem = (index) => {
    const updated = [...tables];
    const table = updated[index];

    if (!table.item || !table.price) return;

    table.items.push({
      name: table.item,
      amount: Number(table.price),
    });

    table.item = "";
    table.price = "";
    setTables(updated);
  };

  const getTotal = (items) =>
    items.reduce((sum, i) => sum + i.amount, 0);

  const payTable = async (index) => {
    const table = tables[index];
    const totalAmount = getTotal(table.items);
    const billNo = Date.now();

    const bill = {
      bill_no: billNo,
      shop_name: "MY RESTAURANT",
      date: new Date().toLocaleString(),
      table_no: table.tableNo,
      items: table.items,
      total: totalAmount,
      payment_mode: paymentMode,
    };

    try {
      const res = await fetch("/api/payment/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          payment_mode: paymentMode, // ✅ IMPORTANT
        }),
      });

      if (!res.ok) throw new Error("API error");

      // ✅ payment success ke baad hi table remove
      const updated = tables.filter((_, i) => i !== index);
      setTables(updated);

      navigate(`/restaurant/bill/${billNo}`, { state: { bill } });

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="flex bg-gray-100 p-6">
      <RestaurentSidebar />

      <div className="md:ml-64 flex-1 p-6">
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
            Add Table
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tables.map((t, index) => (
            <div key={index} className="bg-white p-4 shadow rounded">
              <h2 className="font-bold mb-2">Table {t.tableNo}</h2>

              <div className="flex gap-2 mb-2">
                <input
                  placeholder="Item"
                  className="border p-1 flex-1"
                  value={t.item}
                  onChange={(e) => {
                    const u = [...tables];
                    u[index].item = e.target.value;
                    setTables(u);
                  }}
                />
                <input
                  placeholder="Price"
                  type="number"
                  className="border p-1 w-24"
                  value={t.price}
                  onChange={(e) => {
                    const u = [...tables];
                    u[index].price = e.target.value;
                    setTables(u);
                  }}
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
                  <li key={idx}>{i.name} - ₹{i.amount}</li>
                ))}
              </ul>

              <div className="font-semibold mb-2">
                Total: ₹{getTotal(t.items)}
              </div>

              {/* ✅ CASH / UPI */}
              <select
                className="border p-2 w-full mb-2"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
              </select>

              <button
                onClick={() => payTable(index)}
                className="bg-red-600 text-white w-full py-1 rounded"
              >
                PAY & PRINT BILL
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
