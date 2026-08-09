import axios from "axios";

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
  AdminStudentOverviewType,
} from "../types/adminDashboard.types";

const API_URL = "http://localhost:3333";

export interface AdminDashboardLoadResult {
  dashboardData: AdminDashboardData;
  users: UserType[];
  students: AdminStudentOverviewType[];
  courses: CourseType[];
  devices: DeviceType[];
  aiSummary: AiKnowledgeSummary;
  aiDevices: AiDeviceType[];
  aiPrompts: AiPromptType[];
  reports: AdminReportsData;
  enrollmentRequests: EnrollmentRequestType[];
}

export async function fetchAdminDashboardData(
  token: string,
): Promise<AdminDashboardLoadResult> {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [
  dashboardResponse,
  usersResponse,
  studentsResponse,
  coursesResponse,
  devicesResponse,
  aiSummaryResponse,
  aiDevicesResponse,
  aiPromptsResponse,
  reportsResponse,
  enrollmentRequestsResponse,
] = await Promise.all([
    axios.get<AdminDashboardData>(
      `${API_URL}/admin/dashboard`,
      config,
    ),

    axios.get<UserType[]>(
  `${API_URL}/users`,
  config,
),

axios.get<AdminStudentOverviewType[]>(
  `${API_URL}/admin/students`,
  config,
),

axios.get<CourseType[]>(
  `${API_URL}/courses`,
  config,
),

    axios.get<DeviceType[]>(
      `${API_URL}/devices`,
      config,
    ),

    axios.get<AiKnowledgeSummary>(
      `${API_URL}/admin/ai/summary`,
      config,
    ),

    axios.get<AiDeviceType[]>(
      `${API_URL}/admin/ai/devices`,
      config,
    ),

    axios.get<AiPromptType[]>(
      `${API_URL}/admin/ai/prompts`,
      config,
    ),

    axios.get<AdminReportsData>(
      `${API_URL}/admin/reports`,
      config,
    ),

    axios.get<EnrollmentRequestType[]>(
      `${API_URL}/admin/enrollment-requests`,
      config,
    ),
  ]);

  return {
  dashboardData: dashboardResponse.data,
  users: usersResponse.data,
  students: studentsResponse.data,
  courses: coursesResponse.data,
  devices: devicesResponse.data,
  aiSummary: aiSummaryResponse.data,
  aiDevices: aiDevicesResponse.data,
  aiPrompts: aiPromptsResponse.data,
  reports: reportsResponse.data,
  enrollmentRequests:
    enrollmentRequestsResponse.data,
};
}