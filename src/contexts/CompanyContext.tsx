import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import { api } from "../services/api";

export interface CompanyConfiguration {
  nomeAmbiente: string | null;

  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;

  corPrimaria: string | null;
  corSecundaria: string | null;
  corAcento: string | null;
}

export interface Company {
  id: number;

  razaoSocial: string;
  nomeFantasia: string;

  cnpj: string | null;

  status: string;

  configuracao: CompanyConfiguration;
}

interface CompanyContextValue {
  company: Company | null;

  loading: boolean;

  error: string | null;

  refreshCompany: () => Promise<Company | null>;

  clearCompany: () => void;
}

const CompanyContext =
  createContext<CompanyContextValue | undefined>(
    undefined
  );

interface CompanyProviderProps {
  children: ReactNode;
}

const DEFAULT_COMPANY_COLORS = {
  primary: "#3b82f6",
  secondary: "#9333ea",
  accent: "#2563eb",
};

function getCompanyColor(
  value: string | null | undefined,
  fallback: string
) {
  const color =
    value?.trim();

  return color || fallback;
}


export function CompanyProvider({
  children,
}: CompanyProviderProps) {
  const location = useLocation();

  const [company, setCompany] =
    useState<Company | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const refreshCompany =
    useCallback(async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setCompany(null);
        setError(null);
        setLoading(false);

        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await api.get<Company>(
            "/company/me"
          );

        setCompany(response.data);

        return response.data;
      } catch (error: unknown) {
        console.error(
          "Erro ao carregar empresa:",
          error
        );

        let message =
          "Não foi possível carregar os dados da empresa.";

        if (
          axios.isAxiosError(error)
        ) {
          const responseData =
            error.response?.data as
              | {
                  error?: string;
                }
              | undefined;

          if (responseData?.error) {
            message =
              responseData.error;
          }
        }

        setCompany(null);
        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const clearCompany =
    useCallback(() => {
      setCompany(null);
      setError(null);
      setLoading(false);
    }, []);

  /*
   * Precisamos observar mudança de rota
   * porque atualmente não existe um
   * AuthContext notificando o CompanyContext
   * quando o login é realizado.
   *
   * Exemplo:
   *
   * /
   * ↓ login salva token
   * ↓
   * /home
   * ↓
   * pathname mudou
   * ↓
   * carrega empresa
   */
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      if (company) {
        setCompany(null);
      }

      setError(null);
      setLoading(false);

      return;
    }

    if (!company) {
      void refreshCompany();
    }
  },
  
  [
    location.pathname,
    company,
    refreshCompany,
  ]);

  useEffect(() => {
  const favicon =
    document.querySelector<HTMLLinkElement>(
      'link[rel~="icon"]'
    );

  if (!favicon) {
    return;
  }

  /*
   * Guarda o favicon original da plataforma
   * para restaurar quando não houver empresa
   * ou depois do logout.
   */
  if (!favicon.dataset.defaultHref) {
    favicon.dataset.defaultHref =
      favicon.href;
  }

  const defaultFavicon =
    favicon.dataset.defaultHref;

  const companyFavicon =
    company?.configuracao
      .faviconUrl;

  if (companyFavicon) {
    favicon.href =
      companyFavicon;
  } else if (defaultFavicon) {
    favicon.href =
      defaultFavicon;
  }
}, [company]);


useEffect(() => {
  const html =
    document.documentElement;

  if (!html.dataset.defaultTitle) {
    html.dataset.defaultTitle =
      document.title;
  }

  const defaultTitle =
    html.dataset.defaultTitle ||
    "Portal de Treinamentos";

  if (!company) {
    document.title =
      defaultTitle;

    return;
  }

  const environmentName =
    company.configuracao
      .nomeAmbiente;

  if (environmentName) {
    document.title =
      `${environmentName} | ${company.nomeFantasia}`;

    return;
  }

  document.title =
    company.nomeFantasia;
}, [company]);


 useEffect(() => {
    const root =
      document.documentElement;

    const primary =
      getCompanyColor(
        company?.configuracao
          .corPrimaria,
        DEFAULT_COMPANY_COLORS.primary
      );

    const secondary =
      getCompanyColor(
        company?.configuracao
          .corSecundaria,
        DEFAULT_COMPANY_COLORS.secondary
      );

    const accent =
      getCompanyColor(
        company?.configuracao
          .corAcento,
        DEFAULT_COMPANY_COLORS.accent
      );

    root.style.setProperty(
      "--company-primary",
      primary
    );

    root.style.setProperty(
      "--company-secondary",
      secondary
    );

    root.style.setProperty(
      "--company-accent",
      accent
    );
  }, [company]);

  return (
    <CompanyContext.Provider
      value={{
        company,
        loading,
        error,
        refreshCompany,
        clearCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context =
    useContext(CompanyContext);

  if (!context) {
    throw new Error(
      "useCompany deve ser utilizado dentro de CompanyProvider."
    );
  }

  return context;
}