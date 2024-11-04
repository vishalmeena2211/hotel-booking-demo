import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/private-route";
import PublicRoute from "./components/auth/public-route";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import BookingPage from "./pages/booking-page";
import GetBookings from "./pages/get-bookings";
import HotelManagerApprovePage from "./pages/hotel-manager-approve-page";
import Navbar from "./components/navbar";
function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/hotel-booking" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/get-booking" element={<PrivateRoute><GetBookings /></PrivateRoute>} />
        <Route path="/hotel-manager-booking-approval" element={<PrivateRoute><HotelManagerApprovePage /></PrivateRoute>} />

      </Routes>
    </>
  )
}

export default App
