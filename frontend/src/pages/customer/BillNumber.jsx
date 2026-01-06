import RestaurentSidebar from "../../components/ResturantSidebar";
// import { Sidebar } from "lucide-react";
import { useEffect, useState } from "react";

export default function TableNumber() {
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
    const res = await fetch("/api/payment/save", {
      method: "POST",
       mode: "cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: totalAmount }),
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    const data = await res.json();

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
    <div className="flex  bg-gray-100 p-6">
      <RestaurentSidebar/>
     
<div className="md:ml-64 flex-1  p-2 md:p-6 ">
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
    </div></div>
  );
}
