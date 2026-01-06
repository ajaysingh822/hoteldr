import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../../Bill.css";

export default function RestaurantBillPrint() {
  const location = useLocation();
  const navigate = useNavigate();

  const bill =
    location.state?.bill ||
    JSON.parse(localStorage.getItem("last_bill"));

  useEffect(() => {
    if (bill) setTimeout(() => window.print(), 400);
  }, [bill]);

  if (!bill) return <div>Bill not found</div>;

  return (
    <div className="receipt-wrapper">
      <div className="receipt">

        {/* ===== HEADER ===== */}
        <div className="center text-xl bold">{bill.shop_name}</div>
        <div className="center">RESTAURANT BILL</div>

        <div className="line" />

        {/* ===== INFO ===== */}
        <div className="info">
          <div>BILL NO : {bill.bill_no}</div>
          <div>DATE : {bill.date}</div>
          <div>TABLE : {bill.table_no}</div>
        </div>

        <div className="line" />

        {/* ===== ITEMS ===== */}
        <table>
          <thead>
            <tr>
              <th>ITEM</th>
              <th>AMT</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((i, idx) => (
              <tr key={idx}>
                <td>{i.name}</td>
                <td>₹{Number(i.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="line" />

        {/* ===== TOTAL ===== */}
        <div className="totals">
          <div className="row bold">
            <span>TOTAL</span>
            <span>₹{Number(bill.total).toFixed(2)}</span>
          </div>
          <div className="row">
            <span>PAYMENT</span>
            <span>{bill.payment_mode}</span>
          </div>
        </div>

        <div className="line" />

        <div className="center bold">
          * THANK YOU || VISIT AGAIN *
        </div>

        {/* ===== BUTTONS ===== */}
        <button className="print-btn" onClick={() => window.print()}>
          PRINT
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/restaurant-dashboard")}
        >
          BACK
        </button>

      </div>
    </div>
  );
}
