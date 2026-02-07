import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import DashboardHome from "./Pages/Dashboard/DashboardHome/DashboardHome";
import Notification from "./Pages/Dashboard/Notification";
import Otp from "./Pages/Auth/Otp";
import Login from "./Pages/Auth/Login";
import UpdatePassword from "./Pages/Auth/UpdatePassword";
import NotFound from "./404";
import PrivateRoute from "./routes/PrivateRoute";
import MakeAdmin from "./Pages/Dashboard/MakeAdmin";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import UserDetailsList from "./Pages/Dashboard/UserDetailsList";
import OrdersTransaction from "./Pages/Dashboard/OrdersTransaction";
import AdminProfile from "./Pages/Dashboard/AdminProfile";
import Disclaimer from "./Pages/Dashboard/Settings/Disclaimer";
import Terms from "./Pages/Dashboard/Settings/Terms";
import Category from "./Pages/Dashboard/Settings/Category";
import Booking from "./Pages/Dashboard/Booking";
import Musician from "./Pages/Dashboard/Musician";

function App() {
  return (
    <>
      <div className="maincontainer">
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<DashboardHome />} />
              <Route path="/user-list" element={<UserDetailsList />} />
              <Route path="/musician" element={<Musician />} />

              <Route
                path="/order-transaction-list"
                element={<OrdersTransaction />}
              />
              <Route path="/notification" element={<Notification />} />
              <Route path="/setting" element={<Category />} />
              {/* <Route path="/booking" element={<Booking />} /> */}
              <Route path="/make-admin" element={<MakeAdmin />} />
              <Route path="/admin-profile" element={<AdminProfile />} />

              <Route path="/categories" element={<Category />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/terms" element={<Terms />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
