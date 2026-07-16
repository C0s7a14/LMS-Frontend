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
import Certificates from "../pages/student/Certificates";
import CertificateDetails from "../pages/student/CertificateDetails";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CourseStudy from "../pages/student/CourseStudy";
import ManageCourseLessons from "../pages/admin/ManageCourseLessons";
import QuizAttempt from "../pages/student/QuizAttempt";

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

       {/* Tela de avaliação fora do DashboardLayout */}
        <Route
          path="/meus-cursos/avaliacao/:quizId"
          element={<QuizAttempt />}
        />

         {/*Usuarios*/}
        <Route element={<DashboardLayout/>}>
        <Route path="/home" element={<Home/>}/>
        <Route path="/devices" element={<Device/>}/>
        <Route path="/courses" element={<MyCourses/>}/>
        <Route path="/support" element={<Support/>}/>
        <Route path="/create-courses" element={<CreateCourses/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/certificate" element={<Certificates/>}/>
        <Route path="/certificate/:certificateId" element={<CertificateDetails />} />
        <Route path="/users" element={<Users/>}/>
        <Route path="/courses/:courseId" element={<CourseStudy/>} />
        <Route path="/admin/courses/:courseId/aulas" element={<ManageCourseLessons />}/>
        <Route path="/Dashboard" element={<AdminDashboard/>}/>
        
        </Route>



      </Routes>
    </BrowserRouter>
  );
}