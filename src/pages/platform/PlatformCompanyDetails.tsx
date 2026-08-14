import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Cpu,
  Palette,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  platformApi,
} from "../../services/platformApi";

import PlatformIconBox from "../../components/platform/PlatformIconBox";
import PlatformEditCompanyModal from "./components/PlatformEditCompanyModal";
import PlatformCompanyBranding from "./components/PlatformCompanyBranding";

import StatCard from "../admin/dashboard/components/StatCard";
import StatsGrid from "../admin/dashboard/components/StatsGrid";
import TableCard from "../admin/dashboard/components/TableCard";

interface PlatformCompanyDetailsData {
  id: number;

  razaoSocial: string;
  nomeFantasia: string;

  cnpj: string | null;

  status:
    | "ativa"
    | "inativa";

  configuracao: {
    nomeAmbiente:
      | string
      | null;

    logoUrl:
      | string
      | null;

    logoDarkUrl:
      | string
      | null;

    faviconUrl:
      | string
      | null;

    cores: {
      primaria:
        | string
        | null;

      secundaria:
        | string
        | null;

      acento:
        | string
        | null;
    };
  };

  usuarios: {
    total: number;
    admins: number;
    students: number;
    clients: number;
  };

  cursos: {
    total: number;
  };

  dispositivos: {
    total: number;
  };

