// import RestaurentSidebar from "../components/ResturantSidebar";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function RestaurantDashboard() {
//   const navigate = useNavigate();

//   const [tables, setTables] = useState([]);
//   const [tableNo, setTableNo] = useState("");
//   const [paymentMode, setPaymentMode] = useState("CASH");

//   // save running tables in localStorage (temporary)
//   useEffect(() => {
//     localStorage.setItem("restaurant_tables", JSON.stringify(tables));
//   }, [tables]);

//   // add new customer / table
//   const addTable = () => {
//     if (!tableNo) return;
//     setTables([...tables, { tableNo, items: [] }]);
//     setTableNo("");
//   };

//   // add item to a table
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

//   // calculate total
//   const getTotal = (items) =>
//     items.reduce((sum, i) => sum + i.price, 0);

//   // PAY + SAVE TO DATABASE
//  const payTable = async (index) => {
//   const totalAmount = getTotal(tables[index].items);

//   try {
//     const res = await fetch("http://localhost:8080/api/payment/save", {
//       method: "POST",
//        mode: "cors", 
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ amount: totalAmount }),
//     });

//     if (!res.ok) {
//       throw new Error("API error");
//     }

//     const data = await res.json();

//     // table close
//     const updated = tables.filter((_, i) => i !== index);
//     setTables(updated);

//     alert("Payment saved ₹" + totalAmount);
//     console.log("API response:", data);
//   } catch (err) {
//     console.error("Fetch error:", err);
//     alert("Payment failed (frontend)");
//   }
// };


//   return (
//     <div className="flex  bg-gray-100 p-6">
//       < RestaurentSidebar/>
     
// <div className="md:ml-64 flex-1  p-2 md:p-6 ">
//       {/* ADD CUSTOMER */}
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

//       {/* ACTIVE TABLES */}
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
//     </div></div>
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

  useEffect(() => {
    const saved = localStorage.getItem("restaurant_tables");
    if (saved) setTables(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("restaurant_tables", JSON.stringify(tables));
  }, [tables]);

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
          payment_mode: paymentMode,
        }),
      });

      if (!res.ok) throw new Error("API error");

      setTables(tables.filter((_, i) => i !== index));
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
