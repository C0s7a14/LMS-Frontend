import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import type { DeviceType } from "../types/adminDashboard.types";

interface UseAdminDevicesProps {
  refreshDashboard: () => Promise<void>;
}

interface EditDeviceForm {
  nome: string;
  modelo: string;
  tipo: string;
  descricao: string;
  imagem_url: string;
}

type EditDeviceField = keyof EditDeviceForm;

export default function useAdminDevices({
  refreshDashboard,
}: UseAdminDevicesProps) {
  const navigate = useNavigate();

  const [editingDevice, setEditingDevice] =
    useState<DeviceType | null>(null);

  const [deleteDeviceTarget, setDeleteDeviceTarget] =
    useState<DeviceType | null>(null);

  const [savingDeviceEdit, setSavingDeviceEdit] =
    useState(false);

  const [deletingDeviceId, setDeletingDeviceId] =
    useState<number | null>(null);

  const [editDeviceForm, setEditDeviceForm] =
    useState<EditDeviceForm>({
      nome: "",
      modelo: "",
      tipo: "",
      descricao: "",
      imagem_url: "",
    });

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

  function openEditDeviceModal(device: DeviceType) {
    setEditingDevice(device);

    setEditDeviceForm({
      nome: device.nome || "",
      modelo: device.modelo || "",
      tipo: device.tipo || "",
      descricao: device.descricao || "",
      imagem_url: device.imagem_url || "",
    });
  }

  function closeEditDeviceModal() {
    if (savingDeviceEdit) {
      return;
    }

    setEditingDevice(null);
  }

  function handleEditDeviceFormChange(
    field: EditDeviceField,
    value: string,
  ) {
    setEditDeviceForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  }

  function openDeleteDeviceModal(
    device: DeviceType,
  ) {
    setDeleteDeviceTarget(device);
  }

  function closeDeleteDeviceModal() {
    if (deletingDeviceId !== null) {
      return;
    }

    setDeleteDeviceTarget(null);
  }

  async function handleSaveDeviceEdit() {
    try {
      if (!editingDevice) {
        return;
      }

      if (!editDeviceForm.nome.trim()) {
        toast.error(
          "Informe o nome do dispositivo.",
        );
        return;
      }

      setSavingDeviceEdit(true);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      await axios.patch(
  `http://localhost:3333/devices/${editingDevice.id}`,
        {
          nome: editDeviceForm.nome,
          modelo: editDeviceForm.modelo,
          tipo: editDeviceForm.tipo,
          descricao: editDeviceForm.descricao,
          imagem_url: editDeviceForm.imagem_url,
        },
        config,
      );

      toast.success(
        "Dispositivo atualizado com sucesso.",
      );

      setEditingDevice(null);

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao atualizar dispositivo.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao atualizar dispositivo.",
      );
    } finally {
      setSavingDeviceEdit(false);
    }
  }

  async function confirmDeleteDevice() {
    try {
      if (!deleteDeviceTarget) {
        return;
      }

      setDeletingDeviceId(
        deleteDeviceTarget.id,
      );

      const config = getAuthConfig();

      if (!config) {
        return;
      }

     await axios.delete(
  `http://localhost:3333/devices/${deleteDeviceTarget.id}`,
  config,
      );

      toast.success(
        "Dispositivo excluído com sucesso.",
      );

      setDeleteDeviceTarget(null);

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao excluir dispositivo.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao excluir dispositivo.",
      );
    } finally {
      setDeletingDeviceId(null);
    }
  }

  return {
    editingDevice,
    deleteDeviceTarget,
    savingDeviceEdit,
    deletingDeviceId,
    editDeviceForm,
    openEditDeviceModal,
    closeEditDeviceModal,
    handleEditDeviceFormChange,
    openDeleteDeviceModal,
    closeDeleteDeviceModal,
    handleSaveDeviceEdit,
    confirmDeleteDevice,
  };
}