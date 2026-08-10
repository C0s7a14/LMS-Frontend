import axios from "axios";

import type {
  ActiveUsersTodayResponse,
} from "../types/userActivity.types";

const API_URL =
  "http://localhost:3333";

/* =========================================================
   REGISTRAR ATIVIDADE
========================================================= */

export async function registerUserActivity() {
  const token =
    localStorage.getItem("token");

  /*
    Não lançamos erro se não houver token.
    Esse serviço é apenas de monitoramento
    e não deve quebrar a experiência do usuário.
  */
  if (!token) {
    return;
  }

  await axios.post(
    `${API_URL}/activity/ping`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}


/* =========================================================
   USUÁRIOS ATIVOS HOJE - ADMIN
========================================================= */

export async function getActiveUsersToday() {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Sessão expirada. Faça login novamente.",
    );
  }

  const response =
    await axios.get<ActiveUsersTodayResponse>(
      `${API_URL}/admin/users/active-today`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  return response.data;
}