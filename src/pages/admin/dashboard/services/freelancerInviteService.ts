import axios from "axios";

import type {
  CreateFreelancerInvitePayload,
  FreelancerInviteOptionsType,
  FreelancerInviteFilters,
  FreelancerInviteSummaryType,
  FreelancerInviteTypeData,
  UpdateFreelancerInvitePayload,
} from "../types/freelancerInvite.types";

const API_URL = "http://localhost:3333";


function getAuthConfig() {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Sessão expirada. Faça login novamente.",
    );
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}


/* =========================================================
   LISTAR CONVITES
========================================================= */

export async function getFreelancerInvites(
  filters: FreelancerInviteFilters = {},
) {
  const config = getAuthConfig();

  const response = await axios.get<
    FreelancerInviteTypeData[]
  >(
    `${API_URL}/admin/freelancer-invites`,
    {
      ...config,

      params: {
        status:
          filters.status,

        tipoConvite:
          filters.tipoConvite,

        dispositivoId:
          filters.dispositivoId,

        cursoCertificacaoId:
          filters.cursoCertificacaoId,
      },
    },
  );

  return response.data;
}


/* =========================================================
   RESUMO / PIPELINE
========================================================= */

export async function getFreelancerInviteSummary() {
  const config = getAuthConfig();

  const response = await axios.get<
    FreelancerInviteSummaryType
  >(
    `${API_URL}/admin/freelancer-invites/summary`,
    config,
  );

  return response.data;
}

/* =========================================================
   OPÇÕES DO FORMULÁRIO
========================================================= */

export async function getFreelancerInviteOptions() {
  const config = getAuthConfig();

  const response =
    await axios.get<FreelancerInviteOptionsType>(
      `${API_URL}/admin/freelancer-invites/options`,
      config,
    );

  return response.data;
}


/* =========================================================
   BUSCAR CONVITE
========================================================= */

export async function getFreelancerInviteById(
  inviteId: number,
) {
  const config = getAuthConfig();

  const response = await axios.get<
    FreelancerInviteTypeData
  >(
    `${API_URL}/admin/freelancer-invites/${inviteId}`,
    config,
  );

  return response.data;
}


/* =========================================================
   CRIAR RASCUNHO
========================================================= */

export async function createFreelancerInvite(
  data: CreateFreelancerInvitePayload,
) {
  const config = getAuthConfig();

  const response = await axios.post<
    FreelancerInviteTypeData
  >(
    `${API_URL}/admin/freelancer-invites`,
    data,
    config,
  );

  return response.data;
}


/* =========================================================
   EDITAR RASCUNHO
========================================================= */

export async function updateFreelancerInvite(
  inviteId: number,
  data: UpdateFreelancerInvitePayload,
) {
  const config = getAuthConfig();

  const response = await axios.patch<
    FreelancerInviteTypeData
  >(
    `${API_URL}/admin/freelancer-invites/${inviteId}`,
    data,
    config,
  );

  return response.data;
}


/* =========================================================
   EXCLUIR RASCUNHO
========================================================= */

export async function deleteFreelancerInvite(
  inviteId: number,
) {
  const config = getAuthConfig();

  const response = await axios.delete<{
    message: string;
  }>(
    `${API_URL}/admin/freelancer-invites/${inviteId}`,
    config,
  );

  return response.data;
}

/* =========================================================
   ENVIAR CONVITE
========================================================= */

export async function sendFreelancerInvite(
  inviteId: number,
) {
  const config = getAuthConfig();

  const response = await axios.post<{
    message: string;
    invite: FreelancerInviteTypeData;
  }>(
    `${API_URL}/admin/freelancer-invites/${inviteId}/send`,
    {},
    config,
  );

  return response.data;
}