import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { platformApi } from "../services/platformApi";

interface PlatformUser {
  id: number;

  name?: string;
  email?: string;

  scope: "platform";

  platformAdmin?: boolean;
  platformAdminId?: number;
}

interface PlatformLoginData {
  email: string;
  senha: string;
}

interface PlatformAuthContextData {
  user: PlatformUser | null;

  isAuthenticated: boolean;
  loading: boolean;

  login: (
    data: PlatformLoginData
  ) => Promise<PlatformUser>;

  logout: () => Promise<void>;
}

interface PlatformAuthProviderProps {
  children: ReactNode;
}

const PlatformAuthContext =
  createContext<
    PlatformAuthContextData | undefined
  >(undefined);

export function PlatformAuthProvider({
  children,
}: PlatformAuthProviderProps) {
  const [user, setUser] =
    useState<PlatformUser | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  /**
   * Limpa apenas a sessão
   * do SuperAdmin.
   *
   * O token tenant permanece
   * completamente separado.
   */
  function clearPlatformSession() {
    localStorage.removeItem(
      "platformAccessToken"
    );

    localStorage.removeItem(
      "platformRefreshToken"
    );

    setUser(null);
  }

  /**
   * Ao abrir/recarregar a aplicação,
   * valida o token Platform existente.
   */
  useEffect(() => {
    async function loadPlatformSession() {
      const accessToken =
        localStorage.getItem(
          "platformAccessToken"
        );

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await platformApi.get(
            "/platform/auth/me"
          );

        setUser(
          response.data.user
        );
      } catch (error) {
        clearPlatformSession();
      } finally {
        setLoading(false);
      }
    }

    loadPlatformSession();
  }, []);

  /**
   * Login exclusivo do SuperAdmin.
   */
  async function login(
    data: PlatformLoginData
  ): Promise<PlatformUser> {
    const response =
      await platformApi.post(
        "/platform/auth/login",
        {
          email:
            data.email
              .trim()
              .toLowerCase(),

          senha:
            data.senha,
        }
      );

    const {
      accessToken,
      refreshToken,
      user: loggedUser,
    } = response.data;

    if (
      !accessToken ||
      !refreshToken ||
      !loggedUser
    ) {
      throw new Error(
        "Resposta de autenticação inválida."
      );
    }

    localStorage.setItem(
      "platformAccessToken",
      accessToken
    );

    localStorage.setItem(
      "platformRefreshToken",
      refreshToken
    );

    setUser(
      loggedUser
    );

    return loggedUser;
  }

  /**
   * Logout exclusivo
   * da sessão Platform.
   */
  async function logout() {
    const refreshToken =
      localStorage.getItem(
        "platformRefreshToken"
      );

    try {
      if (refreshToken) {
        await platformApi.post(
          "/platform/auth/logout",
          {
            refreshToken,
          }
        );
      }
    } catch (error) {
      /*
       * Mesmo se o backend não
       * conseguir invalidar o token,
       * a sessão local deve terminar.
       */
    } finally {
      clearPlatformSession();
    }
  }

  return (
    <PlatformAuthContext.Provider
      value={{
        user,

        isAuthenticated:
          Boolean(user),

        loading,

        login,
        logout,
      }}
    >
      {children}
    </PlatformAuthContext.Provider>
  );
}

export function usePlatformAuth() {
  const context =
    useContext(
      PlatformAuthContext
    );

  if (!context) {
    throw new Error(
      "usePlatformAuth deve ser usado dentro de PlatformAuthProvider."
    );
  }

  return context;
}