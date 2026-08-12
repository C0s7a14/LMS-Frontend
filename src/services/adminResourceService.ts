import axios from "axios";

import type {
  AdminResourcesResponseType,
} from "../types/adminResource.types";


const API_URL =
  import.meta.env.VITE_API_URL;


/* =========================================================
   LISTAR TOKENS E RECURSOS
========================================================= */

export async function getAdminResources() {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Sessão expirada.",
    );
  }

  const response =
    await axios.get<AdminResourcesResponseType>(
      `${API_URL}/admin/resources`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  return response.data;
}