import {
  useCallback,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  createFreelancerInvite,
  deleteFreelancerInvite,
  getFreelancerInviteSummary,
  getFreelancerInviteOptions,
  getFreelancerInvites,
  sendFreelancerInvite,
  updateFreelancerInvite,
} from "../services/freelancerInviteService";


import type {
  CreateFreelancerInvitePayload,
  FreelancerInviteFilters,
  FreelancerInviteSummaryType,
  FreelancerInviteTypeData,
  UpdateFreelancerInvitePayload,
  FreelancerInviteOptionsType,
} from "../types/freelancerInvite.types";


export default function useFreelancerInvites() {
  const [invites, setInvites] =
    useState<FreelancerInviteTypeData[]>([]);

  const [summary, setSummary] =
    useState<FreelancerInviteSummaryType | null>(
      null,
    );

    const [options, setOptions] =
  useState<FreelancerInviteOptionsType>({
    professionals: [],
    devices: [],
    courses: [],
  });

  const [loading, setLoading] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [updatingInviteId, setUpdatingInviteId] =
    useState<number | null>(null);

  const [deletingInviteId, setDeletingInviteId] =
    useState<number | null>(null);

    const [sendingInviteId, setSendingInviteId] =
  useState<number | null>(null);


  /* =========================================================
     CARREGAR CONVITES + PIPELINE
  ========================================================= */

  const loadFreelancerInvites =
    useCallback(
      async (
        filters: FreelancerInviteFilters = {},
      ) => {
        try {
          setLoading(true);

          const [
        invitesData,
        summaryData,
        optionsData,
      ] = await Promise.all([
        getFreelancerInvites(filters),
        getFreelancerInviteSummary(),
        getFreelancerInviteOptions(),
      ]);

      setInvites(invitesData);
      setSummary(summaryData);
      setOptions(optionsData);
        } catch (error: any) {
          console.log(error);

          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Erro ao carregar convites.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );


  /* =========================================================
     CRIAR RASCUNHO
  ========================================================= */

  async function handleCreateFreelancerInvite(
    data: CreateFreelancerInvitePayload,
  ) {
    try {
      setCreating(true);

      const createdInvite =
        await createFreelancerInvite(data);

      toast.success(
        "Rascunho criado com sucesso.",
      );

      await loadFreelancerInvites();

      return createdInvite;
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao criar convite.",
      );

      return null;
    } finally {
      setCreating(false);
    }
  }


  /* =========================================================
     EDITAR RASCUNHO
  ========================================================= */

  async function handleUpdateFreelancerInvite(
    inviteId: number,
    data: UpdateFreelancerInvitePayload,
  ) {
    try {
      setUpdatingInviteId(inviteId);

      const updatedInvite =
        await updateFreelancerInvite(
          inviteId,
          data,
        );

      toast.success(
        "Rascunho atualizado com sucesso.",
      );

      await loadFreelancerInvites();

      return updatedInvite;
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao atualizar convite.",
      );

      return null;
    } finally {
      setUpdatingInviteId(null);
    }
  }


  /* =========================================================
     EXCLUIR RASCUNHO
  ========================================================= */

  async function handleDeleteFreelancerInvite(
    inviteId: number,
  ) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este rascunho?",
    );

    if (!confirmed) {
      return false;
    }

    try {
      setDeletingInviteId(inviteId);

      await deleteFreelancerInvite(
        inviteId,
      );

      toast.success(
        "Rascunho excluído com sucesso.",
      );

      await loadFreelancerInvites();

      return true;
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao excluir convite.",
      );

      return false;
    } finally {
      setDeletingInviteId(null);
    }
  }

  /* =========================================================
   ENVIAR CONVITE
========================================================= */

async function handleSendFreelancerInvite(
  inviteId: number,
) {
  const confirmed = window.confirm(
    "Deseja enviar este convite para o profissional?",
  );

  if (!confirmed) {
    return false;
  }

  try {
    setSendingInviteId(inviteId);

    await sendFreelancerInvite(
      inviteId,
    );

    toast.success(
      "Convite enviado com sucesso.",
    );

    await loadFreelancerInvites();

    return true;
  } catch (error: any) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Erro ao enviar convite.",
    );

    return false;
  } finally {
    setSendingInviteId(null);
  }
}


return {
  invites,
  summary,
  options,

  loading,
  creating,

  updatingInviteId,
  deletingInviteId,
  sendingInviteId,

  loadFreelancerInvites,

  handleCreateFreelancerInvite,
  handleUpdateFreelancerInvite,
  handleDeleteFreelancerInvite,
  handleSendFreelancerInvite,
};
}