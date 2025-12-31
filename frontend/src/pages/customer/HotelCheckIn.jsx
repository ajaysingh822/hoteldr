import { useState } from "react";

import Sidebar from "../../components/HotelSidebar";
import { useNavigate } from "react-router-dom";


export default function HotelCheckIn() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [members, setMembers] = useState(1);
  const [vehicleNo, setVehicleNo] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [rate, setRate] = useState(0);
  const [advance, setAdvance] = useState(500);
  const [idType, setIdType] = useState("");
  const [idImage, setIdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (
      name.trim() === "" ||
      mobile.trim() === "" ||
      roomNo.trim() === "" ||
      idType === "" ||
      members <= 0 ||
      rate <= 0
    ) {
      setAlert({
        type: "error",
        message: "Please fill all required details correctly",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("mobile", mobile.trim());
      formData.append("members", members);
      formData.append("vehicle_no", vehicleNo.trim());
      formData.append("room_no", roomNo.trim());
      formData.append("rate", rate);
      formData.append("id_type", idType);
      formData.append("advance", advance);
      if (idImage) formData.append("id_image", idImage);

      const res = await fetch("/api/check-in", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setAlert({
          type: "success",
          message: "Customer checked in successfully ✅",
        });

        setName("");
        setMobile("");
        setMembers(1);
        setVehicleNo("");
        setRoomNo("");
        setRate(0);
        setIdType("");
        setAdvance(500)
        setIdImage(null);
      } else {
        setAlert({
          type: "error",
          message: data.message || "Check-in failed",
        });
      }
    } catch {
      setAlert({ type: "error", message: "Server error" });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <>
      <div  className="flex min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/Bg1.png')",
  }} >
      <Sidebar />

      <div className="md:ml-64 flex-1 p-6 bg-cover bg-center" >
        <div className="max-w-4xl mx-auto bg-gradient-to-br bg-red-100 p-6 rounded-xl bg-cover bg-center shadow"
        
        >
          <h1 className="text-2xl font-bold mb-6">➕ Hotel Check-In</h1>

          {alert && (
            <div
              className={`mb-4 rounded px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {alert.message}
            </div>
          )}

          <form
            onSubmit={handleCheckIn}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Guest Name */}
            <div>
              <label className="block mb-1 font-medium">Guest Name</label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-1 font-medium">Mobile Number</label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            {/* Members */}
            <div>
              <label className="block mb-1 font-medium">
                Number of Members
              </label>
              <input
                type="number"
                min="1"
                className="border px-4 py-2 rounded-lg w-full"
                value={members}
                onChange={(e) => setMembers(Number(e.target.value))}
              />
            </div>

            {/* Vehicle */}
            <div>
              <label className="block mb-1 font-medium">
                Vehicle Number (Optional)
              </label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
              />
            </div>

            {/* Room No */}
            <div>
              <label className="block mb-1 font-medium">Room Number</label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block mb-1 font-medium">
                Room Rate / Day
              </label>
              <input
                type="number"
                min="1"
                className="border px-4 py-2 rounded-lg w-full"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>

            {/* ID Type */}
            <div>
              <label className="block mb-1 font-medium">ID Type</label>
              <select
                className="border px-4 py-2 rounded-lg w-full"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
              >
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            {/* ID Image */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Upload ID Proof</label>
              <input
                type="file"
                accept="image/*"
                className="border px-4 py-2 rounded-lg w-full"
                onChange={(e) => setIdImage(e.target.files[0])}
              />
            </div>
<div className="md:col-span-2">
     <label className="block mb-1 font-medium">Advance Payment</label>
             <input
  type="number"
  placeholder="Advance Amount"
  value={advance}
  onChange={(e) => setAdvance(Number(e.target.value))}
  className="border px-4 py-2 rounded"
/> 

            </div> 
            {/* Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="mt-6 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Check-In"}
              </button>
            </div>
          </form>
        </div>
      </div>

      </div>
    </>
  );
}
