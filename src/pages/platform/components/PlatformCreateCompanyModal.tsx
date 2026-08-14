import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Palette,
  ShieldCheck,
  UserCog,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  platformApi,
} from "../../../services/platformApi";

import PlatformIconBox from "../../../components/platform/PlatformIconBox";

interface PlatformCreateCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CompanyForm {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;

  status:
    | "ativa"
    | "inativa";

  nomeAmbiente: string;

  corPrimaria: string;
  corSecundaria: string;
  corAcento: string;

  adminNome: string;
  adminEmail: string;
  adminSenha: string;
  adminConfirmarSenha: string;
}

const INITIAL_FORM:
  CompanyForm = {
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",

    status: "ativa",

    nomeAmbiente: "",

    corPrimaria: "#2563EB",
    corSecundaria: "#7C3AED",
    corAcento: "#06B6D4",

    adminNome: "",
    adminEmail: "",
    adminSenha: "",
    adminConfirmarSenha: "",
  };

const STEPS = [
  {
    id: 1,
    title: "Empresa",
    subtitle:
      "Dados cadastrais",
    icon: Building2,
  },
  {
    id: 2,
    title: "Identidade",
    subtitle:
      "Ambiente e cores",
    icon: Palette,
  },
  {
    id: 3,
    title: "Administrador",
    subtitle:
      "Acesso inicial",
    icon: UserCog,
  },
  {
    id: 4,
    title: "Revisão",
    subtitle:
      "Confirmar criação",
    icon: ShieldCheck,
  },
];

function formatCnpjInput(
  value: string
) {
  const digits =
    value
      .replace(
        /\D/g,
        ""
      )
      .slice(
        0,
        14
      );

  return digits
    .replace(
      /^(\d{2})(\d)/,
      "$1.$2"
    )
    .replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3"
    )
    .replace(
      /\.(\d{3})(\d)/,
      ".$1/$2"
    )
    .replace(
      /(\d{4})(\d)/,
      "$1-$2"
    );
}

function normalizeCnpj(
  value: string
) {
  return value.replace(
    /\D/g,
    ""
  );
}

