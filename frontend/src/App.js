import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/login.jsx";
import SelectType from "../src/pages/billing/SelectType";
import { Toaster } from "react-hot-toast";
// Hotel Imports
import HotelDashboard from "./pages/HotelDashboard";
import HotelBilling from "./pages/billing/HotelBilling";
import HotelCheckIn from "./pages/customer/HotelCheckIn";
import HotelCheckOut from "./pages/customer/HotelCheckOut";

// Restaurant Imports
import ResturantDashboard from "./pages/ResturantDashboard";
import TableNumber from "./pages/customer/BillNumber.jsx";

// Admin Imports
import AdminLogin from "./components/AdminLogin.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx";





import HotelAddCharges from "../src/pages/billing/HotelAddcharges.jsx";
import HotelHistory from "./pages/customer/HotelHistory.jsx";
import HotelHistoryDetail from "./pages/customer/HotelHistoryDetails.jsx";
import BillPrint from "./pages/billing/BillPrint.jsx";
import AdminRestaurant from "./pages/AdminRestaurent.jsx";
import UploadId from "./pages/customer/UploadId.jsx";

export default function App() {
  const loggedIn = localStorage.getItem("counter_logged_in") === "true";

  return (<>
    <div className="w-full">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
    </div>
    <Routes>
      {/* Bill Print */}
      <Route path="/bill/:billNo" element={<BillPrint/>} />
      
      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to={loggedIn ? "/select-type" : "/login"} />}
      />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin/>} />
      <Route path="/select-type" element={<SelectType />} />

      {/* Hotel Routes */}
      <Route path="/hotel/check-in" element={<HotelCheckIn />} />
      <Route path="/hotel/check-out" element={<HotelCheckOut />} />
      <Route path="/hotel/billing/:id" element={<HotelBilling />} />
      <Route path="/hotel/charges/:id" element={<HotelAddCharges />} />
      <Route path="/hotel-dashboard" element={<HotelDashboard />} />
      // restaurant routes
    <Route path="/restaurant-dashboard" element={<ResturantDashboard />} />
    <Route path="/table-number" element={<TableNumber />} />
    
    //admin routes can be added here
    <Route path="/admin-dashboard" element={<AdminDashboard />} />


      {/* <Route path="/billing/hotel" element={<HotelBilling />} /> */}
         <Route path="/hotel/check-in" element={<HotelCheckIn />} />
      <Route path="/hotel/check-out" element={<HotelCheckOut />} />
         <Route path="/hotel/billing/:id" element={<HotelBilling />} />
      {/* <Route path="/billing/restaurant" element={<RestaurantBilling />} /> */}
   
 <Route path="/hotel/charges/:id" element={<HotelAddCharges />} />
<Route path="/hotel-dashboard" element={<HotelDashboard />} />
<Route path= "/hotel/history" element={<HotelHistory/>} />
<Route path="/hotel/history/:billId" element={<HotelHistoryDetail/>} />


    </Routes></>
  );
}
