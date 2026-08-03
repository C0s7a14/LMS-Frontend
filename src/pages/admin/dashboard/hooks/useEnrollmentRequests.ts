import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface UseEnrollmentRequestsProps {
  refreshDashboard: () => Promise<void>;
}

export default function useEnrollmentRequests({
  refreshDashboard,
}: UseEnrollmentRequestsProps) {
  const navigate = useNavigate();

  const [
    updatingEnrollmentRequestId,
    setUpdatingEnrollmentRequestId,
  ] = useState<number | null>(null);

  function getAuthConfig() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Sessão expirada. Faça login novamente.",
      );

      navigate("/");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async function handleApproveEnrollmentRequest(
    requestId: number,
  ) {
    try {
      setUpdatingEnrollmentRequestId(requestId);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      const response = await axios.patch(
        `http://localhost:3333/admin/enrollment-requests/${requestId}/approve`,
        {},
        config,
      );

      toast.success(
        response.data?.message ||
          "Solicitação aprovada com sucesso.",
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao aprovar solicitação.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao aprovar solicitação.",
      );
    } finally {
      setUpdatingEnrollmentRequestId(null);
    }
  }

  async function handleRejectEnrollmentRequest(
    requestId: number,
  ) {
    const motivoResposta = window.prompt(
      "Informe o motivo da rejeição. Você pode deixar em branco.",
    );

    if (motivoResposta === null) {
      return;
    }

    try {
      setUpdatingEnrollmentRequestId(requestId);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      const response = await axios.patch(
        `http://localhost:3333/admin/enrollment-requests/${requestId}/reject`,
        {
          motivo_resposta:
            motivoResposta.trim() || null,
        },
        config,
      );

      toast.success(
        response.data?.message ||
          "Solicitação rejeitada com sucesso.",
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao rejeitar solicitação.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao rejeitar solicitação.",
      );
    } finally {
      setUpdatingEnrollmentRequestId(null);
    }
  }

  return {
    updatingEnrollmentRequestId,
    handleApproveEnrollmentRequest,
    handleRejectEnrollmentRequest,
  };
}