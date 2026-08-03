import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import type {
  DeviceType,
  UserType,
} from "../types/adminDashboard.types";

interface UseAdminUsersProps {
  refreshDashboard: () => Promise<void>;
}

export default function useAdminUsers({
  refreshDashboard,
}: UseAdminUsersProps) {
  const navigate = useNavigate();

  const [updatingUserRoleId, setUpdatingUserRoleId] =
    useState<number | null>(null);

  const [selectedClientUser, setSelectedClientUser] =
    useState<UserType | null>(null);

  const [clientDevices, setClientDevices] =
    useState<DeviceType[]>([]);

  const [
    selectedClientDeviceId,
    setSelectedClientDeviceId,
  ] = useState("");

  const [
    loadingClientDevices,
    setLoadingClientDevices,
  ] = useState(false);

  const [
    linkingClientDevice,
    setLinkingClientDevice,
  ] = useState(false);

  const [
    unlinkingClientDeviceId,
    setUnlinkingClientDeviceId,
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

  async function handleUpdateUserRole(
    userId: number,
    role: UserType["role"],
  ) {
    try {
      setUpdatingUserRoleId(userId);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      await axios.patch(
        `http://localhost:3333/admin/users/${userId}/role`,
        {
          role,
        },
        config,
      );

      toast.success(
        "Perfil do usuário atualizado com sucesso.",
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao atualizar perfil do usuário",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao atualizar perfil.",
      );
    } finally {
      setUpdatingUserRoleId(null);
    }
  }

  async function openClientDevicesModal(
    user: UserType,
  ) {
    try {
      setSelectedClientUser(user);
      setLoadingClientDevices(true);
      setSelectedClientDeviceId("");

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      const response = await axios.get<DeviceType[]>(
        `http://localhost:3333/admin/clients/${user.id}/devices`,
        config,
      );

      setClientDevices(response.data);
    } catch (error) {
      console.log(error);

      toast.error(
        "Erro ao carregar dispositivos do cliente.",
      );
    } finally {
      setLoadingClientDevices(false);
    }
  }

  async function handleLinkDeviceToClient() {
    try {
      if (!selectedClientUser) {
        return;
      }

      if (!selectedClientDeviceId) {
        toast.error("Selecione um dispositivo.");
        return;
      }

      setLinkingClientDevice(true);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      await axios.post(
        `http://localhost:3333/admin/clients/${selectedClientUser.id}/devices/${selectedClientDeviceId}`,
        {},
        config,
      );

      toast.success(
        "Dispositivo vinculado ao cliente.",
      );

      await openClientDevicesModal(
        selectedClientUser,
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      toast.error(
        "Erro ao vincular dispositivo ao cliente.",
      );
    } finally {
      setLinkingClientDevice(false);
    }
  }

  async function handleUnlinkDeviceFromClient(
    deviceId: number,
  ) {
    try {
      if (!selectedClientUser) {
        return;
      }

      setUnlinkingClientDeviceId(deviceId);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      await axios.delete(
        `http://localhost:3333/admin/clients/${selectedClientUser.id}/devices/${deviceId}`,
        config,
      );

      toast.success(
        "Dispositivo removido do cliente.",
      );

      await openClientDevicesModal(
        selectedClientUser,
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      toast.error(
        "Erro ao remover dispositivo do cliente.",
      );
    } finally {
      setUnlinkingClientDeviceId(null);
    }
  }

  function closeClientDevicesModal() {
    setSelectedClientUser(null);
    setClientDevices([]);
    setSelectedClientDeviceId("");
  }

  return {
    updatingUserRoleId,
    selectedClientUser,
    clientDevices,
    selectedClientDeviceId,
    loadingClientDevices,
    linkingClientDevice,
    unlinkingClientDeviceId,
    setSelectedClientDeviceId,
    handleUpdateUserRole,
    openClientDevicesModal,
    handleLinkDeviceToClient,
    handleUnlinkDeviceFromClient,
    closeClientDevicesModal,
  };
}