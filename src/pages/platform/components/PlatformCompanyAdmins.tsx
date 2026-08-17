import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import {
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  platformApi,
} from "../../../services/platformApi";

import PlatformIconBox from "../../../components/platform/PlatformIconBox";

interface PlatformCompanyAdmin {
  id: number;

  name: string;
  email: string;

  role: "admin";

  status:
    | "ativo"
    | "inativo";

  isCompanyAdmin: boolean;

  dataAdmissao:
    | string
    | null;

  dataDesligamento:
    | string
    | null;

  criadoEm: string;
}

interface PlatformCompanyAdminsProps {
  companyId: number;

  onUpdated?: () => void;
}

interface AddAdminForm {
  name: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const INITIAL_FORM: AddAdminForm = {
  name: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

export default function PlatformCompanyAdmins({
  companyId,
  onUpdated,
}: PlatformCompanyAdminsProps) {
  const [
    admins,
    setAdmins,
  ] =
    useState<
      PlatformCompanyAdmin[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    addModalOpen,
    setAddModalOpen,
  ] =
    useState(false);

  const [
    removeTarget,
    setRemoveTarget,
  ] =
    useState<
      PlatformCompanyAdmin | null
    >(null);

  const [
    removing,
    setRemoving,
  ] =
    useState(false);

  const loadAdmins =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await platformApi.get(
              `/platform/companies/${companyId}/admins`
            );

          setAdmins(
            response.data
              .admins ?? []
          );
        } catch (error) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            setError(
              error.response
                ?.data?.error ||
                error.response
                  ?.data
                  ?.message ||
                "Não foi possível carregar os administradores."
            );

            return;
          }

