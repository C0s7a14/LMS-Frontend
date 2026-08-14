import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { CompanyProvider } from "../contexts/CompanyContext";
import { PlatformAuthProvider } from "../contexts/PlatformAuthContext";

// =====================================================
// LAYOUTS
// =====================================================

import DashboardLayout from "../layouts/DashboardLayout";
import PlatformDashboardLayout from "../layouts/PlatformDashboardLayout";

// =====================================================
// PROTEÇÃO SUPERADMIN
// =====================================================

import PlatformProtectedRoute from "../components/platform/PlatformProtectedRoute";

// =====================================================
// SUPERADMIN
// =====================================================

import PlatformDashboard from "../pages/platform/PlatformDashboard";

// =====================================================
// AUTENTICAÇÃO / PÚBLICO
// =====================================================

import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";

import ForgotPassword from "../pages/auth/Forgotpassword";
import ResetPassword from "../pages/auth/ResetPassword";

import FreelancerInvitePublicPage from "../pages/public/FreelancerInvitePublicPage";

// =====================================================
// ÁREA GERAL
// =====================================================

import Home from "../pages/auth/Home";
import Device from "../pages/auth/Devices";
import Settings from "../pages/auth/Settings";
import StudentCourseCatalog from "../pages/auth/StudentCourseCatalog";

// =====================================================
// STUDENT
// =====================================================

import MyCourses from "../pages/student/Courses";
import Certificates from "../pages/student/Certificates";
import CertificateDetails from "../pages/student/CertificateDetails";
import CourseStudy from "../pages/student/CourseStudy";
import QuizAttempt from "../pages/student/QuizAttempt";

// =====================================================
// CLIENT
// =====================================================

import Support from "../pages/client/Support";
import ClientDeviceDetails from "../pages/client/ClientDeviceDetails";

// =====================================================
// ADMIN
// =====================================================

import CreateCourses from "../pages/admin/CreateCourse";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import ManageCourseLessons from "../pages/admin/ManageCourseLessons";
import Users from "../pages/admin/user";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================================= */}
        {/* SUPERADMIN / PLATFORM                             */}
        {/* ================================================= */}

        <Route
          element={
            <PlatformAuthProvider>
              <Outlet />
            </PlatformAuthProvider>
          }
        >
          {/* Entrada base */}
          <Route
            path="/platform"
            element={
              <Navigate
                to="/platform/dashboard"
                replace
              />
            }
          />

          {/* Login público do SuperAdmin */}
             <Route
            path="/platform/login"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

          {/* Rotas protegidas do SuperAdmin */}
          <Route
            element={
              <PlatformProtectedRoute />
            }
          >
            <Route
              element={
                <PlatformDashboardLayout />
              }
            >
              <Route
                path="/platform/dashboard"
                element={
                  <PlatformDashboard />
                }
              />

              {/*
                Próximas páginas:

                /platform/companies
                /platform/companies/:companyId
              */}
            </Route>
          </Route>
        </Route>

        {/* ================================================= */}
        {/* TENANT                                            */}
        {/* Admin / Student / Client                          */}
        {/* ================================================= */}

        <Route
          element={
            <CompanyProvider>
              <Outlet />
            </CompanyProvider>
          }
        >
          {/* AUTENTICAÇÃO */}

          <Route
            path="/"
            element={<Login />}
          />

          {/*
          <Route
            path="/register"
            element={<Register />}
          />
          */}

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route
            path="/reset-password"
            element={
              <ResetPassword />
            }
          />

          {/* ================================================= */}
          {/* TELAS FORA DO DASHBOARD LAYOUT                    */}
          {/* ================================================= */}

          <Route
            path="/meus-cursos/avaliacao/:quizId"
            element={
              <QuizAttempt />
            }
          />

          {/* Validação pública de certificado */}
          <Route
            path="/validar/:certificateId"
            element={
              <CertificateDetails />
            }
          />

          {/* Convite Freelancer */}
          <Route
            path="/convite/:token"
            element={
              <FreelancerInvitePublicPage />
            }
          />

          {/* ================================================= */}
          {/* ÁREA LOGADA TENANT                                */}
          {/* ================================================= */}

          <Route
            element={
              <DashboardLayout />
            }
          >
            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path="/catalog"
              element={
                <StudentCourseCatalog />
              }
            />

            <Route
              path="/devices"
              element={<Device />}
            />

            <Route
              path="/courses"
              element={
                <MyCourses />
              }
            />

            <Route
              path="/support"
              element={<Support />}
            />

            <Route
              path="/create-courses"
              element={
                <CreateCourses />
              }
            />

            <Route
              path="/settings"
              element={
                <Settings />
              }
            />

            <Route
              path="/certificate"
              element={
                <Certificates />
              }
            />

            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/courses/:courseId"
              element={
                <CourseStudy />
              }
            />

            <Route
              path="/admin/courses/:courseId/aulas"
              element={
                <ManageCourseLessons />
              }
            />

            <Route
              path="/Dashboard"
              element={
                <AdminDashboard />
              }
            />

            <Route
              path="/devices/:deviceId"
              element={
                <ClientDeviceDetails />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}