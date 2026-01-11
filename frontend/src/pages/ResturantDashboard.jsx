import RestaurentSidebar from "../components/ResturantSidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantDashboard() {
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [loaded, setLoaded] = useState(false);

  /* ================= LOAD / SAVE TABLES ================= */

  useEffect(() => {
    const saved = localStorage.getItem("restaurant_tables");
    if (saved) {
      setTables(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("restaurant_tables", JSON.stringify(tables));
  }, [tables, loaded]);

  /* ================= HELPERS ================= */

  const getTotal = (items) =>
    items.reduce((sum, i) => {
      const amt = Number(i.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

  /* ================= ACTIONS ================= */

  const addTable = () => {
    if (!tableNo) return;
    setTables([...tables, { tableNo, items: [], item: "", price: "" }]);
    setTableNo("");
  };

  const addItem = (index) => {
    const updated = [...tables];
    const table = updated[index];

    if (!table.item || table.price === "" || isNaN(table.price)) {
      alert("Item name aur valid price daalo");
      return;
    }

    table.items.push({
      name: table.item,
      amount: Number(table.price),
    });

    table.item = "";
    table.price = "";
    setTables(updated);
  };

  const payTable = async (index) => {
    const table = tables[index];
    const totalAmount = getTotal(table.items);

    // 🔥 FINAL SAFETY CHECK
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      alert("Total amount invalid");
      return;
    }

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

      const data = await res.json();
      console.log("Payment API:", data);

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Payment failed");
      }

      // ✅ SUCCESS
      setTables(tables.filter((_, i) => i !== index));

      // 🔥 PRINT PAGE SAFE
      localStorage.setItem("last_bill", JSON.stringify(bill));

      navigate(`/restaurant/bill/${billNo}`, { state: { bill } });

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex bg-gray-100 min-h-screen w-full">
      <RestaurentSidebar />

      <div className="ml-0 lg:ml-64 flex-1 p-4">
        {/* ADD TABLE */}
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

        {/* TABLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tables.map((t, index) => (
            <div key={index} className="bg-white p-4 shadow rounded">
              <h2 className="font-bold mb-2">Table {t.tableNo}</h2>

              {/* ADD ITEM */}
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

              {/* ITEMS */}
              <ul className="text-sm mb-2">
                {t.items.map((i, idx) => (
                  <li key={idx}>
                    {i.name} - ₹{i.amount}
                  </li>
                ))}
              </ul>

              {/* TOTAL */}
              <div className="font-semibold mb-2">
                Total: ₹{getTotal(t.items)}
              </div>

              {/* PAYMENT MODE */}
              <select
                className="border p-2 w-full mb-2"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
              </select>

              {/* PAY */}
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
