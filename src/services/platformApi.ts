import axios from "axios";

/**
 * API exclusiva do SuperAdmin.
 *
 * Não reutiliza o token tenant.
 */
export const platformApi = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:3333",
});

/**
 * Injeta somente o token
 * da sessão Platform.
 */
platformApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "platformAccessToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);