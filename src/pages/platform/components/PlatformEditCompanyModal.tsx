import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Building2,
  Palette,
  Save,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  platformApi,
} from "../../../services/platformApi";

import PlatformIconBox from "../../../components/platform/PlatformIconBox";

interface PlatformCompanyForEdit {
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
}

interface PlatformEditCompanyModalProps {
  open: boolean;

  company:
    | PlatformCompanyForEdit
    | null;

  onClose: () => void;

  onUpdated: () => void;
}

interface EditCompanyForm {
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
}

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

export default function PlatformEditCompanyModal({
  open,
  company,
  onClose,
  onUpdated,
}: PlatformEditCompanyModalProps) {
  const [
    form,
    setForm,
  ] =
    useState<EditCompanyForm>({
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      status: "ativa",
      nomeAmbiente: "",
      corPrimaria: "#2563EB",
      corSecundaria: "#7C3AED",
      corAcento: "#06B6D4",
    });

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  useEffect(() => {
    if (
      !open ||
      !company
    ) {
      return;
    }

    setForm({
      razaoSocial:
        company.razaoSocial,

      nomeFantasia:
        company.nomeFantasia,

      cnpj:
        formatCnpjInput(
          company.cnpj ?? ""
        ),

      status:
        company.status,

      nomeAmbiente:
        company.configuracao
          .nomeAmbiente ?? "",

      corPrimaria:
        company.configuracao
          .cores
          .primaria ??
        "#2563EB",

      corSecundaria:
        company.configuracao
          .cores
          .secundaria ??
        "#7C3AED",

      corAcento:
        company.configuracao
          .cores
          .acento ??
        "#06B6D4",
    });
  }, [
    open,
    company,
  ]);

  if (
    !open ||
    !company
  ) {
    return null;
  }

  const companyId =
  company.id;

  function updateField<
    K extends keyof EditCompanyForm
  >(
    field: K,
    value: EditCompanyForm[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function validate() {
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

    const colors = [
      form.corPrimaria,
      form.corSecundaria,
      form.corAcento,
    ];

    const invalidColor =
      colors.some(
        (color) =>
          !/^#[0-9A-Fa-f]{6}$/.test(
            color
          )
      );

    if (invalidColor) {
      toast.error(
        "As cores devem estar no formato #RRGGBB."
      );

      return false;
    }

    return true;
  }

  async function handleSave() {
    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      await platformApi.patch(
        `/platform/companies/${companyId}`,
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
        }
      );

      toast.success(
        "Empresa atualizada com sucesso."
      );

      onUpdated();
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
            "Não foi possível atualizar a empresa."
        );

        return;
      }

      toast.error(
        "Não foi possível atualizar a empresa."
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
          sm:max-w-3xl

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

            py-5
            sm:py-6

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
                  Editar Empresa
                </h2>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Atualize os dados e a identidade do ambiente.
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

            space-y-7
          "
        >
          {/* EMPRESA */}
          <section>
            <div
              className="
                flex
                items-center
                gap-3

                mb-4
              "
            >
              <PlatformIconBox
                icon={Building2}
                size="sm"
                variant="soft"
              />

              <div>
                <h3
                  className="
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Dados da Empresa
                </h3>

                <p
                  className="
                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Informações cadastrais do tenant.
                </p>
              </div>
            </div>

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
                  inputMode="numeric"
                  placeholder="00.000.000/0000-00"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Status"
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
          </section>

          {/* IDENTIDADE */}
          <section
            className="
              pt-6

              border-t
              border-gray-200
              dark:border-white/10
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
                icon={Palette}
                size="sm"
                variant="soft"
              />

              <div>
                <h3
                  className="
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Identidade
                </h3>

                <p
                  className="
                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Nome do ambiente e cores utilizadas pela empresa.
                </p>
              </div>
            </div>

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
                placeholder="Academia da Empresa"
                className={inputClass}
              />
            </Field>

            <div
              className="
                mt-5

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
                mt-5

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-gray-50
                dark:bg-white/[0.03]

                p-4
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

                  grid
                  grid-cols-3

                  gap-3
                "
              >
                <ColorPreview
                  value={
                    form.corPrimaria
                  }
                />

                <ColorPreview
                  value={
                    form.corSecundaria
                  }
                />

                <ColorPreview
                  value={
                    form.corAcento
                  }
                />
              </div>
            </div>
          </section>
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
              onClose
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

              shadow-xl
              dark:shadow-sm

              hover:bg-gray-50
              dark:hover:bg-white/5

              transition-colors

              disabled:opacity-50
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() =>
              void handleSave()
            }
            disabled={
              saving
            }
            className="
              w-full
              sm:w-auto

              min-w-[170px]

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
            <Save
              size={19}
              className="shrink-0"
            />

            {saving
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
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

function ColorPreview({
  value,
}: {
  value: string;
}) {
  return (
    <div
      className="
        h-14

        rounded-2xl

        border
        border-black/5

        shadow-lg
      "
      style={{
        backgroundColor:
          value,
      }}
    />
  );
}