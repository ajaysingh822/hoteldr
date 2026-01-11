import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Bill.css";

export default function HotelBillPrint() {
  const { billNo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 bill source: state → API (refresh safe)
  const [bill, setBill] = useState(location.state?.bill || null);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH BILL ON REFRESH ===== */
  useEffect(() => {
    if (!bill && billNo) {
      setLoading(true);
      fetch(`/api/bill/${billNo}`)
        .then(res => res.json())
        .then(data => {
          setBill(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [bill, billNo]);

  /* ===== AUTO PRINT ===== */
  useEffect(() => {
    if (bill) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [bill]);

  if (loading) return <div style={{ padding: 20 }}>Loading bill...</div>;
  if (!bill) return <div style={{ padding: 20 }}>Bill not found</div>;

  const extras = bill.items || [];
  const hasExtras = extras.length > 0;

  return (
    <div className="receipt-wrapper">
      <div className="receipt">

        {/* ===== HEADER ===== */}
        <div className="center bold text-lg">{bill.shop_name}</div>
        <div className="center">
          {bill.address}<br />
          {bill.city}<br />
          MOB: {bill.tel}
        </div>

        <div className="line" />

        {/* ===== BASIC INFO ===== */}
        <div className="info">
          <div><span>BILL NO :</span><span>{bill.bill_no}</span></div>
          <div><span>OPERATOR :</span><span>{bill.operator}</span></div>
          <div><span>ROOM :</span><span>{bill.room_no}</span></div>
          <div><span>DATE :</span><span>{bill.date}</span></div>
        </div>

        <div className="line" />

        {/* ===== GUEST INFO ===== */}
        <div className="info">
          <div><span>GUEST :</span><span>{bill.guest}</span></div>
          {/* <div><span>MOBILE</span><span>{bill.mobile_no || "-"}</span></div> */}
        </div>

        <div className="line" />

        {/* ===== ROOM CHARGES ===== */}
        <div className="info">
          <div className="bold">ROOM CHARGE</div>
          <div>
            RATE : ₹{Number(bill.room_charges).toFixed(2)} × {bill.days} DAY(S)
          </div>
        </div>

        <div className="line" />

        <div className="totals">
          <div className="row bold">
            <span>ROOM TOTAL</span>
            <span>₹{Number(bill.room_charges).toFixed(2)}</span>
          </div>
        </div>

        {/* ===== EXTRA CHARGES ===== */}
        {hasExtras && (
          <>
            <div className="line" />

            <table className="items-table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QTY</th>
                  <th>RATE</th>
                  <th>AMT</th>
                </tr>
              </thead>
              <tbody>
                {extras.map((item, i) => (
                  <tr key={i}>
                    <td>{item.title || item.name}</td>
                    <td>{item.qty ?? 1}</td>
                    <td>₹{Number(item.rate).toFixed(2)}</td>
                    <td>₹{Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="line" />

        {/* ===== GRAND TOTAL ===== */}
        <div className="totals">
          <div className="row">
            <span>SUB TOTAL</span>
            <span>₹{Number(bill.sub_total).toFixed(2)}</span>
          </div>
          <div className="row">
            <span>CGST (INCL)</span>
            <span>₹{Number(bill.cgst || 0).toFixed(2)}</span>
          </div>
          <div className="row">
            <span>SGST (INCL)</span>
            <span>₹{Number(bill.sgst || 0).toFixed(2)}</span>
          </div>

          <div className="line" />

          <div className="row bold">
            <span>TOTAL</span>
            <span>₹{Number(bill.total).toFixed(2)}</span>
          </div>
          <div className="row">
            <span>ADVANCE</span>
            <span>₹{Number(bill.advance || 0).toFixed(2)}</span>
          </div>
          <div className="row bold">
            <span>PAYABLE</span>
            <span>₹{Number(bill.payable).toFixed(2)}</span>
          </div>
        </div>

        <div className="line" />

        <div className="center">TAX ALREADY INCLUDED</div>
        <div className="center bold">* THANK YOU || VISIT AGAIN *</div>

        {/* ===== ACTION BUTTONS ===== */}
        <button className="print-btn" onClick={() => window.print()}>
          PRINT
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/hotel/check-out")}
        >
          BACK
        </button>

      </div>
    </div>
  );
}
