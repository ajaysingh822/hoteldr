import { useState } from "react";

export default function BillNumber({ tableNo = 1 }) {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");

  const addItem = () => {
    if (!itemName || !price) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name: itemName,
        qty: Number(qty),
        price: Number(price),
        total: Number(qty) * Number(price),
      },
    ]);

    setItemName("");
    setQty(1);
    setPrice("");
  };

  const grandTotal = items.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">

        <h1 className="text-2xl font-bold mb-2">
          dr hotel bill number #{tableNo}
        </h1>
        <p className="mb-4 text-gray-600">
          Table No: <b>{tableNo}</b>
        </p>

        {/* ADD ITEM */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <input
            type="text"
            placeholder="Item name"
            className="border p-2 col-span-2"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Qty"
            className="border p-2"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button
          onClick={addItem}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Item
        </button>

        {/* BILL TABLE */}
        <table className="w-full border mb-4">
          <thead className="bg-amber-200">
            <tr>
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-center">Qty</th>
              <th className="border p-2 text-right">Rate</th>
              <th className="border p-2 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No items added
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id}>
                  <td className="border p-2">{i.name}</td>
                  <td className="border p-2 text-center">{i.qty}</td>
                  <td className="border p-2 text-right">₹ {i.price}</td>
                  <td className="border p-2 text-right">₹ {i.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Grand Total</span>
          <span className="text-xl font-bold">₹ {grandTotal}</span>
        </div>

        {/* PAY */}
        <button
          onClick={() => alert("Payment Done. Table Free ✅")}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded text-lg font-semibold"
        >
          PAY & CLOSE TABLE
        </button>
      </div>
    </div>
  );
}
