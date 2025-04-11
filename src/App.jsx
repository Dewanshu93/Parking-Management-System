import FirstPage from "./components/FirstPage/FirstPage"
import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import SignUpPageWithNavigate from "./components/WithNavigate/SignUpWithNavigate";
import LoginPageWithNavigate from "./components/WithNavigate/LoginWithNavigate";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ContactUs from "./components/ContactUs/ContactUs";
import AboutUs from "./components/AboutUs/AboutUs";
import PlanPage from "./components/PlanPage/PlanPage";
import Testimonials from "./components/Testimonial/Testimonials";
import MyBookings from "./components/MyBookings/MyBookings";
import RateUs from "./components/RateUs/RateUs";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import AdminLoginPage from "./components/AdminLoginPage/AdminLoginPage";
import ManagerLoginPage from "./components/ManagerLoginPage/ManagerLoginPage";
import ManagerDashboard from "./components/ManagerDashboard/ManagerDashboard";
import BookingHistory from "./components/BookingHistory/BookingHistory";
import ManageEmployeeDashboard from "./components/ManageEmployeeDashboard/ManageEmployeeDashboard";
import PastBooking from "./components/PastBooking/PastBooking";
import Complain from "./components/Complain/Complain";
import ComplainManagePage from "./components/ComplainManagePage/ComplainManagePage";
import ComplainHistory from "./components/ComplainHistory/ComplainHistory";
import ProtectedRouteAdmin from "./components/ProtectedRoute/ProtectedRouteAdmin"
import ProtectedRouteManager from "./components/ProtectedRoute/ProtectedRouteManager"
import UserManagement from "./components/UserManagement/UserManagement";
import ManagerManagement from "./components/ManagerManagement/ManagerManagement";
import ParkingStationManagement from "./components/ParkingStationManagement/ParkingStationManagement";
import BookingHistoryAdmin from "./components/BookingHistoryAdmin/BookingHistoryAdmin";
import ManageComplainAdmin from "./components/ManageComplainAdmin/ManageComplainAdmin";
import ManageReview from "./components/ManageReview/ManageReview";
import ContactRequest from "./components/ContactRequest/ContactRequest";
import ManageAdmins from "./components/ManageAdmins/ManageAdmins";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<FirstPage/>} />
        <Route path="/login" element={<LoginPageWithNavigate/>} />
        <Route path="/SignUp" element={<SignUpPageWithNavigate />} />
        <Route path="/ContactUs" element={<ContactUs />} />


        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /></ProtectedRoute>}/>
        <Route path="/AboutUs" element={<AboutUs />}/>
        <Route path="/Plan" element={<PlanPage />}/>
        <Route path="/Testimonials" element={<Testimonials />}/>
        <Route path="/MyBookings" element={<ProtectedRoute><MyBookings/></ProtectedRoute>} />
        <Route path="/RateUs" element={<RateUs />} />
        <Route path="/BookingHistory" element={<ProtectedRoute><BookingHistory/></ProtectedRoute>}/>
        <Route path="/RaiseComplain" element={<ProtectedRoute><Complain/></ProtectedRoute>}/>
        <Route path="/ComplainHistory" element={<ProtectedRoute><ComplainHistory/></ProtectedRoute>}/>


        <Route path="/ManagerLogin" element={<ManagerLoginPage/>}/>
        <Route path="/ManagerDashboard" element={<ProtectedRouteManager ><ManagerDashboard /></ProtectedRouteManager>} />
        <Route path="/ManageEmployeeDashboard" element={<ProtectedRouteManager ><ManageEmployeeDashboard /></ProtectedRouteManager>}/>
        <Route path="/ManageComplain" element={<ProtectedRouteManager ><ComplainManagePage/></ProtectedRouteManager>}/>
        <Route path="/PastBooking" element={<ProtectedRouteManager ><PastBooking/></ProtectedRouteManager>}/>


        <Route path="/AdminLogin" element={<AdminLoginPage />}/>
        <Route path="/AdminDashboard" element={<ProtectedRouteAdmin isAdmin={true}><AdminDashboard /></ProtectedRouteAdmin>} />
        <Route path="/UserManagement" element={<ProtectedRouteAdmin isAdmin={true}><UserManagement/></ProtectedRouteAdmin>}/>
        <Route path="/ManagerManagement" element={<ProtectedRouteAdmin isAdmin={true}><ManagerManagement/></ProtectedRouteAdmin>}/>
        <Route path="/ParkingStationManagement" element={<ProtectedRouteAdmin isAdmin={true}><ParkingStationManagement/></ProtectedRouteAdmin>}/>
        <Route path="/BookingHistoryAdmin" element={<ProtectedRouteAdmin isAdmin={true}><BookingHistoryAdmin/></ProtectedRouteAdmin>}/>
        <Route path="/ManageComplainAdmin" element={<ProtectedRouteAdmin isAdmin={true}><ManageComplainAdmin/></ProtectedRouteAdmin>}/>
        <Route path="/ManageReview" element={<ProtectedRouteAdmin isAdmin={true}><ManageReview/></ProtectedRouteAdmin>}/>
        <Route path="/ContactRequest" element={<ProtectedRouteAdmin isAdmin={true}><ContactRequest/></ProtectedRouteAdmin>}/>
        <Route path="/ManageAdmins" element={<ProtectedRouteAdmin isAdmin={true}><ManageAdmins/></ProtectedRouteAdmin>}/>

      </Routes>
    </Router>
  )
}

export default App