          setError(
            "Não foi possível carregar os administradores."
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
    void loadAdmins();
  }, [
    loadAdmins,
  ]);

  const activeAdmins =
    useMemo(
      () =>
        admins.filter(
          (admin) =>
            admin.status ===
              "ativo" &&
            admin.isCompanyAdmin
        ),
      [
        admins,
      ]
    );

  async function handleRemove() {
    if (!removeTarget) {
      return;
    }

    try {
      setRemoving(true);

      await platformApi.delete(
        `/platform/companies/${companyId}/admins/${removeTarget.id}`
      );

      toast.success(
        "Administrador removido da empresa."
      );

      setRemoveTarget(
        null
      );

      await loadAdmins();

      onUpdated?.();
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        toast.error(
          error.response
            ?.data?.error ||
            error.response
              ?.data
              ?.message ||
            "Não foi possível remover o administrador."
        );

        return;
      }

      toast.error(
        "Não foi possível remover o administrador."
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
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

          p-5
          sm:p-6

          shadow-2xl
          dark:shadow-sm
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            flex-col

            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <PlatformIconBox
              icon={
                ShieldCheck
              }
              size="sm"
              variant="soft"
            />

            <div>
              <h2
                className="
                  text-lg
                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Administradores
              </h2>

              <p
                className="
                  mt-1

                  text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Gerencie quem possui acesso administrativo a esta empresa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setAddModalOpen(
                true
              )
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
            <Plus
              size={18}
            />

            Adicionar administrador
          </button>
        </div>

        {/* RESUMO */}
        <div
          className="
            mt-6

            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
          "
        >
          <div
            className="
              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-50
              dark:bg-white/[0.03]

              p-4

              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-11
                h-11

                rounded-xl

                bg-blue-500/15
                text-blue-600
                dark:text-blue-400

                flex
                items-center
                justify-center
              "
            >
              <Users
                size={20}
              />
            </div>

            <div>
              <p
                className="
                  text-xs

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Administradores
              </p>

              <strong
                className="
                  block
                  mt-1

                  text-xl

                  text-[#080E2F]
                  dark:text-white
                "
              >
                {
                  admins.length
                }
              </strong>
            </div>
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

              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-11
                h-11

                rounded-xl

                bg-green-500/15
                text-green-600
                dark:text-green-400

                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck
                size={20}
              />
            </div>

            <div>
              <p
                className="
                  text-xs

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Ativos
              </p>

              <strong
                className="
                  block
                  mt-1

                  text-xl

                  text-[#080E2F]
                  dark:text-white
                "
              >
                {
                  activeAdmins.length
                }
              </strong>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="mt-6">
          {loading ? (
            <div
              className="
                py-10

                text-center

                text-sm

                text-gray-500
                dark:text-gray-400

                animate-pulse
              "
            >
              Carregando administradores...
            </div>
          ) : error ? (
            <div
              className="
                rounded-2xl

                border
                border-red-200
                dark:border-red-500/20

                bg-red-50
                dark:bg-red-500/10

                p-4

                text-sm

                text-red-700
                dark:text-red-300
              "
            >
              {error}
            </div>
          ) : admins.length ===
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
              Nenhum administrador encontrado.
            </div>
          ) : (
            <div
              className="
                overflow-hidden

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                divide-y
                divide-gray-200
                dark:divide-white/10
              "
            >
              {admins.map(
                (admin) => {
                  const active =
                    admin.status ===
                      "ativo" &&
                    admin.isCompanyAdmin;

                  const isLastActiveAdmin =
                    active &&
                    activeAdmins.length <=
                      1;

                  return (
                    <div
                      key={
                        admin.id
                      }
                      className="
                        flex
                        flex-col

                        md:flex-row
                        md:items-center
                        md:justify-between

                        gap-4

                        p-4

                        bg-white
                        dark:bg-[#091a2c]
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

                            font-bold
                          "
                        >
                          {admin.name
                            ?.trim()
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase() ||
                            "A"}
                        </div>

                        <div className="min-w-0">
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center

                              gap-2
                            "
                          >
                            <strong
                              className="
                                text-sm
                                sm:text-base

                                text-[#080E2F]
                                dark:text-white

                                truncate
                              "
                            >
                              {
                                admin.name
                              }
                            </strong>

                            <span
                              className={`
                                inline-flex

                                rounded-full

                                px-2.5
                                py-1

                                text-[11px]
                                font-bold

                                ${
                                  active
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
                              {active
                                ? "Ativo"
                                : "Inativo"}
                            </span>
                          </div>

                          <div
                            className="
                              mt-1.5

                              flex
                              items-center
                              gap-1.5

                              text-xs
                              sm:text-sm

                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            <Mail
                              size={14}
                              className="shrink-0"
                            />

                            <span
                              className="
                                truncate
                              "
                            >
                              {
                                admin.email
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={
                          !active ||
                          isLastActiveAdmin
                        }
                        onClick={() =>
                          setRemoveTarget(
                            admin
                          )
                        }
                        title={
                          isLastActiveAdmin
                            ? "Adicione outro administrador antes de remover este."
                            : !active
                            ? "Administrador já está inativo."
                            : "Remover administrador"
                        }
                        className="
                          w-full
                          md:w-auto

                          px-4
                          py-2.5

                          rounded-xl

                          border
                          border-red-200
                          dark:border-red-500/20

                          bg-red-50
                          dark:bg-red-500/10

                          text-sm
                          font-bold

                          text-red-600
                          dark:text-red-400

                          flex
                          items-center
                          justify-center
                          gap-2

                          transition-all

                          hover:bg-red-100
                          dark:hover:bg-red-500/20

                          disabled:opacity-40
                          disabled:cursor-not-allowed
                        "
                      >
                        <Trash2
                          size={17}
                        />

                        Remover
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {activeAdmins.length ===
          1 && (
          <p
            className="
              mt-4

              text-xs
              sm:text-sm

              text-amber-600
              dark:text-amber-400
            "
          >
            Esta empresa possui apenas um administrador ativo. Adicione outro antes de removê-lo.
          </p>
        )}
      </div>

      <AddCompanyAdminModal
        open={
          addModalOpen
        }
        companyId={
          companyId
        }
        onClose={() =>
          setAddModalOpen(
            false
          )
        }
        onCreated={async () => {
          await loadAdmins();

          onUpdated?.();
        }}
      />

      <RemoveAdminModal
        admin={
          removeTarget
        }
        removing={
          removing
        }
        onClose={() =>
          setRemoveTarget(
            null
          )
        }
        onConfirm={() =>
          void handleRemove()
        }
      />
    </>
  );
}

function AddCompanyAdminModal({
  open,
  companyId,
  onClose,
  onCreated,
}: {
  open: boolean;
  companyId: number;
  onClose: () => void;
  onCreated: () =>
    | void
    | Promise<void>;
}) {
  const [
    form,
    setForm,
  ] =
    useState<AddAdminForm>(
      INITIAL_FORM
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        INITIAL_FORM
      );
    }
  }, [
    open,
  ]);

  if (!open) {
    return null;
  }

  function updateField(
    field:
      keyof AddAdminForm,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]:
          value,
      })
    );
  }

  async function handleSubmit() {
    const email =
      form.email
        .trim()
        .toLowerCase();

    if (!email) {
      toast.error(
        "Informe o e-mail."
      );

      return;
    }

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      );

    if (!validEmail) {
      toast.error(
        "Informe um e-mail válido."
      );

      return;
    }

    if (
      !form.name.trim()
    ) {
      toast.error(
        "Informe o nome do administrador."
      );

      return;
    }

    if (!form.senha) {
      toast.error(
        "Informe uma senha."
      );

      return;
    }

    if (
      form.senha.length <
      6
    ) {
      toast.error(
        "A senha deve possuir pelo menos 6 caracteres."
      );

      return;
    }

    if (
      form.senha !==
      form.confirmarSenha
    ) {
      toast.error(
        "As senhas não coincidem."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await platformApi.post(
          `/platform/companies/${companyId}/admins`,
          {
            name:
              form.name.trim(),

            email,

            senha:
              form.senha,
          }
        );

      toast.success(
        response.data
          ?.message ||
          "Administrador adicionado com sucesso."
      );

      await onCreated();

      onClose();
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        toast.error(
          error.response
            ?.data?.error ||
            error.response
              ?.data
              ?.message ||
            "Não foi possível adicionar o administrador."
        );

        return;
      }

      toast.error(
        "Não foi possível adicionar o administrador."
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
        z-[110]

        bg-slate-950/60
        backdrop-blur-sm

        flex
        items-end
        sm:items-center
        justify-center

        p-0
        sm:p-4
      "
    >
      <div
        className="
          w-full
          sm:max-w-lg

          bg-white
          dark:bg-[#091a2c]

          rounded-t-3xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          shadow-2xl

          overflow-hidden
        "
      >
        <div
          className="
            p-5
            sm:p-6

            border-b
            border-gray-200
            dark:border-white/10

            flex
            items-start
            justify-between

            gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <PlatformIconBox
              icon={
                UserPlus
              }
              size="sm"
              variant="gradient"
            />

            <div>
              <h2
                className="
                  text-xl
                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Adicionar administrador
              </h2>

              <p
                className="
                  mt-1

                  text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Vincule um administrador à empresa.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={
              onClose
            }
            className="
              w-10
              h-10

              rounded-xl

              flex
              items-center
              justify-center

              text-gray-500

              hover:bg-gray-100
              dark:hover:bg-white/5

              disabled:opacity-50
            "
          >
            <X
              size={21}
            />
          </button>
        </div>

        <div
          className="
            p-5
            sm:p-6

            space-y-4
          "
        >
          <Field
            label="Nome"
          >
            <input
              value={
                form.name
              }
              onChange={(
                event
              ) =>
                updateField(
                  "name",
                  event.target
                    .value
                )
              }
              placeholder="Nome do administrador"
              className={
                inputClass
              }
            />
          </Field>

          <Field
            label="E-mail"
          >
            <input
              type="email"
              value={
                form.email
              }
              onChange={(
                event
              ) =>
                updateField(
                  "email",
                  event.target
                    .value
                )
              }
              placeholder="admin@empresa.com"
              className={
                inputClass
              }
            />
          </Field>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2

              gap-4
            "
          >
            <Field
              label="Senha"
            >
              <input
                type="password"
                value={
                  form.senha
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "senha",
                    event.target
                      .value
                  )
                }
                placeholder="••••••••"
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Confirmar senha"
            >
              <input
                type="password"
                value={
                  form.confirmarSenha
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "confirmarSenha",
                    event.target
                      .value
                  )
                }
                placeholder="••••••••"
                className={
                  inputClass
                }
              />
            </Field>
          </div>

          <p
            className="
              text-xs

              text-gray-500
              dark:text-gray-400
            "
          >
            Se o e-mail já pertencer a um administrador compatível, o backend reutilizará esse usuário em vez de criar uma nova conta.
          </p>
        </div>

        <div
          className="
            p-5
            sm:p-6

            border-t
            border-gray-200
            dark:border-white/10

            flex
            flex-col-reverse
            sm:flex-row
            sm:justify-end

            gap-3
          "
        >
          <button
            type="button"
            disabled={
              saving
            }
            onClick={
              onClose
            }
            className="
              px-5
              py-3

              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              text-sm
              font-bold

              text-[#080E2F]
              dark:text-white

              hover:bg-gray-50
              dark:hover:bg-white/5

              disabled:opacity-50
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={() =>
              void handleSubmit()
            }
            className="
              px-5
              py-3

              rounded-2xl

              bg-gradient-to-r
              from-blue-500
              to-purple-600

              text-white

              text-sm
              font-bold

              shadow-xl

              hover:from-blue-600
              hover:to-purple-700

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {saving
              ? "Adicionando..."
              : "Adicionar administrador"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RemoveAdminModal({
  admin,
  removing,
  onClose,
  onConfirm,
}: {
  admin:
    | PlatformCompanyAdmin
    | null;

  removing: boolean;

  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!admin) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]

        bg-slate-950/60
        backdrop-blur-sm

        flex
        items-center
        justify-center

        p-4
      "
    >
      <div
        className="
          w-full
          max-w-md

          rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#091a2c]

          p-6

          shadow-2xl
        "
      >
        <div
          className="
            w-12
            h-12

            rounded-2xl

            bg-red-500/15
            text-red-600
            dark:text-red-400

            flex
            items-center
            justify-center
          "
        >
          <Trash2
            size={22}
          />
        </div>

        <h2
          className="
            mt-4

            text-xl
            font-bold

            text-[#080E2F]
            dark:text-white
          "
        >
          Remover administrador?
        </h2>

        <p
          className="
            mt-2

            text-sm

            text-gray-500
            dark:text-gray-400

            leading-relaxed
          "
        >
          O usuário{" "}
          <strong
            className="
              text-[#080E2F]
              dark:text-white
            "
          >
            {admin.name}
          </strong>{" "}
          perderá o vínculo administrativo com esta empresa.
        </p>

        <div
          className="
            mt-6

            flex
            flex-col-reverse
            sm:flex-row
            sm:justify-end

            gap-3
          "
        >
          <button
            type="button"
            disabled={
              removing
            }
            onClick={
              onClose
            }
            className="
              px-5
              py-3

              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              text-sm
              font-bold

              text-[#080E2F]
              dark:text-white

              disabled:opacity-50
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={
              removing
            }
            onClick={
              onConfirm
            }
            className="
              px-5
              py-3

              rounded-2xl

              bg-red-600

              text-white

              text-sm
              font-bold

              shadow-xl

              hover:bg-red-700

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {removing
              ? "Removendo..."
              : "Remover administrador"}
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

  text-[#080E2F]
  dark:text-white

  placeholder:text-gray-400

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
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
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
      </span>

      {children}
    </label>
  );
}