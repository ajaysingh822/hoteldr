import { useState , useEffect } from "react";
import HotelSidebar from "../../components/HotelSidebar";
import { toast } from "react-hot-toast";

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
  const [comingfrom, setComingfrom] = useState("");
  const [comingto, setComingto] = useState("");
  const [IdNumber, setIdNumber] = useState("");
  const [reception, setReception] = useState("");
  const [loading, setLoading] = useState(false);
const [showQR, setShowQR] = useState(false);
const [qrUrl, setQrUrl] = useState("");
const [qrToken, setQrToken] = useState("");

  // 🔹 OPTIONAL MEMBERS
  const [memberDetails, setMemberDetails] = useState([]);

  // 🔹 NEW STATES (sirf upload option ke liye)
  const [showUploadChoice, setShowUploadChoice] = useState(false);

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
      toast.error("Please fill all required details correctly")
      
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
      formData.append("id_image",idImage);
      formData.append("advance", advance);
      formData.append("comingfrom", comingfrom.trim());
      formData.append("comingto", comingto.trim());
      formData.append("id_number", IdNumber.trim());
      formData.append("reception", reception.trim());
      if (idImage) formData.append("id_image", idImage);

      if (memberDetails.length > 0) {
        formData.append("member_details", JSON.stringify(memberDetails));
      }

      const res = await fetch("/api/check-in", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Customer checked in successfully ✅");

        setName("");
        setMobile("");
        setMembers(1);
        setVehicleNo("");
        setRoomNo("");
        setRate(0);
        setAdvance(500);
        setIdType("");
        setIdImage(null);
        setComingfrom("");
        setComingto("");
        setIdNumber("");
        setReception("");
        setMemberDetails([]);
      } else {
        toast.error(data.message || "Check-in failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (!qrToken) return;

  const i = setInterval(async () => {
    const res = await fetch(`/api/qr-status/${qrToken}`);
    const data = await res.json();

    if (data.image_url) {
      const blob = await fetch(data.image_url).then(r => r.blob());
      setIdImage(new File([blob], "id.jpg", { type: blob.type }));
      clearInterval(i);
    }
  }, 3000);

  return () => clearInterval(i);
}, [qrToken]);

  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Bg1.png')" }}
    >
      <HotelSidebar />

      <div className="md:ml-64 flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">➕ Hotel Check-In</h1>

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

            {/* Coming From */}
            <div>
              <label className="block mb-1 font-medium">
                Coming From (Optional)
              </label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={comingfrom}
                onChange={(e) => setComingfrom(e.target.value)}
              />
            </div>

            {/* Coming To */}
            <div>
              <label className="block mb-1 font-medium">
                Coming To (Optional)
              </label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={comingto}
                onChange={(e) => setComingto(e.target.value)}
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
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setMembers(count);

                  if (count > 1) {
                    setMemberDetails((prev) => {
                      const copy = [...prev];
                      while (copy.length < count - 1) {
                        copy.push({
                          name: "",
                          age: "",
                          sex: "",
                          id_number: "",
                        });
                      }
                      return copy.slice(0, count - 1);
                    });
                  } else {
                    setMemberDetails([]);
                  }
                }}
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

            {/* Room */}
            <div>
              <label className="block mb-1 font-medium">Room Number</label>
              <input
              type="number"
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
                <option value="Driving License">
                  Driving License
                </option>
              </select>
            </div>

            {/* 🔥 ID IMAGE – ONLY CHANGE HERE */}
            <div>
              <label className="block mb-1 font-medium">
                Upload ID Proof
              </label>

              <button
                type="button"
                onClick={() => setShowUploadChoice(true)}
                className="border px-4 py-2 rounded-lg w-full bg-white text-left"
              >
                {idImage ? "✅ ID Selected" : "Choose Upload Method"}
              </button>
            </div>

            {/* ID Number */}
            <div>
              <label className="block mb-1 font-medium">ID Number</label>
              <input
                type="text"
                className="border px-4 py-2 rounded-lg w-full"
                value={IdNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>

            {/* Advance */}
            <div>
              <label className="block mb-1 font-medium">
                Advance Payment
              </label>
              <input
                type="number"
                className="border px-4 py-2 rounded-lg w-full"
                value={advance}
                onChange={(e) => setAdvance(Number(e.target.value))}
              />
            </div>

            {/* Receptionist */}
            <div>
              <label className="block mb-1 font-medium">
                Receptionist Name
              </label>
              <input
                className="border px-4 py-2 rounded-lg w-full"
                value={reception}
                onChange={(e) => setReception(e.target.value)}
              />
            </div>
{members > 1 && ( <div className="md:col-span-2 mt-4"> <h3 className="font-semibold mb-2"> Additional Members (Optional) </h3> <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {memberDetails.map((m, index) => ( <div key={index} className="border p-3 rounded bg-gray-50" > <p className="text-sm font-medium mb-1"> Member {index + 2} </p> <input placeholder="Name" className="border px-2 py-1 rounded w-full mb-2" value={m.name} onChange={(e) => { const copy = [...memberDetails]; copy[index].name = e.target.value; setMemberDetails(copy); }} /> <input type="number" placeholder="Age" className="border px-2 py-1 rounded w-full mb-2" value={m.age} onChange={(e) => { const copy = [...memberDetails]; copy[index].age = e.target.value; setMemberDetails(copy); }} /> <select className="border px-2 py-1 rounded w-full mb-2" value={m.sex} onChange={(e) => { const copy = [...memberDetails]; copy[index].sex = e.target.value; setMemberDetails(copy); }} > <option value="">Sex</option> <option value="M">Male</option> <option value="F">Female</option> <option value="O">Other</option> </select> <input placeholder="ID Number" className="border px-2 py-1 rounded w-full" value={m.id_number} onChange={(e) => { const copy = [...memberDetails]; copy[index].id_number = e.target.value; setMemberDetails(copy); }} /> </div> ))} </div> </div> )}
            {/* Submit */}
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

      {/* 🔹 UPLOAD OPTION MODAL */}
      {showUploadChoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-72">
            <h3 className="font-semibold mb-4 text-center">
              Select ID Upload Option
            </h3>

            {/* LOCAL UPLOAD */}
            <label className="block w-full mb-3 bg-gray-200 text-center py-2 rounded-lg cursor-pointer">
              📁 Upload from Device
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setIdImage(e.target.files[0]);
                  setShowUploadChoice(false);
                }}
              />
            </label>

            {/* QR OPTION */}
            <button
              type="button"
onClick={async () => {
  const res = await fetch("/api/qr-generate");
  const data = await res.json();

  const frontendBase = window.location.origin; // 🔥 React URL
  const url = `${frontendBase}/upload-id/${data.token}`;

  setQrToken(data.token);
  setQrUrl(url);
  setShowUploadChoice(false);
  setShowQR(true);
}}


              className="w-full bg-black text-white py-2 rounded-lg"
            >
              📷 Upload via QR
            </button>

            <button
              type="button"
              onClick={() => setShowUploadChoice(false)}
              className="mt-4 text-sm text-red-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    {showQR && qrUrl && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded-lg w-72 text-center">
      <h3 className="font-semibold mb-3">Guest ID Upload QR</h3>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
        alt="QR"
        className="mx-auto"
      />

      <button
        onClick={() => setShowQR(false)}
        className="mt-4 text-sm text-red-600"
      >
        Close
      </button>
    </div>
  </div>
)}


    </div>
    
  );
}
