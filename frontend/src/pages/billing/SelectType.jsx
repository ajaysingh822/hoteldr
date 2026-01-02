import { useNavigate } from "react-router-dom";

export default function SelectType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center bg-cover justify-center bg-amber-50 px-4"
     style={{
    backgroundImage: "url('/bg3.png')",
  }} >
    
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-amber-900 mb-2">
          Select Billing Type
        </h1>
        <p className="text-gray-600 mb-8">
          Choose how you want to generate the bill
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hotel */}
          <div
            onClick={() => navigate("/hotel-dashboard")}
            className="cursor-pointer rounded-xl border border-amber-200 p-6
                       hover:shadow-lg transition bg-white"
          >
            <div className="text-5xl mb-3">🏨</div>
            <h2 className="text-lg font-semibold text-amber-900">
              Hotel Billing
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Room, stay & services
            </p>
          </div>

          {/* Restaurant */}
          <div
            onClick={() => navigate("/restaurant-dashboard")}
            className="cursor-pointer rounded-xl border border-amber-200 p-6
                       hover:shadow-lg transition bg-white"
          >
            <div className="text-5xl mb-3">🍽️</div>
            <h2 className="text-lg font-semibold text-amber-900">
              Restaurant Billing
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Food & orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
