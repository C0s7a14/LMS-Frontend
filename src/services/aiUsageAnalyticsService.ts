import axios from "axios";

import type {
  AiTokenAnalyticsType,
  AiCostAnalyticsType,
  AiAudioAnalyticsType,
  AiCourseGenerationAnalyticsType,
} from "../types/aiUsageAnalytics.types";


const API_URL = import.meta.env.VITE_API_URL;


export async function getAiTokenAnalytics(
  days = 30
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessão expirada.");
  }

  const response = await axios.get<AiTokenAnalyticsType>(
    `${API_URL}/admin/ai-usage/tokens`,
    {
      params: {
        days,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getAiCostAnalytics(
  days = 30
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessão expirada.");
  }

  const response = await axios.get<AiCostAnalyticsType>(
    `${API_URL}/admin/ai-usage/costs`,
    {
      params: {
        days,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getAiAudioAnalytics(
  days = 30
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessão expirada.");
  }

  const response =
    await axios.get<AiAudioAnalyticsType>(
      `${API_URL}/admin/ai-usage/audios`,
      {
        params: {
          days,
        },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}

export async function getAiCourseGenerationAnalytics(
  days = 30
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessão expirada.");
  }

  const response =
    await axios.get<AiCourseGenerationAnalyticsType>(
      `${API_URL}/admin/ai-usage/courses`,
      {
        params: {
          days,
        },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}