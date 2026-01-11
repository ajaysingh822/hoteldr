import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
// import "../../Bill.css";

export default function RestaurantBillPrint() {
  const location = useLocation();
  const navigate = useNavigate();
  const { billNo } = useParams();

  // 🔥 BILL SOURCE (STATE → LOCALSTORAGE)
  const bill =
    location.state?.bill ||
    JSON.parse(localStorage.getItem("last_bill"));

  // 🔥 AUTO PRINT
  useEffect(() => {
    if (bill) {
      setTimeout(() => {
        window.print();
         // 🔥 PRINT PAGE SAFE
      localStorage.removeItem("last_bill", JSON.stringify(bill));
      }, 400);
    }
  }, [bill]);

  if (!bill) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Bill not found</h3>
        <button onClick={() => navigate("/restaurant-dashboard")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="receipt-wrapper">
      <div className="receipt">

        {/* ===== HEADER ===== */}
        <div className="center text-xl bold">DR HOTEL & RESTAURANT</div>
        <div className="center">Maksi Road Bypass<br/>
DEWAS M.P (455001)<br/>
MOB: 9131700422 , 9977904180</div>

        <div className="line" />

        {/* ===== INFO ===== */}
        <div className="info">
          <div>BILL NO : {billNo || bill.bill_no}</div>
          <div>DATE : {bill.date}</div>
          <div>TABLE : {bill.table_no}</div>
        </div>

        <div className="line" />

        {/* ===== ITEMS ===== */}
        <table className="items-table">
          <thead>
            <tr>
              <th align="left">ITEM</th>
              <th align="right">AMT</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((i, idx) => (
              <tr key={idx}>
                <td>{i.name}</td>
                <td align="right">₹{Number(i.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="line" />

        {/* ===== TOTAL ===== */}
        <div className="totals">
          <div className="row ">
            <span>SUB TOTAL</span>
            <span>₹{Number(bill.total).toFixed(2)}</span>
            
          </div>
          
          <div className="row">
            <span>CGST (INCL)</span>
          <span>₹O</span>
          </div>  
          <div className="row">
            <span>SGST (INCL)</span>
         <span>₹0</span>
          </div>
             <div className="line" />
               <div className="row bold">
            <span>SUB TOTAL</span>
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

        {/* ===== ACTION BUTTONS ===== */}
        <div className="actions">
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
    </div>
  );
}
