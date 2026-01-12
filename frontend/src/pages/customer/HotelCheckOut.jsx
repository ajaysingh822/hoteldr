import { useEffect, useState } from "react";
import HotelSidebar from "../../components/HotelSidebar";
import { useNavigate ,useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function HotelCheckOut() {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ===== ADD ID STATES (ADDED) =====
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // ===== QR STATES (ADDED) =====
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  // ===== FETCH GUESTS =====
  const fetchGuests = () => {
  fetch(`${process.env.REACT_APP_API_URL}/api/guests/checked-in`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        setGuests(data.guests);
      }
    });
};

useEffect(() => {
  fetchGuests();
}, []);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}/api/guests/checked-in`, {
  //     credentials: "include",
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.status === "success") {
  //         setGuests(data.guests);
  //       }
  //     });
  // }, []);

  // ===== TOAST AFTER CHECKOUT =====
  useEffect(() => {
    if (location.state?.checkoutSuccess) {
      toast.success("Checkout Successfully ✅");
    }
  }, [location.state]);

  // ===== ADD ID MODAL OPEN (ADDED) =====
  const openIdModal = (guestId) => {
    setSelectedGuest(guestId);
    setShowIdModal(true);
  };

  return ( 
    <div className="flex bg-cover bg-center">
      <HotelSidebar />

      <div
        className="flex-1 bg-amber-50 min-h-screen md:ml-64 md:p-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg2.png')" }}
      >
        <div className="max-w-6xl md:my-0 my-12 mx-auto bg-white md:p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">
            ✅ Hotel Check-Out
          </h1>

          {guests.length === 0 ? (
            <p>No guests ready for checkout</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Guest</th>
                  <th className="border p-2">Room</th>
                  <th className="border p-2">Room Bill / Day</th>
                  <th className="border p-2">Extra Charges</th>
                  <th className="border p-2">Total Till Now</th>
                  <th className="border p-2">Action</th>
                  <th className="border p-2">Checked In Name</th>
                  <th className="border p-2">ID Status</th>

                </tr>
              </thead>

              <tbody>
                {guests.map(g => {
                  const totalTillNow =
                    parseFloat(g.rate) + parseFloat(g.extra_total || 0);

                  return (
                    <tr key={g.id}>
                      <td className="border p-2">{g.name}</td>
                      <td className="border p-2">{g.room_no}</td>
                      <td className="border p-2">₹{g.rate}</td>
                      <td className="border p-2">₹{g.extra_total}</td>
                      <td className="border p-2 font-bold">
                        ₹{totalTillNow}
                      </td>
                      <td className="border p-2 space-x-2">
                        {/* ===== ADD ID BUTTON (ADDED) ===== */}
                        <button
                          className="bg-orange-600 text-white px-2 py-1 rounded"
                          onClick={() => openIdModal(g.id)}
                        >
                          Add ID Image
                        </button>

                        <button
                          onClick={() => navigate(`/hotel/charges/${g.id}`)}
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          + Charges
                        </button>

                        <button
                          onClick={() => navigate(`/hotel/billing/${g.id}`)}
                          className="bg-orange-600 text-white px-2 py-1 rounded"
                        >
                          Billing
                        </button>
                      </td>
                      <td className="border p-2">{g.reception}</td>
                      <td className="border p-2 text-center">
  {g.id_image && g.id_image2 ? (
    <span className="text-green-600 font-semibold">
      ID ✅
    </span>
  ) : (
    <span className="text-red-600 font-semibold">
      ID ❌
    </span>
  )}
</td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ================= ADD ID MODAL (ADDED) ================= */}
        {showIdModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg w-80">
              <h3 className="font-bold mb-4">Add Guest ID</h3>

              <button
                onClick={async () => {
                  const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/qr-generate/${selectedGuest}`,
                    { credentials: "include" }
                  );
                  const data = await res.json();

                  setQrUrl(`${window.location.origin}/upload-id/${data.token}`);
                  setShowIdModal(false);
                  setShowQR(true);
                }}
                className="w-full bg-black text-white py-2 rounded mb-3"
              >
                📷 Upload via QR
              </button>

              <button
                onClick={() => navigate(`/hotel/upload-id/${selectedGuest}`)}
                className="w-full bg-gray-700 text-white py-2 rounded"
              >
                💻 Upload from System
              </button>

              <button
                onClick={() => setShowIdModal(false)}
                className="mt-3 text-sm text-red-600 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ================= QR POPUP (ADDED) ================= */}
        {showQR && qrUrl && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg w-72 text-center">
              <h3 className="font-semibold mb-3">Guest ID Upload QR</h3>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                alt="QR"
                className="mx-auto"
              />

              <p className="text-xs text-gray-500 mt-2">
                QR valid for 5 minutes
              </p>

              <button
               onClick={() => {
    setShowQR(false);
    fetchGuests();
  }}
                className="mt-4 text-sm text-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
