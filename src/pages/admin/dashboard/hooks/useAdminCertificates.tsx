import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface UseAdminCertificatesProps {
  refreshDashboard: () => Promise<void>;
}

export default function useAdminCertificates({
  refreshDashboard,
}: UseAdminCertificatesProps) {
  const navigate = useNavigate();

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

  async function handleDownloadCertificate(
    certificateId: number,
    studentName: string,
  ) {
    try {
      const config = getAuthConfig();

      if (!config) {
        return;
      }

      toast.loading("Gerando PDF...", {
        id: "download-cert",
      });

      const response = await axios.get(
        `http://localhost:3333/certificates/${certificateId}/download`,
        {
          ...config,
          responseType: "blob",
        },
      );

      const fileUrl =
        window.URL.createObjectURL(
          new Blob([response.data]),
        );

      const downloadLink =
        document.createElement("a");

      downloadLink.href = fileUrl;

      downloadLink.setAttribute(
        "download",
        `Certificado-${studentName.replace(
          /\s+/g,
          "-",
        )}.pdf`,
      );

      document.body.appendChild(downloadLink);

      downloadLink.click();
      downloadLink.remove();

      window.URL.revokeObjectURL(fileUrl);

      toast.success("Download concluído!", {
        id: "download-cert",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "Erro ao baixar o certificado.",
        {
          id: "download-cert",
        },
      );
    }
  }

  function handleRevokeCertificate(
    certificateId: number,
  ) {
    toast(
      (currentToast) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Tem certeza que deseja revogar este
            certificado?
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta ação apagará o registro do banco de
            dados e não pode ser desfeita.
          </p>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={() =>
                toast.dismiss(currentToast.id)
              }
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={async () => {
                toast.dismiss(currentToast.id);

                const loadingToast = toast.loading(
                  "Revogando certificado...",
                );

                try {
                  const config = getAuthConfig();

                  if (!config) {
                    toast.dismiss(loadingToast);
                    return;
                  }

                  await axios.delete(
                    `http://localhost:3333/certificates/${certificateId}`,
                    config,
                  );

                  toast.success(
                    "Certificado revogado com sucesso!",
                    {
                      id: loadingToast,
                    },
                  );

                  await refreshDashboard();
                } catch (error) {
                  console.error(
                    "Erro ao revogar certificado:",
                    error,
                  );

                  toast.error(
                    "Erro ao tentar revogar o certificado.",
                    {
                      id: loadingToast,
                    },
                  );
                }
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all shadow-md shadow-red-500/20 cursor-pointer"
            >
              Sim, revogar
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  }

  return {
    handleDownloadCertificate,
    handleRevokeCertificate,
  };
}