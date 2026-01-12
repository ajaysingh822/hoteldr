import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HotelSidebar from "../../components/HotelSidebar";

export default function HotelAddCharges() {
  const { id } = useParams();          // guest id (string)
  const navigate = useNavigate();

  const [rows, setRows] = useState([{ title: "", amount: "" }]);
  const [loading, setLoading] = useState(false);

  // add new row
  const addRow = () => {
    setRows([...rows, { title: "", amount: "" }]);
  };

  // remove row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // handle input change
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // 🔥 live total
  const totalAmount = useMemo(() => {
    return rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [rows]);

  // save charges
  const saveCharges = async () => {
    // validation
    for (let r of rows) {
      if (!r.title || Number(r.amount) <= 0) {
        alert("Please fill all charge rows correctly");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/extra-charges/bulk`, {
        credentials : "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_id: Number(id), // 🔥 IMPORTANT: number
          charges: rows,
        }),
      });

      // 🔥 SAFE RESPONSE HANDLING
      const text = await res.text();
      console.log("SERVER RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        alert("Server returned invalid response. Check backend.");
        setLoading(false);
        return;
      }

      setLoading(false);

      if (data.status === "success") {
        navigate("/hotel/check-out");
      } else {
        alert(data.message || "Failed to save charges");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Network / Server error");
    }
  };

  return (
    <div className="flex">
      <HotelSidebar />

      <div className="flex-1 ml-64 p-6 bg-amber-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-xl font-bold mb-4">
            ➕ Add Extra Charges
          </h1>

          <table className="w-full border mb-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Charge Title</th>
                <th className="border p-2">Amount (₹)</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    <input
                      className="border px-2 py-1 w-full rounded"
                      placeholder="Coffee / Food / Laundry"
                      value={row.title}
                      onChange={(e) =>
                        handleChange(i, "title", e.target.value)
                      }
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      className="border px-2 py-1 w-full rounded"
                      value={row.amount}
                      onChange={(e) =>
                        handleChange(i, "amount", e.target.value)
                      }
                    />
                  </td>

                  <td className="border p-2 text-center">
                    {i === rows.length - 1 ? (
                      <button
                        type="button"
                        onClick={addRow}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        −
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔥 TOTAL */}
          <div className="flex justify-end font-bold text-lg mb-4">
            Total Extra Charges: ₹{totalAmount}
          </div>

          <button
            onClick={saveCharges}
            disabled={loading}
            className="bg-blue-700 text-white px-6 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save All Charges"}
          </button>
        </div>
      </div>
    </div>
  );
}
