import {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Award,
  BookOpen,
  Building2,
  Cpu,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  platformApi,
} from "../../services/platformApi";

import PlatformDashboardHeader from "./components/PlatformDashboardHeader";

import PlatformQuickSummary from "../../components/platform/PlatformQuickSummary";

import StatCard from "../admin/dashboard/components/StatCard";
import StatsGrid from "../admin/dashboard/components/StatsGrid";
import TableCard from "../admin/dashboard/components/TableCard";

interface PlatformDashboardData {
  empresas: {
    total: number;
    ativas: number;
    inativas: number;
  };

  usuarios: {
    total: number;
    ativos: number;
    admins: number;
    students: number;
    clients: number;
  };

  cursos: {
    total: number;
    publicados: number;
  };

  dispositivos: {
    total: number;
  };

  certificados: {
    total: number;
  };
}

interface PlatformCompany {
  id: number;

  razaoSocial: string;
  nomeFantasia: string;

  cnpj: string | null;

  status:
    | "ativa"
    | "inativa";

  nomeAmbiente:
    | string
    | null;

  indicadores: {
    usuarios: number;
    admins: number;
    cursos: number;
    dispositivos: number;
    certificados: number;
  };

  criadoEm: string;
  atualizadoEm: string;
}

export default function PlatformDashboard() {
  const [
    dashboard,
    setDashboard,
  ] =
    useState<PlatformDashboardData | null>(
      null
    );

  const [
    companies,
    setCompanies,
  ] =
    useState<PlatformCompany[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const loadDashboard =
    useCallback(
      async (
        isRefresh = false
      ) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const [
            dashboardResponse,
            companiesResponse,
          ] =
            await Promise.all([
              platformApi.get(
                "/platform/dashboard"
              ),

              platformApi.get(
                "/platform/companies"
              ),
            ]);

          setDashboard(
            dashboardResponse.data
          );

          setCompanies(
            companiesResponse.data
              .companies ?? []
          );
        } catch (error) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            setError(
              error.response?.data
                ?.error ||
                error.response?.data
                  ?.message ||
                "Não foi possível carregar os dados da plataforma."
            );

            return;
          }

          setError(
            "Não foi possível carregar os dados da plataforma."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadDashboard();
  }, [
    loadDashboard,
  ]);

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <PlatformDashboardHeader
        title="Visão Geral Administrativa"
        subtitle="Acompanhe os principais indicadores de todas as empresas cadastradas na plataforma."
        actionLabel="Atualizar"
        actionType="refresh"
        actionLoading={
          refreshing
        }
        onMainAction={() =>
          void loadDashboard(
            true
          )
        }
      />

      {/* ERRO */}
      {error && (
        <div
          className="
            w-full

            rounded-2xl

            border
            border-red-200
            dark:border-red-500/20

            bg-red-50
            dark:bg-red-500/10

            px-4
            py-3

            text-sm
            sm:text-base

            text-red-700
            dark:text-red-300

            shadow-xl
            dark:shadow-sm
          "
        >
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div
          className="
            w-full

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-8
            sm:p-10

            text-center

            text-gray-500
            dark:text-gray-400

            shadow-2xl
            dark:shadow-sm

            animate-pulse
          "
        >
          Carregando dashboard...
        </div>
      ) : dashboard ? (
        <>
          {/* ================================================= */}
          {/* INDICADORES                                       */}
          {/* ================================================= */}

          <StatsGrid>
            <StatCard
              title="Empresas"
              value={
                dashboard
                  .empresas
                  .total
              }
              subtitle="Cadastradas"
              icon={
                Building2
              }
              color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
            />

            <StatCard
              title="Empresas Ativas"
              value={
                dashboard
                  .empresas
                  .ativas
              }
              subtitle={`${dashboard.empresas.inativas} inativas`}
              icon={
                ShieldCheck
              }
              color="bg-green-500/15 text-green-600 dark:text-green-400"
            />

            <StatCard
              title="Usuários"
              value={
                dashboard
                  .usuarios
                  .total
              }
              subtitle={`${dashboard.usuarios.ativos} ativos`}
              icon={
                Users
              }
              color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
            />

            <StatCard
              title="Cursos"
              value={
                dashboard
                  .cursos
                  .total
              }
              subtitle={`${dashboard.cursos.publicados} publicados`}
              icon={
                BookOpen
              }
              color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
            />

            <StatCard
              title="Dispositivos"
              value={
                dashboard
                  .dispositivos
                  .total
              }
              subtitle="Cadastrados"
              icon={
                Cpu
              }
              color="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
            />

            <StatCard
              title="Certificados"
              value={
                dashboard
                  .certificados
                  .total
              }
              subtitle="Emitidos"
              icon={
                Award
              }
              color="bg-red-500/15 text-red-600 dark:text-red-400"
            />
          </StatsGrid>

          {/* ================================================= */}
          {/* CONTEÚDO                                          */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-1

              2xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.9fr)]

              gap-5
              sm:gap-6

              min-w-0
            "
          >
            {/* =============================================== */}
            {/* EMPRESAS                                        */}
            {/* =============================================== */}

            <div className="min-w-0">
              <TableCard title="Empresas Cadastradas">
                {companies.length ===
                0 ? (
                  <div
                    className="
                      py-10

                      text-center

                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Nenhuma empresa
                    cadastrada.
                  </div>
                ) : (
                  <div
                    className="
                      w-full
                      min-w-[680px]

                      divide-y
                      divide-gray-200
                      dark:divide-white/10
                    "
                  >
                    {/* CABEÇALHO */}
                    <div
                      className="
                        grid
                        grid-cols-[minmax(210px,1.5fr)_110px_90px_90px_110px]

                        gap-4

                        px-2
                        pb-3

                        text-xs
                        font-bold
                        uppercase
                        tracking-wide

                        text-gray-400
                        dark:text-gray-500
                      "
                    >
                      <span>
                        Empresa
                      </span>

                      <span>
                        Status
                      </span>

                      <span className="text-center">
                        Usuários
                      </span>

                      <span className="text-center">
                        Cursos
                      </span>

                      <span className="text-center">
                        Dispositivos
                      </span>
                    </div>

                    {companies
                      .slice(
                        0,
                        6
                      )
                      .map(
                        (
                          company
                        ) => (
                          <div
                            key={
                              company.id
                            }
                            className="
                              grid
                              grid-cols-[minmax(210px,1.5fr)_110px_90px_90px_110px]

                              gap-4

                              items-center

                              px-2
                              py-4

                              transition-colors

                              hover:bg-gray-50
                              dark:hover:bg-white/[0.03]
                            "
                          >
                            {/* EMPRESA */}
                            <div
                              className="
                                min-w-0

                                flex
                                items-center
                                gap-3
                              "
                            >
                              <div
                                className="
                                  w-11
                                  h-11

                                  rounded-2xl

                                  bg-purple-500/15

                                  text-purple-600
                                  dark:text-purple-400

                                  flex
                                  items-center
                                  justify-center

                                  shrink-0
                                "
                              >
                                <Building2
                                  size={
                                    22
                                  }
                                />
                              </div>

                              <div className="min-w-0">
                                <h3
                                  className="
                                    font-bold

                                    text-sm
                                    sm:text-base

                                    text-[#080E2F]
                                    dark:text-white

                                    truncate
                                  "
                                  title={
                                    company.nomeFantasia
                                  }
                                >
                                  {
                                    company.nomeFantasia
                                  }
                                </h3>

                                <p
                                  className="
                                    mt-1

                                    text-xs
                                    sm:text-sm

                                    text-gray-500
                                    dark:text-gray-400

                                    truncate
                                  "
                                  title={
                                    company.razaoSocial
                                  }
                                >
                                  {
                                    company.razaoSocial
                                  }
                                </p>
                              </div>
                            </div>

                            {/* STATUS */}
                            <div>
                              <span
                                className={`
                                  inline-flex

                                  rounded-full

                                  px-3
                                  py-1.5

                                  text-xs
                                  font-bold

                                  ${
                                    company.status ===
                                    "ativa"
                                      ? `
                                          bg-green-500/15
                                          text-green-700
                                          dark:text-green-400
                                        `
                                      : `
                                          bg-gray-200
                                          dark:bg-white/10

                                          text-gray-600
                                          dark:text-gray-400
                                        `
                                  }
                                `}
                              >
                                {company.status ===
                                "ativa"
                                  ? "Ativa"
                                  : "Inativa"}
                              </span>
                            </div>

                            {/* USUÁRIOS */}
                            <strong
                              className="
                                text-center

                                text-sm
                                sm:text-base

                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {
                                company
                                  .indicadores
                                  .usuarios
                              }
                            </strong>

                            {/* CURSOS */}
                            <strong
                              className="
                                text-center

                                text-sm
                                sm:text-base

                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {
                                company
                                  .indicadores
                                  .cursos
                              }
                            </strong>

                            {/* DISPOSITIVOS */}
                            <strong
                              className="
                                text-center

                                text-sm
                                sm:text-base

                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {
                                company
                                  .indicadores
                                  .dispositivos
                              }
                            </strong>
                          </div>
                        )
                      )}
                  </div>
                )}
              </TableCard>
            </div>

            {/* =============================================== */}
            {/* COLUNA LATERAL                                  */}
            {/* =============================================== */}

            <div
              className="
                min-w-0

                space-y-5
                sm:space-y-6

                rounded-3xl
              "
            >
              {/* USUÁRIOS */}
              <TableCard title="Usuários da Plataforma">
                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2

                    gap-4
                  "
                >
                  <PlatformQuickSummary
                    icon={
                      Users
                    }
                    title="Usuários Ativos"
                    value={
                      dashboard
                        .usuarios
                        .ativos
                    }
                  />

                  <PlatformQuickSummary
                    icon={
                      ShieldCheck
                    }
                    title="Administradores"
                    value={
                      dashboard
                        .usuarios
                        .admins
                    }
                  />

                  <PlatformQuickSummary
                    icon={
                      BookOpen
                    }
                    title="Alunos"
                    value={
                      dashboard
                        .usuarios
                        .students
                    }
                  />

                  <PlatformQuickSummary
                    icon={
                      Building2
                    }
                    title="Clientes"
                    value={
                      dashboard
                        .usuarios
                        .clients
                    }
                  />
                </div>
              </TableCard>

              {/* SITUAÇÃO DAS EMPRESAS */}
              <TableCard title="Situação das Empresas">
                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2

                    gap-4
                  "
                >
                  <PlatformQuickSummary
                    icon={
                      ShieldCheck
                    }
                    title="Ativas"
                    value={
                      dashboard
                        .empresas
                        .ativas
                    }
                  />

                  <PlatformQuickSummary
                    icon={
                      Building2
                    }
                    title="Inativas"
                    value={
                      dashboard
                        .empresas
                        .inativas
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void loadDashboard(
                      true
                    )
                  }
                  disabled={
                    refreshing
                  }
                  className="
                    w-full

                    mt-4

                    border
                    border-gray-300
                    dark:border-white/10

                    bg-white
                    hover:bg-gray-50

                    dark:bg-[#091a2c]
                    dark:hover:bg-white/5

                    rounded-2xl

                    px-4
                    py-4

                    flex
                    items-center
                    justify-center
                    gap-3

                    text-sm
                    sm:text-base

                    font-bold

                    text-[#080E2F]
                    dark:text-white

                    shadow-2xl
                    dark:shadow-sm

                    transition-all

                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  <RefreshCw
                    size={20}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {refreshing
                    ? "Atualizando..."
                    : "Atualizar indicadores"}
                </button>
              </TableCard>
            </div>
          </div>
        </>
      ) : (
        <div
          className="
            w-full

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-8

            text-center

            text-gray-500
            dark:text-gray-400

            shadow-2xl
            dark:shadow-sm
          "
        >
          Nenhum dado disponível.
        </div>
      )}
    </div>
  );
}