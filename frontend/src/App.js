import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/login.jsx";
import SelectType from "../src/pages/billing/SelectType";
   import HotelDashboard from "./pages/HotelDashboard";
import HotelBilling from "./pages/billing/HotelBilling";
import HotelCheckIn from "./pages/customer/HotelCheckIn";
import HotelCheckOut from "./pages/customer/HotelCheckOut";
// import RestaurantCheckIn from "./pages/restaurant/RestaurantCheckIn";
// import RestaurantCheckOut from "./pages/restaurant/RestaurantCheckOut";
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
      <Route path="/billing/hotel" element={<HotelBilling />} />
         <Route path="/hotel/check-in" element={<HotelCheckIn />} />
      <Route path="/hotel/check-out" element={<HotelCheckOut />} />
      {/* <Route path="/billing/restaurant" element={<RestaurantBilling />} /> */}
   

<Route path="/hotel-dashboard" element={<HotelDashboard />} />

    </Routes>
  );
}
