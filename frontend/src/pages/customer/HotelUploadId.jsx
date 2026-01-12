import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function HotelUploadId() {
  const { guestId } = useParams();
  const navigate = useNavigate();
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!f1 || !f2) {
      toast.error("Upload both images");
      return;
    }

    const fd = new FormData();
    fd.append("id_image", f1);
    fd.append("id_image2", f2);

    setLoading(true);

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/guest/upload-id/${guestId}`,
      {
        method: "POST",
        credentials: "include",
        body: fd,
      }
    );

    const data = await res.json();
    setLoading(false);

    if (data.status === "success") {
      toast.success("ID saved");
      navigate(-1);
    } else {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="font-bold mb-4 text-center">Upload Guest ID</h2>

        <input type="file" onChange={e => setF1(e.target.files[0])} />
        <p className="text-xs">Front</p>

        <input type="file" className="mt-3" onChange={e => setF2(e.target.files[0])} />
        <p className="text-xs">Back</p>

        <button
          onClick={upload}
          disabled={loading}
          className="mt-4 w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
