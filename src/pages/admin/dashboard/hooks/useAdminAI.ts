import {
  useState,
  type ChangeEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { DEFAULT_AI_PROMPT } from "../constants/adminDashboard.constants";

import type {
  AiPromptFormState,
  AiPromptType,
  DeviceType,
} from "../types/adminDashboard.types";

interface AiDocumentType {
  id: number;
  titulo: string;
  nome_arquivo_original: string;
  total_chunks?: number | null;
  status: string;
}

type AiPromptTextField =
  | "nome"
  | "conteudo"
  | "dispositivo_id";

interface UseAdminAIProps {
  refreshDashboard: () => Promise<void>;
}

export default function useAdminAI({
  refreshDashboard,
}: UseAdminAIProps) {
  const navigate = useNavigate();

  const [selectedAiDevice, setSelectedAiDevice] =
    useState<DeviceType | null>(null);

  const [deviceDocuments, setDeviceDocuments] =
    useState<AiDocumentType[]>([]);

  const [loadingDocuments, setLoadingDocuments] =
    useState(false);

  const [uploadingDocument, setUploadingDocument] =
    useState(false);

  const [
    processingDocumentId,
    setProcessingDocumentId,
  ] = useState<number | null>(null);

  const [promptModalOpen, setPromptModalOpen] =
    useState(false);

  const [editingAiPrompt, setEditingAiPrompt] =
    useState<AiPromptType | null>(null);

  const [aiPromptForm, setAiPromptForm] =
    useState<AiPromptFormState>({
      nome: "",
      conteudo: "",
      dispositivo_id: "",
      ativo: true,
    });

  const [savingAiPrompt, setSavingAiPrompt] =
    useState(false);

  function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Sessão expirada. Faça login novamente.",
      );

      navigate("/");
      return null;
    }

    return token;
  }

  async function openAiDocumentsModal(
    device: DeviceType,
  ) {
    try {
      setSelectedAiDevice(device);
      setLoadingDocuments(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const response =
        await axios.get<AiDocumentType[]>(
          `http://localhost:3333/admin/devices/${device.id}/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      setDeviceDocuments(response.data);
    } catch (error) {
      console.log(error);

      toast.error(
        "Erro ao carregar documentos do dispositivo",
      );
    } finally {
      setLoadingDocuments(false);
    }
  }

  function closeAiDocumentsModal() {
    if (
      uploadingDocument ||
      processingDocumentId !== null
    ) {
      return;
    }

    setSelectedAiDevice(null);
    setDeviceDocuments([]);
  }

  async function handleUploadAiDocument(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    try {
      const file = event.target.files?.[0];

      if (!file || !selectedAiDevice) {
        return;
      }

      if (file.type !== "application/pdf") {
        toast.error(
          "Selecione apenas arquivos PDF.",
        );
        return;
      }

      setUploadingDocument(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("titulo", file.name);

      formData.append(
        "descricao",
        `Documento técnico vinculado ao dispositivo ${selectedAiDevice.nome}`,
      );

      await axios.post(
        `http://localhost:3333/admin/devices/${selectedAiDevice.id}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("PDF enviado com sucesso.");

      await openAiDocumentsModal(
        selectedAiDevice,
      );

      await refreshDashboard();

      event.target.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar PDF.");
    } finally {
      setUploadingDocument(false);
    }
  }

  async function handleProcessAiDocument(
    documentId: number,
  ) {
    try {
      if (!selectedAiDevice) {
        return;
      }

      setProcessingDocumentId(documentId);

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await axios.post(
        `http://localhost:3333/admin/device-documents/${documentId}/process`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(
        `Documento processado com ${response.data.total_chunks} chunks.`,
      );

      await openAiDocumentsModal(
        selectedAiDevice,
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao processar PDF.");
    } finally {
      setProcessingDocumentId(null);
    }
  }

  async function handleDeleteAiDocument(
    documentId: number,
  ) {
    try {
      if (!selectedAiDevice) {
        return;
      }

      const confirmDelete = window.confirm(
        "Tem certeza que deseja excluir este documento da base da IA?",
      );

      if (!confirmDelete) {
        return;
      }

      const token = getToken();

      if (!token) {
        return;
      }

      await axios.delete(
        `http://localhost:3333/admin/device-documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(
        "Documento excluído com sucesso.",
      );

      await openAiDocumentsModal(
        selectedAiDevice,
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir documento.");
    }
  }

  function openAiPromptModal(
    prompt?: AiPromptType | null,
  ) {
    if (prompt) {
      setEditingAiPrompt(prompt);

      setAiPromptForm({
        nome: prompt.nome,
        conteudo: prompt.conteudo,
        dispositivo_id: prompt.dispositivo_id
          ? String(prompt.dispositivo_id)
          : "",
        ativo: Boolean(prompt.ativo),
      });

      setPromptModalOpen(true);
      return;
    }

    setEditingAiPrompt(null);

    setAiPromptForm({
      nome: "Prompt padrão - Agente Técnico Sirros",
      conteudo: DEFAULT_AI_PROMPT,
      dispositivo_id: "",
      ativo: true,
    });

    setPromptModalOpen(true);
  }

  function closeAiPromptModal() {
    if (savingAiPrompt) {
      return;
    }

    setPromptModalOpen(false);
    setEditingAiPrompt(null);
  }

  function handleAiPromptTextChange(
    field: AiPromptTextField,
    value: string,
  ) {
    setAiPromptForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  }

  function handleAiPromptActiveChange(
    active: boolean,
  ) {
    setAiPromptForm((previousForm) => ({
      ...previousForm,
      ativo: active,
    }));
  }

  async function handleSaveAiPrompt() {
    try {
      if (!aiPromptForm.nome.trim()) {
        toast.error("Informe o nome do prompt.");
        return;
      }

      if (!aiPromptForm.conteudo.trim()) {
        toast.error(
          "Informe o conteúdo do prompt.",
        );
        return;
      }

      setSavingAiPrompt(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const payload = {
        nome: aiPromptForm.nome,
        conteudo: aiPromptForm.conteudo,
        dispositivo_id:
          aiPromptForm.dispositivo_id
            ? Number(
                aiPromptForm.dispositivo_id,
              )
            : null,
        ativo: aiPromptForm.ativo,
      };

      if (editingAiPrompt) {
        await axios.patch(
          `http://localhost:3333/admin/ai/prompts/${editingAiPrompt.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success(
          "Prompt atualizado com sucesso.",
        );
      } else {
        await axios.post(
          "http://localhost:3333/admin/ai/prompts",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success(
          "Prompt criado com sucesso.",
        );
      }

      setPromptModalOpen(false);
      setEditingAiPrompt(null);

      await refreshDashboard();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar prompt.");
    } finally {
      setSavingAiPrompt(false);
    }
  }

  return {
    selectedAiDevice,
    deviceDocuments,
    loadingDocuments,
    uploadingDocument,
    processingDocumentId,
    promptModalOpen,
    editingAiPrompt,
    aiPromptForm,
    savingAiPrompt,
    openAiDocumentsModal,
    closeAiDocumentsModal,
    handleUploadAiDocument,
    handleProcessAiDocument,
    handleDeleteAiDocument,
    openAiPromptModal,
    closeAiPromptModal,
    handleAiPromptTextChange,
    handleAiPromptActiveChange,
    handleSaveAiPrompt,
  };
}