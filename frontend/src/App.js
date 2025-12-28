import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/login.jsx";
import SelectType from "../src/pages/billing/SelectType";
// import HotelBilling from "./pages/billing/HotelBilling";
// import RestaurantBilling from "./pages/billing/RestaurantBilling";

export default function App() {
  const loggedIn = localStorage.getItem("counter_logged_in") === "true";

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={loggedIn ? "/select-billing" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/select-billing" element={<SelectType />} />
      {/* <Route path="/billing/hotel" element={<HotelBilling />} /> */}
      {/* <Route path="/billing/restaurant" element={<RestaurantBilling />} /> */}
    </Routes>
  );
}
