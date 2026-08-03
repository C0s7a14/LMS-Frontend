import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { fetchAdminDashboardData } from "../services/adminDashboardService";

import type {
  AdminDashboardData,
  AdminReportsData,
  AiDeviceType,
  AiKnowledgeSummary,
  AiPromptType,
  CourseType,
  DeviceType,
  EnrollmentRequestType,
  UserType,
} from "../types/adminDashboard.types";

export default function useAdminDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<AdminDashboardData | null>(null);

  const [adminReports, setAdminReports] =
    useState<AdminReportsData | null>(null);

  const [users, setUsers] =
    useState<UserType[]>([]);

  const [courses, setCourses] =
    useState<CourseType[]>([]);

  const [devices, setDevices] =
    useState<DeviceType[]>([]);

  const [enrollmentRequests, setEnrollmentRequests] =
    useState<EnrollmentRequestType[]>([]);

  const [aiSummary, setAiSummary] =
    useState<AiKnowledgeSummary | null>(null);

  const [aiDevices, setAiDevices] =
    useState<AiDeviceType[]>([]);

  const [aiPrompts, setAiPrompts] =
    useState<AiPromptType[]>([]);

  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Sessão expirada. Faça login novamente.",
        );

        navigate("/");
        return;
      }

      const data =
        await fetchAdminDashboardData(token);

      setDashboardData(data.dashboardData);
      setUsers(data.users);
      setCourses(data.courses);
      setDevices(data.devices);
      setAiSummary(data.aiSummary);
      setAiDevices(data.aiDevices);
      setAiPrompts(data.aiPrompts);
      setAdminReports(data.reports);
      setEnrollmentRequests(
        data.enrollmentRequests,
      );
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao carregar dados da dashboard",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao carregar dados",
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    dashboardData,
    adminReports,
    users,
    courses,
    devices,
    enrollmentRequests,
    aiSummary,
    aiDevices,
    aiPrompts,
    loading,
    loadDashboardData,
  };
}