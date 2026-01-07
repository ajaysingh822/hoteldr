import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function UploadId() {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    const fd = new FormData();
    fd.append("id_image", file);

    setLoading(true);
    const res = await fetch(`/api/qr-upload/${token}`, {
      method: "POST",
      body: fd,
    });
    setLoading(false);

    const data = await res.json();
    if (data.status === "success") {
      toast.success("ID uploaded successfully");
    } else {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="font-bold mb-4 text-center">Upload ID Proof</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

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
