import axios from "axios";

import { api } from "./api";

// READ ALL
export async function getCertificates() {
  const response = await api.get("/certificates");

  return response.data;
}

// DOWNLOAD PDF
export async function downloadCertificatePdf(
  id: number,
): Promise<Blob> {
  const response = await api.get<Blob>(
    `/certificates/${id}/download`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}

export async function validateCertificateCode(
  code: string,
) {
  try {
    const response = await api.get(
      `/certificates/validate/${code}`,
    );

    return response.data;
  } catch (error: unknown) {
    const message = axios.isAxiosError<{
      error?: string;
      message?: string;
    }>(error)
      ? error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao validar certificado"
      : "Erro ao validar certificado";

    throw new Error(message, {
      cause: error,
    });
  }
}