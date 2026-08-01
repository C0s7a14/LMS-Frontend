import { api } from "./api";

// READ ALL (For the list/table)
export async function getCertificates() {
    const response = await api.get("/certificates");
    return response.data; 
}

// DOWNLOAD PDF (For the download button)
export async function downloadCertificatePdf(id: number) {
    // CRITICAL: We must tell Axios that the response is a file (blob), not JSON data!
    const response = await api.get(`/certificates/${id}/download`, {
        responseType: "blob", 
    });
    return response.data;
}

export const validateCertificateCode = async (code: string) => {
  try {
    const response = await api.get(`/certificates/validate/${code}`); 
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Erro ao validar certificado");
  }
};