export default function PlatformCreateCompanyModal({
  open,
  onClose,
  onCreated,
}: PlatformCreateCompanyModalProps) {
  const [
    step,
    setStep,
  ] =
    useState(1);

  const [
    form,
    setForm,
  ] =
    useState<CompanyForm>(
      INITIAL_FORM
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setStep(1);

    setForm(
      INITIAL_FORM
    );

    setSaving(false);

    setShowPassword(
      false
    );

    setShowConfirmPassword(
      false
    );
  }, [
    open,
  ]);

  const progress =
    useMemo(
      () =>
        `${(step / STEPS.length) * 100}%`,
      [
        step,
      ]
    );

  if (!open) {
    return null;
  }

  function updateField<
    K extends keyof CompanyForm
  >(
    field: K,
    value: CompanyForm[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function validateStep(
    targetStep: number
  ) {
    if (
      targetStep === 1
    ) {
      if (
        !form.razaoSocial.trim()
      ) {
        toast.error(
          "Informe a razão social."
        );

        return false;
      }

      if (
        !form.nomeFantasia.trim()
      ) {
        toast.error(
          "Informe o nome fantasia."
        );

        return false;
      }

      const cnpj =
        normalizeCnpj(
          form.cnpj
        );

      if (
        cnpj &&
        cnpj.length !== 14
      ) {
        toast.error(
          "O CNPJ deve possuir 14 dígitos."
        );

        return false;
      }
    }

    if (
      targetStep === 2
    ) {
      const colors = [
        form.corPrimaria,
        form.corSecundaria,
        form.corAcento,
      ];

      const invalid =
        colors.some(
          (color) =>
            !/^#[0-9A-Fa-f]{6}$/.test(
              color
            )
        );

      if (invalid) {
        toast.error(
          "As cores devem estar no formato #RRGGBB."
        );

        return false;
      }
    }

    if (
      targetStep === 3
    ) {
      if (
        !form.adminNome.trim()
      ) {
        toast.error(
          "Informe o nome do administrador."
        );

        return false;
      }

      if (
        !form.adminEmail.trim()
      ) {
        toast.error(
          "Informe o e-mail do administrador."
        );

        return false;
      }

      const emailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.adminEmail
            .trim()
        );

      if (!emailValid) {
        toast.error(
          "Informe um e-mail válido."
        );

        return false;
      }

      if (
        form.adminSenha.length <
        6
      ) {
        toast.error(
          "A senha deve possuir pelo menos 6 caracteres."
        );

        return false;
      }

      if (
        form.adminSenha !==
        form.adminConfirmarSenha
      ) {
        toast.error(
          "As senhas não coincidem."
        );

        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (
      !validateStep(
        step
      )
    ) {
      return;
    }

    setStep(
      (current) =>
        Math.min(
          current + 1,
          STEPS.length
        )
    );
  }

  function previousStep() {
    setStep(
      (current) =>
        Math.max(
          current - 1,
          1
        )
    );
  }

  async function handleCreate() {
    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !validateStep(3)
    ) {
      return;
    }

    try {
      setSaving(true);

      await platformApi.post(
        "/platform/companies",
        {
          razaoSocial:
            form.razaoSocial.trim(),

          nomeFantasia:
            form.nomeFantasia.trim(),

          cnpj:
            normalizeCnpj(
              form.cnpj
            ) || null,

          status:
            form.status,

          configuracao: {
            nomeAmbiente:
              form.nomeAmbiente
                .trim() ||
              null,

            corPrimaria:
              form.corPrimaria,

            corSecundaria:
              form.corSecundaria,

            corAcento:
              form.corAcento,
          },

          administradorInicial: {
            nome:
              form.adminNome.trim(),

            email:
              form.adminEmail
                .trim()
                .toLowerCase(),

            senha:
              form.adminSenha,
          },
        }
      );

      toast.success(
        "Empresa criada com sucesso."
      );

      onCreated();
      onClose();
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        toast.error(
          error.response?.data
            ?.error ||
            error.response?.data
              ?.message ||
            "Não foi possível criar a empresa."
        );

        return;
      }

      toast.error(
        "Não foi possível criar a empresa."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-end
        sm:items-center
        justify-center

        bg-slate-950/60
        backdrop-blur-sm

        p-0
        sm:p-4
      "
    >
      <div
        className="
          w-full
          sm:max-w-4xl

          max-h-[100dvh]
          sm:max-h-[92dvh]

          bg-white
          dark:bg-[#091a2c]

          rounded-t-3xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          shadow-2xl

          flex
          flex-col

          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            shrink-0

            px-4
            sm:px-6
            lg:px-8

            pt-5
            sm:pt-6

            pb-4

            border-b
            border-gray-200
            dark:border-white/10
          "
        >
          <div
            className="
              flex
              items-start
              justify-between

              gap-4
            "
          >
            <div
              className="
                min-w-0

                flex
                items-center
                gap-3
              "
            >
              <PlatformIconBox
                icon={Building2}
                size="md"
                variant="gradient"
              />

              <div className="min-w-0">
                <h2
                  className="
                    text-xl
                    sm:text-2xl

                    font-bold

                    text-[#080E2F]
                    dark:text-white

                    leading-tight
                  "
                >
                  Nova Empresa
                </h2>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Cadastre a empresa e seu administrador inicial.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="
                w-10
                h-10

                rounded-xl

                flex
                items-center
                justify-center

                shrink-0

                text-gray-500
                dark:text-gray-400

                hover:bg-gray-100
                dark:hover:bg-white/5

                transition-colors

                disabled:opacity-50
              "
            >
              <X size={22} />
            </button>
          </div>

          {/* PROGRESSO */}
          <div
            className="
              mt-5

              h-1.5

              rounded-full

              bg-gray-100
              dark:bg-white/10

              overflow-hidden
            "
          >
            <div
              className="
                h-full

                bg-gradient-to-r
                from-blue-500
                to-purple-600

                rounded-full

                transition-all
                duration-300
              "
              style={{
                width:
                  progress,
              }}
            />
          </div>

          {/* STEPS */}
          <div
            className="
              mt-4

              grid
              grid-cols-4

              gap-2
            "
          >
            {STEPS.map(
              (
                item
              ) => {
                const StepIcon =
                  item.icon;

                const completed =
                  step >
                  item.id;

                const active =
                  step ===
                  item.id;

                return (
                  <div
                    key={
                      item.id
                    }
                    className="
                      min-w-0

                      flex
                      items-center
                      gap-2
                    "
                  >
                    <div
                      className={`
                        w-8
                        h-8

                        rounded-xl

                        shrink-0

                        flex
                        items-center
                        justify-center

                        transition-colors

                        ${
                          active ||
                          completed
                            ? `
                                bg-gradient-to-br
                                from-blue-500
                                to-purple-600

                                text-white
                              `
                            : `
                                bg-gray-100
                                dark:bg-white/10

                                text-gray-400
                              `
                        }
                      `}
                    >
                      {completed ? (
                        <Check
                          size={16}
                        />
                      ) : (
                        <StepIcon
                          size={16}
                        />
                      )}
                    </div>

                    <div
                      className="
                        hidden
                        lg:block
                        min-w-0
                      "
                    >
                      <p
                        className={`
                          text-xs
                          font-bold

                          truncate

                          ${
                            active
                              ? `
                                  text-[#080E2F]
                                  dark:text-white
                                `
                              : `
                                  text-gray-500
                                  dark:text-gray-400
                                `
                          }
                        `}
                      >
                        {
                          item.title
                        }
                      </p>

                      <p
                        className="
                          text-[11px]

                          text-gray-400
                          dark:text-gray-500

                          truncate
                        "
                      >
                        {
                          item.subtitle
                        }
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* CONTEÚDO */}
        <div
          className="
            flex-1

            overflow-y-auto

            px-4
            sm:px-6
            lg:px-8

            py-5
            sm:py-6
          "
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2

                gap-4
                sm:gap-5
              "
            >
              <Field
                label="Razão social"
                required
              >
                <input
                  value={
                    form.razaoSocial
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "razaoSocial",
                      event.target
                        .value
                    )
                  }
                  placeholder="Empresa Exemplo LTDA"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Nome fantasia"
                required
              >
                <input
                  value={
                    form.nomeFantasia
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "nomeFantasia",
                      event.target
                        .value
                    )
                  }
                  placeholder="Empresa Exemplo"
                  className={inputClass}
                />
              </Field>

              <Field label="CNPJ">
                <input
                  value={
                    form.cnpj
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "cnpj",
                      formatCnpjInput(
                        event.target
                          .value
                      )
                    )
                  }
                  placeholder="00.000.000/0000-00"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Status inicial"
                required
              >
                <select
                  value={
                    form.status
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "status",
                      event.target
                        .value as
                        | "ativa"
                        | "inativa"
                    )
                  }
                  className={inputClass}
                >
                  <option value="ativa">
                    Ativa
                  </option>

                  <option value="inativa">
                    Inativa
                  </option>
                </select>
              </Field>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div
              className="
                space-y-5
              "
            >
              <Field label="Nome do ambiente">
                <input
                  value={
                    form.nomeAmbiente
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "nomeAmbiente",
                      event.target
                        .value
                    )
                  }
                  placeholder="Academia Empresa Exemplo"
                  className={inputClass}
                />
              </Field>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3

                  gap-4
                "
              >
                <ColorField
                  label="Cor primária"
                  value={
                    form.corPrimaria
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "corPrimaria",
                      value
                    )
                  }
                />

                <ColorField
                  label="Cor secundária"
                  value={
                    form.corSecundaria
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "corSecundaria",
                      value
                    )
                  }
                />

                <ColorField
                  label="Cor de acento"
                  value={
                    form.corAcento
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "corAcento",
                      value
                    )
                  }
                />
              </div>

              <div
                className="
                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/10

                  bg-gray-50
                  dark:bg-white/[0.03]

                  p-4
                  sm:p-5
                "
              >
                <p
                  className="
                    text-sm
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Prévia das cores
                </p>

                <div
                  className="
                    mt-4

                    flex
                    flex-wrap
                    items-center

                    gap-3
                  "
                >
                  <div
                    className="
                      h-12
                      flex-1
                      min-w-[120px]

                      rounded-2xl

                      shadow-lg
                    "
                    style={{
                      backgroundColor:
                        form.corPrimaria,
                    }}
                  />

                  <div
                    className="
                      h-12
                      flex-1
                      min-w-[120px]

                      rounded-2xl

                      shadow-lg
                    "
                    style={{
                      backgroundColor:
                        form.corSecundaria,
                    }}
                  />

                  <div
                    className="
                      h-12
                      flex-1
                      min-w-[120px]

                      rounded-2xl

                      shadow-lg
                    "
                    style={{
                      backgroundColor:
                        form.corAcento,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2

                gap-4
                sm:gap-5
              "
            >
              <Field
                label="Nome do administrador"
                required
              >
                <input
                  value={
                    form.adminNome
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "adminNome",
                      event.target
                        .value
                    )
                  }
                  placeholder="Nome completo"
                  className={inputClass}
                />
              </Field>

              <Field
                label="E-mail"
                required
              >
                <input
                  type="email"
                  value={
                    form.adminEmail
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "adminEmail",
                      event.target
                        .value
                    )
                  }
                  placeholder="admin@empresa.com"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Senha"
                required
              >
                <PasswordInput
                  value={
                    form.adminSenha
                  }
                  visible={
                    showPassword
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "adminSenha",
                      value
                    )
                  }
                  onToggle={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                />
              </Field>

              <Field
                label="Confirmar senha"
                required
              >
                <PasswordInput
                  value={
                    form.adminConfirmarSenha
                  }
                  visible={
                    showConfirmPassword
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "adminConfirmarSenha",
                      value
                    )
                  }
                  onToggle={() =>
                    setShowConfirmPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                />
              </Field>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2

                gap-5
              "
            >
              <ReviewCard
                title="Empresa"
                icon={Building2}
              >
                <ReviewRow
                  label="Razão social"
                  value={
                    form.razaoSocial
                  }
                />

                <ReviewRow
                  label="Nome fantasia"
                  value={
                    form.nomeFantasia
                  }
                />

                <ReviewRow
                  label="CNPJ"
                  value={
                    form.cnpj ||
                    "Não informado"
                  }
                />

                <ReviewRow
                  label="Status"
                  value={
                    form.status ===
                    "ativa"
                      ? "Ativa"
                      : "Inativa"
                  }
                />
              </ReviewCard>

              <ReviewCard
                title="Administrador inicial"
                icon={UserCog}
              >
                <ReviewRow
                  label="Nome"
                  value={
                    form.adminNome
                  }
                />

                <ReviewRow
                  label="E-mail"
                  value={
                    form.adminEmail
                  }
                />

                <ReviewRow
                  label="Perfil"
                  value="Administrador da empresa"
                />
              </ReviewCard>

              <ReviewCard
                title="Identidade"
                icon={Palette}
              >
                <ReviewRow
                  label="Ambiente"
                  value={
                    form.nomeAmbiente ||
                    "Não informado"
                  }
                />

                <div
                  className="
                    mt-4

                    flex
                    gap-2
                  "
                >
                  {[
                    form.corPrimaria,
                    form.corSecundaria,
                    form.corAcento,
                  ].map(
                    (
                      color
                    ) => (
                      <div
                        key={
                          color
                        }
                        className="
                          h-10
                          flex-1

                          rounded-xl

                          border
                          border-black/5

                          shadow-md
                        "
                        style={{
                          backgroundColor:
                            color,
                        }}
                        title={
                          color
                        }
                      />
                    )
                  )}
                </div>
              </ReviewCard>

              <div
                className="
                  rounded-2xl

                  border
                  border-blue-500/20

                  bg-blue-500/5

                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <ShieldCheck
                    size={22}
                    className="
                      mt-0.5
                      shrink-0

                      text-blue-600
                      dark:text-blue-400
                    "
                  />

                  <div>
                    <h3
                      className="
                        font-bold

                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      Criação completa
                    </h3>

                    <p
                      className="
                        mt-1

                        text-sm

                        text-gray-500
                        dark:text-gray-400

                        leading-relaxed
                      "
                    >
                      A empresa, sua configuração
                      inicial e o administrador
                      serão criados na mesma
                      operação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          className="
            shrink-0

            border-t
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            px-4
            sm:px-6
            lg:px-8

            py-4

            flex
            flex-col-reverse
            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-3
          "
        >
          <button
            type="button"
            onClick={
              step === 1
                ? onClose
                : previousStep
            }
            disabled={
              saving
            }
            className="
              w-full
              sm:w-auto

              px-5
              py-3.5

              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              text-sm
              font-bold

              text-[#080E2F]
              dark:text-white

              flex
              items-center
              justify-center
              gap-2

              shadow-xl
              dark:shadow-sm

              hover:bg-gray-50
              dark:hover:bg-white/5

              transition-colors

              disabled:opacity-50
            "
          >
            {step === 1 ? (
              "Cancelar"
            ) : (
              <>
                <ChevronLeft
                  size={19}
                />

                Voltar
              </>
            )}
          </button>

          {step <
          STEPS.length ? (
            <button
              type="button"
              onClick={
                nextStep
              }
              className="
                w-full
                sm:w-auto

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

                shadow-xl

                transition-all
              "
            >
              Continuar

              <ChevronRight
                size={19}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                void handleCreate()
              }
              disabled={
                saving
              }
              className="
                w-full
                sm:w-auto

                min-w-[180px]

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

                shadow-xl

                transition-all

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {saving
                ? "Criando..."
                : "Criar Empresa"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass = `
  w-full

  rounded-2xl

  border
  border-gray-300
  dark:border-white/10

  bg-white
  dark:bg-[#071522]

  px-4
  py-3.5

  text-sm
  sm:text-base

  text-[#080E2F]
  dark:text-white

  placeholder:text-gray-400
  dark:placeholder:text-gray-500

  outline-none

  shadow-lg
  dark:shadow-sm

  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-500/10

  transition-all
`;

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className="
        block
        min-w-0
      "
    >
      <span
        className="
          block

          mb-2

          text-sm
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <Field label={label}>
      <div
        className="
          grid
          grid-cols-[52px_minmax(0,1fr)]

          gap-2
        "
      >
        <input
          type="color"
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          className="
            w-[52px]
            h-[52px]

            rounded-xl

            border
            border-gray-300
            dark:border-white/10

            bg-white
            dark:bg-[#071522]

            p-1

            cursor-pointer
          "
        />

        <input
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          maxLength={7}
          className={inputClass}
        />
      </div>
    </Field>
  );
}

function PasswordInput({
  value,
  visible,
  onChange,
  onToggle,
}: {
  value: string;
  visible: boolean;
  onChange: (
    value: string
  ) => void;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={
          visible
            ? "text"
            : "password"
        }
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        placeholder="Mínimo 6 caracteres"
        className={`${inputClass} pr-12`}
      />

      <button
        type="button"
        onClick={
          onToggle
        }
        className="
          absolute

          right-4
          top-1/2

          -translate-y-1/2

          text-gray-400

          hover:text-gray-600
          dark:hover:text-gray-200

          transition-colors
        "
      >
        {visible ? (
          <EyeOff
            size={20}
          />
        ) : (
          <Eye
            size={20}
          />
        )}
      </button>
    </div>
  );
}

function ReviewCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: typeof Building2;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        rounded-2xl

        border
        border-gray-300
        dark:border-white/10

        bg-white
        dark:bg-[#091a2c]

        p-5

        shadow-2xl
        dark:shadow-sm
      "
    >
      <div
        className="
          flex
          items-center
          gap-3

          mb-4
        "
      >
        <PlatformIconBox
          icon={icon}
          size="sm"
          variant="gradient"
        />

        <h3
          className="
            font-bold

            text-[#080E2F]
            dark:text-white
          "
        >
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function ReviewRow({
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
        sm:gap-4
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

          break-all

          sm:text-right
        "
      >
        {value}
      </strong>
    </div>
  );
}