  certificados: {
    total: number;
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

function formatDate(
  value: string
) {
  if (!value) {
    return "-";
  }

  return new Date(
    value
  ).toLocaleDateString(
    "pt-BR"
  );
}

export default function PlatformCompanyDetails() {
  const {
    companyId,
  } =
    useParams();

  const navigate =
    useNavigate();

    const [
  editCompanyModalOpen,
  setEditCompanyModalOpen,
] = useState(false);


  const [
    company,
    setCompany,
  ] =
    useState<PlatformCompanyDetailsData | null>(
      null
    );

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

  const loadCompany =
    useCallback(
      async () => {
        if (!companyId) {
          setError(
            "Empresa inválida."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError(null);

          const response =
            await platformApi.get(
              `/platform/companies/${companyId}`
            );

          setCompany(
            response.data
              .company ?? null
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
                "Não foi possível carregar a empresa."
            );

            return;
          }

          setError(
            "Não foi possível carregar a empresa."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        companyId,
      ]
    );

  useEffect(() => {
    void loadCompany();
  }, [
    loadCompany,
  ]);

  if (loading) {
    return (
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
        Carregando empresa...
      </div>
    );
  }

  if (
    error ||
    !company
  ) {
    return (
      <div
        className="
          w-full
          space-y-5
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate(
              "/platform/companies"
            )
          }
          className="
            inline-flex
            items-center
            gap-2

            text-sm
            font-bold

            text-gray-600
            dark:text-gray-300

            hover:text-blue-600
            dark:hover:text-blue-400

            transition-colors
          "
        >
          <ArrowLeft
            size={18}
          />

          Voltar para empresas
        </button>

        <div
          className="
            rounded-2xl

            border
            border-red-200
            dark:border-red-500/20

            bg-red-50
            dark:bg-red-500/10

            p-5

            text-red-700
            dark:text-red-300

            shadow-xl
          "
        >
          {error ||
            "Empresa não encontrada."}
        </div>
      </div>
    );
  }

  const {
    configuracao,
  } =
    company;

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* VOLTAR */}
      <button
        type="button"
        onClick={() =>
          navigate(
            "/platform/companies"
          )
        }
        className="
          inline-flex
          items-center
          gap-2

          text-sm
          font-bold

          text-gray-600
          dark:text-gray-300

          hover:text-blue-600
          dark:hover:text-blue-400

          transition-colors
        "
      >
        <ArrowLeft
          size={18}
        />

        Voltar para empresas
      </button>

      {/* HEADER */}
      <header
        className="
          w-full
          min-w-0

          flex
          flex-col

          lg:flex-row
          lg:items-center
          lg:justify-between

          gap-5
        "
      >
        
        <div
          className="
            min-w-0

            flex
            items-center
            gap-4
          "
        >
          <PlatformIconBox
            icon={Building2}
            size="lg"
            variant="gradient"
          />

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center

                gap-3
              "
            >
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                  break-words
                "
              >
                {
                  company.nomeFantasia
                }
              </h1>

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

                    <p
                    className="
                        mt-2

                        text-sm
                        sm:text-base

                        text-gray-500
                        dark:text-gray-400
                    "
                    >
                    {
                        company.razaoSocial
                    }
                    </p>
                </div>
                </div>

                <button
                type="button"
                onClick={() =>
                    setEditCompanyModalOpen(
                    true
                    )
                }
                className="
                    w-full
                    lg:w-auto

                    px-5
                    py-3.5

                    rounded-2xl

                    bg-gradient-to-r
                    from-blue-500
                    to-purple-600

                    hover:from-blue-600
                    hover:to-purple-700

                    text-white

                    text-sm
                    font-bold

                    flex
                    items-center
                    justify-center
                    gap-2

                    shrink-0

                    shadow-xl

                    transition-all
                "
                >
                <Pencil
                    size={19}
                    className="shrink-0"
                />

                Editar Empresa
                </button>
      </header>

      {/* INDICADORES */}
      <StatsGrid>
        <StatCard
          title="Usuários"
          value={
            company
              .usuarios
              .total
          }
          subtitle={`${company.usuarios.admins} administradores`}
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Administradores"
          value={
            company
              .usuarios
              .admins
          }
          subtitle="Ativos"
          icon={
            ShieldCheck
          }
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Alunos"
          value={
            company
              .usuarios
              .students
          }
          subtitle="Perfil estudante"
          icon={Users}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Cursos"
          value={
            company
              .cursos
              .total
          }
          subtitle="Cadastrados"
          icon={BookOpen}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Dispositivos"
          value={
            company
              .dispositivos
              .total
          }
          subtitle="Cadastrados"
          icon={Cpu}
          color="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title="Certificados"
          value={
            company
              .certificados
              .total
          }
          subtitle="Emitidos"
          icon={Award}
          color="bg-red-500/15 text-red-600 dark:text-red-400"
        />
      </StatsGrid>

      {/* DETALHES */}
      <div
        className="
          grid
          grid-cols-1

          xl:grid-cols-2

          gap-5
          sm:gap-6
        "
      >
        {/* DADOS */}
        <TableCard title="Dados da Empresa">
          <div
            className="
              space-y-4
            "
          >
            <InfoRow
              label="Razão social"
              value={
                company.razaoSocial
              }
            />

            <InfoRow
              label="Nome fantasia"
              value={
                company.nomeFantasia
              }
            />

            <InfoRow
              label="CNPJ"
              value={formatCnpj(
                company.cnpj
              )}
            />

            <InfoRow
              label="Status"
              value={
                company.status ===
                "ativa"
                  ? "Ativa"
                  : "Inativa"
              }
            />

            <InfoRow
              label="Criada em"
              value={formatDate(
                company.criadoEm
              )}
            />

            <InfoRow
              label="Última atualização"
              value={formatDate(
                company.atualizadoEm
              )}
            />
          </div>
        </TableCard>

        {/* IDENTIDADE */}
        <TableCard title="Identidade da Empresa">
          <div
            className="
              space-y-5
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <PlatformIconBox
                icon={Palette}
                size="sm"
                variant="soft"
              />

              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    sm:text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Nome do ambiente
                </p>

                <strong
                  className="
                    block

                    mt-1

                    text-sm
                    sm:text-base

                    text-[#080E2F]
                    dark:text-white

                    break-words
                  "
                >
                  {configuracao.nomeAmbiente ||
                    "Não informado"}
                </strong>
              </div>
            </div>

            <div>
              <p
                className="
                  mb-3

                  text-sm
                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Cores configuradas
              </p>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3

                  gap-3
                "
              >
                <ColorPreview
                  label="Primária"
                  value={
                    configuracao
                      .cores
                      .primaria
                  }
                />

                <ColorPreview
                  label="Secundária"
                  value={
                    configuracao
                      .cores
                      .secundaria
                  }
                />

                <ColorPreview
                  label="Acento"
                  value={
                    configuracao
                      .cores
                      .acento
                  }
                />
              </div>
            </div>

            <div
              className="
                pt-4

                border-t
                border-gray-200
                dark:border-white/10

                space-y-3
              "
            >
              <InfoRow
                label="Logo"
                value={
                  configuracao.logoUrl
                    ? "Configurada"
                    : "Não configurada"
                }
              />

              <InfoRow
                label="Logo dark"
                value={
                  configuracao.logoDarkUrl
                    ? "Configurada"
                    : "Não configurada"
                }
              />

              <InfoRow
                label="Favicon"
                value={
                  configuracao.faviconUrl
                    ? "Configurado"
                    : "Não configurado"
                }
              />
            </div>
          </div>
        </TableCard>
      </div>

      <PlatformCompanyBranding
        companyId={
          company.id
        }
        logoUrl={
          configuracao.logoUrl
        }
        logoDarkUrl={
          configuracao.logoDarkUrl
        }
        faviconUrl={
          configuracao.faviconUrl
        }
        onUpdated={() =>
          void loadCompany()
        }
      /> 
      
       
      <PlatformEditCompanyModal
        open={
          editCompanyModalOpen
        }
        company={
          company
        }
        onClose={() =>
          setEditCompanyModalOpen(
            false
          )
        }
        onUpdated={() =>
          void loadCompany()
        }
      />
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        flex-col

        sm:flex-row
        sm:items-center
        sm:justify-between

        gap-1
        sm:gap-5
      "
    >
      <span
        className="
          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </span>

      <strong
        className="
          text-sm

          text-[#080E2F]
          dark:text-white

          break-words

          sm:text-right
        "
      >
        {value}
      </strong>
    </div>
  );
}

function ColorPreview({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-white/[0.03]

        p-3
      "
    >
      <div
        className="
          h-14
          w-full

          rounded-xl

          border
          border-black/5

          shadow-lg
        "
        style={{
          backgroundColor:
            value ||
            "#E5E7EB",
        }}
      />

      <div
        className="
          mt-3

          flex
          items-center
          justify-between

          gap-2
        "
      >
        <span
          className="
            text-xs

            text-gray-500
            dark:text-gray-400
          "
        >
          {label}
        </span>

        <strong
          className="
            text-xs

            text-[#080E2F]
            dark:text-white
          "
        >
          {value ||
            "—"}
        </strong>
      </div>
    </div>
  );
}