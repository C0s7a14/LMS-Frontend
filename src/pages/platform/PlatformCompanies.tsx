import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  Building2,
  BookOpen,
  Cpu,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  platformApi,
} from "../../services/platformApi";

import PlatformDashboardHeader from "./components/PlatformDashboardHeader";
import PlatformCreateCompanyModal from "./components/PlatformCreateCompanyModal";

import TableCard from "../admin/dashboard/components/TableCard";

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

function formatCnpj(
  value: string | null
) {
  if (!value) {
    return "Não informado";
  }

  const digits =
    value.replace(
      /\D/g,
      ""
    );

  if (
    digits.length !== 14
  ) {
    return value;
  }

  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

export default function PlatformCompanies() {

    const navigate = useNavigate();

  const [
    companies,
    setCompanies,
  ] =
    useState<PlatformCompany[]>(
      []
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

    const [
  createCompanyModalOpen,
  setCreateCompanyModalOpen,
] =
  useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const loadCompanies =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await platformApi.get(
              "/platform/companies"
            );

          setCompanies(
            response.data
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
                "Não foi possível carregar as empresas."
            );

            return;
          }

          setError(
            "Não foi possível carregar as empresas."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadCompanies();
  }, [
    loadCompanies,
  ]);

  const filteredCompanies =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        if (!term) {
          return companies;
        }

        const numericTerm =
          term.replace(
            /\D/g,
            ""
          );

        return companies.filter(
          (company) => {
            const nomeFantasia =
              company.nomeFantasia
                .toLowerCase();

            const razaoSocial =
              company.razaoSocial
                .toLowerCase();

            const ambiente =
              company.nomeAmbiente
                ?.toLowerCase() ??
              "";

            const cnpj =
              company.cnpj ??
              "";

            return (
              nomeFantasia.includes(
                term
              ) ||
              razaoSocial.includes(
                term
              ) ||
              ambiente.includes(
                term
              ) ||
              (
                numericTerm &&
                cnpj.includes(
                  numericTerm
                )
              )
            );
          }
        );
      },
      [
        companies,
        search,
      ]
    );

  const activeCompanies =
    companies.filter(
      (company) =>
        company.status ===
        "ativa"
    ).length;

  const inactiveCompanies =
    companies.length -
    activeCompanies;

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
     <PlatformDashboardHeader
    title="Gerenciar Empresas"
    subtitle="Consulte e administre as empresas cadastradas na plataforma."
    placeholder="Buscar por empresa, CNPJ ou ambiente..."
    search={search}
    actionLabel="Nova Empresa"
    onSearchChange={
        setSearch
    }
    onMainAction={() =>
        setCreateCompanyModalOpen(
        true
        )
    }
    />

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
          Carregando empresas...
        </div>
      ) : (
        <>
          {/* RESUMO */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3

              gap-4
              sm:gap-5
            "
          >
            <div
              className="
                min-w-0

                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-300
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-5

                flex
                items-center
                gap-4

                shadow-2xl
                dark:shadow-sm
              "
            >
              <div
                className="
                  w-12
                  h-12

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
                  size={24}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Total
                </p>

                <strong
                  className="
                    block

                    mt-1

                    text-2xl

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {
                    companies.length
                  }
                </strong>
              </div>
            </div>

            <div
              className="
                min-w-0

                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-300
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-5

                flex
                items-center
                gap-4

                shadow-2xl
                dark:shadow-sm
              "
            >
              <div
                className="
                  w-12
                  h-12

                  rounded-2xl

                  bg-green-500/15
                  text-green-600
                  dark:text-green-400

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <ShieldCheck
                  size={24}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Ativas
                </p>

                <strong
                  className="
                    block

                    mt-1

                    text-2xl

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {
                    activeCompanies
                  }
                </strong>
              </div>
            </div>

            <div
              className="
                min-w-0

                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-300
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-5

                flex
                items-center
                gap-4

                shadow-2xl
                dark:shadow-sm
              "
            >
              <div
                className="
                  w-12
                  h-12

                  rounded-2xl

                  bg-gray-500/15
                  text-gray-600
                  dark:text-gray-400

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <Building2
                  size={24}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Inativas
                </p>

                <strong
                  className="
                    block

                    mt-1

                    text-2xl

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {
                    inactiveCompanies
                  }
                </strong>
              </div>
            </div>
          </div>

          {/* LISTAGEM */}
          <TableCard
            title="Empresas"
          >
            {filteredCompanies.length ===
            0 ? (
              <div
                className="
                  py-12

                  text-center

                  text-sm
                  sm:text-base

                  text-gray-500
                  dark:text-gray-400
                "
              >
                {search.trim()
                  ? "Nenhuma empresa encontrada para esta busca."
                  : "Nenhuma empresa cadastrada."}
              </div>
            ) : (
              <div
                className="
                  w-full
                  min-w-[900px]

                  divide-y
                  divide-gray-200
                  dark:divide-white/10
                "
              >
                {/* CABEÇALHO */}
                <div
                  className="
                    grid
                    grid-cols-[minmax(240px,1.5fr)_150px_100px_100px_100px_110px]

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
                    CNPJ
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

                  <span>
                    Status
                  </span>
                </div>

                {filteredCompanies.map(
                  (
                    company
                  ) => (
                    <button
                type="button"
                key={
                    company.id
                }
                onClick={() =>
                    navigate(
                    `/platform/companies/${company.id}`
                    )
                }
                className="
                    w-full

                    grid
                    grid-cols-[minmax(240px,1.5fr)_150px_100px_100px_100px_110px]

                    gap-4

                    items-center

                    px-2
                    py-4

                    text-left

                    transition-all

                    hover:bg-gray-50
                    dark:hover:bg-white/[0.03]

                    cursor-pointer
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
                            size={22}
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
                              company.nomeAmbiente ??
                              company.razaoSocial
                            }
                          >
                            {company.nomeAmbiente ??
                              company.razaoSocial}
                          </p>
                        </div>
                      </div>

                      {/* CNPJ */}
                      <span
                        className="
                          text-sm

                          text-gray-600
                          dark:text-gray-300
                        "
                      >
                        {formatCnpj(
                          company.cnpj
                        )}
                      </span>

                      {/* USUÁRIOS */}
                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2

                          text-sm

                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        <Users
                          size={17}
                          className="
                            text-blue-500
                            shrink-0
                          "
                        />

                        <strong>
                          {
                            company
                              .indicadores
                              .usuarios
                          }
                        </strong>
                      </div>

                      {/* CURSOS */}
                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2

                          text-sm

                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        <BookOpen
                          size={17}
                          className="
                            text-orange-500
                            shrink-0
                          "
                        />

                        <strong>
                          {
                            company
                              .indicadores
                              .cursos
                          }
                        </strong>
                      </div>

                      {/* DISPOSITIVOS */}
                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2

                          text-sm

                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        <Cpu
                          size={17}
                          className="
                            text-indigo-500
                            shrink-0
                          "
                        />

                        <strong>
                          {
                            company
                              .indicadores
                              .dispositivos
                          }
                        </strong>
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
                    </button>
                  )
                )}
              </div>
            )}
          </TableCard>
        </>
      )}


      <PlatformCreateCompanyModal
  open={
    createCompanyModalOpen
  }
  onClose={() =>
    setCreateCompanyModalOpen(
      false
    )
  }
  onCreated={() =>
    void loadCompanies()
  }
/>

    </div>
  );
}