import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/login.jsx";
import SelectType from "../src/pages/billing/SelectType";

// Hotel Imports
import HotelDashboard from "./pages/HotelDashboard";
import HotelBilling from "./pages/billing/HotelBilling";
import HotelCheckIn from "./pages/customer/HotelCheckIn";
import HotelCheckOut from "./pages/customer/HotelCheckOut";
// Restaurant Imports
import ResturantDashboard from "./pages/ResturantDashboard";
import TableNumber from "./pages/customer/BillNumber.jsx";

// Admin Imports
import AdminDashboard from "./pages/AdminDashboard.jsx";

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
      // hotel routes
      <Route path="/billing/hotel" element={<HotelBilling />} />
      <Route path="/hotel/check-in" element={<HotelCheckIn />} />
      <Route path="/hotel/check-out" element={<HotelCheckOut />} />
      <Route path="/hotel-dashboard" element={<HotelDashboard />} />
      // restaurant routes
    <Route path="/restaurant-dashboard" element={<ResturantDashboard />} />
    <Route path="/table-number" element={<TableNumber />} />
    
    //admin routes can be added here
    <Route path="/admin-dashboard" element={<AdminDashboard />} />


    </Routes>
  );
}
