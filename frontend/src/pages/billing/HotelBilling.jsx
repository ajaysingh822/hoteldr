import { useState } from "react";
import Sidebar from "../../components/HotelSidebar";

export default function HotelBilling() {
  const [days, setDays] = useState(1);
  const [rate, setRate] = useState(2000);

  const roomTotal = days * rate;
  const gst = Math.round(roomTotal * 0.12);
  const grandTotal = roomTotal + gst;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-amber-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">

          {/* Header */}
          <h1 className="text-2xl font-bold text-amber-900 mb-6">
            🏨 Hotel Billing
          </h1>

          {/* Guest + Room Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Guest Name
              </label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Enter guest name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mobile No
              </label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Room No
              </label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Room number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Room Type
              </label>
              <select className="w-full border rounded-lg px-4 py-2">
                <option>Standard</option>
                <option>Deluxe</option>
                <option>AC</option>
              </select>
            </div>
          </div>

          {/* Charges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                No of Days
              </label>
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Room Charge / Day
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="bg-amber-100 rounded-lg p-4">
              <p className="text-sm">Room Total</p>
              <p className="text-xl font-bold">
                ₹ {roomTotal}
              </p>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span>Room Charges</span>
              <span>₹ {roomTotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>GST (12%)</span>
              <span>₹ {gst}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹ {grandTotal}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800">
              Generate Bill
            </button>

            <button className="border px-6 py-2 rounded-lg rounded-lg">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
