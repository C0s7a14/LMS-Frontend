import { BrowserRouter, Routes, Route } from "react-router-dom";


import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/Forgotpassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/auth/Home";
import Device from "../pages/auth/Devices";
import MyCourses from "../pages/student/Courses";
import Support from "../pages/client/Support";
import CreateCourses from "../pages/admin/CreateCourse";
import Settings from "../pages/auth/Settings";
import Certicate from "../pages/student/Certificates";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/user";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Autentificação*/}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />



         {/*Usuarios*/}
        <Route element={<DashboardLayout/>}>
        <Route path="/home" element={<Home/>}/>
        <Route path="/devices" element={<Device/>}/>
        <Route path="/courses" element={<MyCourses/>}/>
        <Route path="/support" element={<Support/>}/>
        <Route path="/create-courses" element={<CreateCourses/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/certificate" element={<Certicate/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/Dashboard" element={<AdminDashboard/>}/>
        </Route>



      </Routes>
    </BrowserRouter>
  );
}