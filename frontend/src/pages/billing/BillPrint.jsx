import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Bill.css";

export default function BillPrint() {
  const { billNo  } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [bill, setBill] = useState(location.state?.bill || null);

  /* ===== Fetch on refresh ===== */
  useEffect(() => {
    if (!bill && billNo) {
      fetch(`/api/bill/${billNo}`)
        .then(res => res.json())
        .then(data => setBill(data));
    }
  }, [bill, billNo]);

  /* ===== Auto print ===== */
  useEffect(() => {
    if (bill) {
      setTimeout(() => window.print(), 500);
    }
  }, [bill]);

  if (!bill) return <div>Loading...</div>;

  const hasExtras = bill.items && bill.items.length > 0 ;

  return (
    <div className="receipt-wrapper">
      <div className="receipt">

        {/* ===== HEADER ===== */}
        <div className="center text-xl bold">{bill.shop_name}</div>
        <div className="center">
          {bill.address}<br />
          {bill.city}<br/>
          MOB:{bill.tel}
        </div>

        <div className="line" />

        {/* ===== BASIC INFO ===== */}
        <div className="info">
          <div>BILL NO : {bill.bill_no}</div>
          <div>OPERATOR : {bill.operator}</div>
          <div>ROOM : {bill.room_no}</div>
          <div>DATE : {bill.date}</div>
        </div>

        <div className="line" />

        {/* ===== GUEST ===== */}
        <div className="info">
          <div>GUEST : {bill.guest}</div>
          <div>MOBILE : {bill.mobile_no || "-"}</div>
        </div>

        <div className="line" />

        {/* ===== ROOM ONLY ===== */}
        {!hasExtras && (
          <>
            <div className="info">
              <div>ROOM CHARGE</div>
              <div>
                RATE : ₹{Number(bill.room_charges).toFixed(2)} × {bill.days} DAY(S)
              </div>
            </div>

            <div className="line" />

            <div className="totals">
              <div className="row bold">
                <span>ROOM TOTAL</span>
                <span>₹{Number(bill.room_Total).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* ===== ROOM + EXTRAS ===== */}
        {hasExtras && (
          <>
            <table>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QTY</th>
                  <th>RATE</th>
                  <th>AMT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ROOM</td>
                  <td>{bill.days}</td>
                  <td>{Number(bill.room_charges).toFixed(2)}</td>
                  <td>{Number(bill.room_Total).toFixed(2)}</td>
                </tr>

                {bill.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.title || item.name}</td>
                    <td>{item.qty ?? 1}</td>
                    <td>{Number(item.rate ?? item.amount).toFixed(2)}</td>
                    <td>{Number(item.amount ?? item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="line" />

        {/* ===== TOTALS (RIGHT ALIGNED) ===== */}
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
            <span>₹{Number(bill.advance).toFixed(2)}</span>
          </div>
          <div className="row bold">
            <span>PAYABLE</span>
            <span>₹{Number(bill.payable).toFixed(2)}</span>
          </div>
        </div>

        <div className="line" />

        <div className="center">TAX ALREADY INCLUDED</div>
        <div className="center bold">* THANK YOU  || VISIT AGAIN*</div>

        {/* ===== BUTTONS ===== */}
        <button className="print-btn" onClick={() => window.print()}>
          PRINT
        </button>

        <button className="back-btn" onClick={() => navigate("/hotel/check-out")}>
          BACK
        </button>

      </div>
    </div>
  );
}
