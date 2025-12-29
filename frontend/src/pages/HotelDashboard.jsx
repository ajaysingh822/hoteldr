import Sidebar from "../components/HotelSidebar";

export default function HotelDashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
   

      {/* Main Content */}
      <div className="flex-1 bg-amber-50 min-h-screen p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-amber-900 mb-6">
          🏨 Hotel Dashboard
        </h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Rooms Occupied</p>
            <p className="text-2xl font-bold text-red-700">18</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Rooms Available</p>
            <p className="text-2xl font-bold text-green-700">7</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Check-ins Today</p>
            <p className="text-2xl font-bold text-red-700">9</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Check-outs Today</p>
            <p className="text-2xl font-bold text-red-700">6</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Today Revenue</p>
            <p className="text-2xl font-bold text-green-700">
              ₹ 52,400
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-700">
              ₹ 8,75,200
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <p className="text-2xl font-bold text-red-700">
              ₹ 12,800
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            ⚡ Quick Hotel Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <a
              href="/billing/hotel"
              className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-red-800"
            >
              ➕ New Hotel Bill
            </a>

            <button className="border px-5 py-2 rounded-lg">
              🛏️ Manage Rooms
            </button>

            <button className="border px-5 py-2 rounded-lg">
              📋 Guest List
            </button>
          </div>
        </div>

        {/* Recent Hotel Bills */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            🧾 Recent Hotel Bills
          </h2>

          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Bill No</th>
                <th className="border px-3 py-2 text-left">Guest</th>
                <th className="border px-3 py-2 text-left">Room</th>
                <th className="border px-3 py-2 text-left">Amount</th>
                <th className="border px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">H-1045</td>
                <td className="border px-3 py-2">Rahul Sharma</td>
                <td className="border px-3 py-2">204</td>
                <td className="border px-3 py-2">₹ 6,800</td>
                <td className="border px-3 py-2 text-green-600">
                  Paid
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">H-1046</td>
                <td className="border px-3 py-2">Amit Verma</td>
                <td className="border px-3 py-2">108</td>
                <td className="border px-3 py-2">₹ 4,200</td>
                <td className="border px-3 py-2 text-red-600">
                  Pending
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
