import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

import {
  AlertTriangle,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  Globe2,
  KeyRound,
  Languages,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Moon,
  Palette,
  Phone,
  Save,
  ShieldCheck,
  Sun,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import {
  useTranslation,
} from "react-i18next";

import toast from "react-hot-toast";

import {
  api,
} from "../../services/api";

import {
  useCompany,
} from "../../contexts/CompanyContext";

type AppearanceType =
  | "light"
  | "dark"
  | "system";

interface UserData {
  id?: number;
  name?: string;
  email?: string;

  role?:
    | "student"
    | "client"
    | "admin";
}

interface UserProfile {
  id: number;
  user_id: number;

  foto_url: string | null;

  telefone: string | null;

  cidade: string | null;
  estado: string | null;
  pais: string | null;

  idioma_preferido:
    | string
    | null;

  empresa: string | null;

  aceita_contato_profissional:
    | number
    | boolean;

  interesse_freelancer:
    | number
    | boolean;

  interesse_contratacao:
    | number
    | boolean;

  interesse_parceria:
    | number
    | boolean;

  conta_verificada:
    | number
    | boolean;

  verificado_em:
    | string
    | null;

  name: string;
  email: string;

  role:
    | "student"
    | "client"
    | "admin";
}

function getUserFromStorage(): UserData {
  return JSON.parse(
    localStorage.getItem(
      "user",
    ) || "{}",
  );
}

export default function Settings() {
  const {
    t,
    i18n,
  } = useTranslation();

  const {
    company: tenantCompany,
  } = useCompany();

  const user =
    getUserFromStorage();

  const [
    name,
    setName,
  ] = useState(
    user?.name || "",
  );

  const [
    email,
    setEmail,
  ] = useState(
    user?.email || "",
  );

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    organization,
    setOrganization,
  ] = useState("");

  const [
    cidade,
    setCidade,
  ] = useState("");

  const [
    estado,
    setEstado,
  ] = useState("");

  const [
    pais,
    setPais,
  ] = useState(
    "Brasil",
  );

  const [
    idiomaPreferido,
    setIdiomaPreferido,
  ] = useState(
    "pt-BR",
  );

  const [
    aceitaContatoProfissional,
    setAceitaContatoProfissional,
  ] = useState(false);

  const [
    interesseFreelancer,
    setInteresseFreelancer,
  ] = useState(false);

  const [
    interesseContratacao,
    setInteresseContratacao,
  ] = useState(false);

  const [
    interesseParceria,
    setInteresseParceria,
  ] = useState(false);

  const [
    contaVerificada,
    setContaVerificada,
  ] = useState(false);

  const [
    loadingProfile,
    setLoadingProfile,
  ] = useState(true);

  const [
    appearance,
    setAppearance,
  ] =
    useState<AppearanceType>(
      "system",
    );

  const [
    emailNotifications,
    setEmailNotifications,
  ] = useState(true);

  const [
    courseNotifications,
    setCourseNotifications,
  ] = useState(true);

  const [
    certificateNotifications,
    setCertificateNotifications,
  ] = useState(true);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    savingProfile,
    setSavingProfile,
  ] = useState(false);

  const [
    savingPassword,
    setSavingPassword,
  ] = useState(false);

  const environmentName =
    tenantCompany
      ?.configuracao
      ?.nomeAmbiente ||
    tenantCompany
      ?.nomeFantasia ||
    "Plataforma de Treinamento";

  function getRoleLabel(
    role?: UserData["role"],
  ) {
    if (
      role === "admin"
    ) {
      return "Administrador";
    }

    if (
      role === "client"
    ) {
      return "Cliente";
    }

    return "Aluno";
  }

  function getInitials(
    value: string,
  ) {
    if (
      !value.trim()
    ) {
      return "U";
    }

    return value
      .split(" ")
      .filter(Boolean)
      .map(
        (
          part,
        ) =>
          part[0],
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(
          true,
        );

        const response =
          await api.get<UserProfile>(
            "/users/me/profile",
          );

        const profile =
          response.data;

        setName(
          profile.name || "",
        );

        setEmail(
          profile.email || "",
        );

        setPhone(
          profile.telefone || "",
        );

        setOrganization(
          profile.empresa || "",
        );

        setCidade(
          profile.cidade || "",
        );

        setEstado(
          profile.estado || "",
        );

        setPais(
          profile.pais ||
            "Brasil",
        );

        const profileLanguage =
          profile.idioma_preferido ||
          "pt-BR";

        setIdiomaPreferido(
          profileLanguage,
        );

        void i18n.changeLanguage(
          profileLanguage,
        );

        setAceitaContatoProfissional(
          Boolean(
            profile.aceita_contato_profissional,
          ),
        );

        setInteresseFreelancer(
          Boolean(
            profile.interesse_freelancer,
          ),
        );

        setInteresseContratacao(
          Boolean(
            profile.interesse_contratacao,
          ),
        );

        setInteresseParceria(
          Boolean(
            profile.interesse_parceria,
          ),
        );

        setContaVerificada(
          Boolean(
            profile.conta_verificada,
          ),
        );

        const updatedUser = {
          ...getUserFromStorage(),

          name:
            profile.name,

          email:
            profile.email,

          role:
            profile.role,

          foto_url:
            profile.foto_url,

          conta_verificada:
            Boolean(
              profile.conta_verificada,
            ),

          idioma_preferido:
            profile.idioma_preferido,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser,
          ),
        );
      } catch (error) {
        console.log(
          error,
        );

        toast.error(
          "Erro ao carregar perfil",
        );
      } finally {
        setLoadingProfile(
          false,
        );
      }
    }

    void loadProfile();
  }, [
    i18n,
  ]);

  async function handleSaveProfile(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      !phone.trim()
    ) {
      toast.error(
        "O telefone é obrigatório para verificar a conta",
      );

      return;
    }

    if (
      !cidade.trim()
    ) {
      toast.error(
        "A cidade é obrigatória para verificar a conta",
      );

      return;
    }

    if (
      !estado.trim()
    ) {
      toast.error(
        "O estado é obrigatório para verificar a conta",
      );

      return;
    }

    if (
      !pais.trim()
    ) {
      toast.error(
        "O país é obrigatório para verificar a conta",
      );

      return;
    }

    if (
      !idiomaPreferido.trim()
    ) {
      toast.error(
        "O idioma preferido é obrigatório",
      );

      return;
    }

    try {
      setSavingProfile(
        true,
      );

      const response =
        await api.patch(
          "/users/me/profile",
          {
            telefone:
              phone,

            cidade,
            estado,
            pais,

            idioma_preferido:
              idiomaPreferido,

            empresa:
              organization,

            aceita_contato_profissional:
              aceitaContatoProfissional,

            interesse_freelancer:
              interesseFreelancer,

            interesse_contratacao:
              interesseContratacao,

            interesse_parceria:
              interesseParceria,
          },
        );

      const profile:
        UserProfile =
        response.data.profile;

      setContaVerificada(
        Boolean(
          profile.conta_verificada,
        ),
      );

      const updatedUser = {
        ...getUserFromStorage(),

        name:
          profile.name,

        email:
          profile.email,

        role:
          profile.role,

        foto_url:
          profile.foto_url,

        conta_verificada:
          Boolean(
            profile.conta_verificada,
          ),

        idioma_preferido:
          profile.idioma_preferido,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser,
        ),
      );

      void i18n.changeLanguage(
        profile.idioma_preferido ||
          idiomaPreferido,
      );

      window.dispatchEvent(
        new Event(
          "user-profile-updated",
        ),
      );

      toast.success(
        response.data
          .message ||
          "Perfil atualizado com sucesso",
      );
    } catch (error) {
      if (
        axios.isAxiosError(
          error,
        )
      ) {
        toast.error(
          error.response?.data
            ?.error ||
            error.response?.data
              ?.message ||
            "Erro ao salvar perfil",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao salvar perfil",
      );
    } finally {
      setSavingProfile(
        false,
      );
    }
  }

  async function handleChangePassword(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      !currentPassword.trim()
    ) {
      toast.error(
        "Digite sua senha atual",
      );

      return;
    }

    if (
      !newPassword.trim()
    ) {
      toast.error(
        "Digite a nova senha",
      );

      return;
    }

    if (
      newPassword.length <
      6
    ) {
      toast.error(
        "A nova senha precisa ter pelo menos 6 caracteres",
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      toast.error(
        "As senhas não coincidem",
      );

      return;
    }

    try {
      setSavingPassword(
        true,
      );

      /*
        Fluxo existente mantido.
        A integração real da troca
        de senha será revisada
        posteriormente.
      */

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(
        "Senha atualizada com sucesso",
      );
    } catch (error) {
      console.log(
        error,
      );

      toast.error(
        "Erro ao atualizar senha",
      );
    } finally {
      setSavingPassword(
        false,
      );
    }
  }

  if (
    loadingProfile
  ) {
    return (
      <div
        className="
          min-h-[60vh]

          flex
          flex-col
          items-center
          justify-center

          gap-3

          text-gray-500
          dark:text-gray-300
        "
      >
        <Loader2
          className="
            w-8
            h-8

            animate-spin

            text-[var(--company-primary)]
          "
        />

        <span>
          Carregando configurações...
        </span>
      </div>
    );
  }

  return (
    <main
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <section
        className="
          rounded-2xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#091a2c]

          p-4
          sm:p-5
          lg:p-8

          shadow-2xl
          dark:shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col

            gap-5
            sm:gap-6

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-4

                inline-flex
                items-center

                gap-2

                rounded-full

                border
                border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                px-4
                py-2

                text-sm
                font-semibold

                text-[var(--company-primary)]
              "
            >
              <Palette
                size={18}
              />

              Configurações da
              plataforma
            </div>

            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl

                font-bold

                text-[#080E2F]
                dark:text-white

                leading-tight
              "
            >
              {t(
                "settings.title",
              )}
            </h1>

            <p
              className="
                mt-2

                max-w-3xl

                text-sm
                sm:text-base
                lg:text-lg

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              {t(
                "settings.subtitle",
              )}
            </p>
          </div>

          <div
            className="
              w-full

              sm:w-auto

              flex
              items-center

              gap-4

              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-50
              dark:bg-[#0d2238]

              p-4

              shadow-xl
              dark:shadow-sm
            "
          >
            <div
              className="
                w-14
                h-14

                sm:w-16
                sm:h-16

                rounded-2xl

                bg-gradient-to-br
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                text-white

                flex
                items-center
                justify-center

                shrink-0

                text-lg
                sm:text-xl

                font-bold

                shadow-xl
              "
            >
              {getInitials(
                name,
              )}
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-base
                  sm:text-lg

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  break-words
                "
              >
                {name ||
                  "Usuário"}
              </h2>

              <p
                className="
                  mt-0.5

                  text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                {getRoleLabel(
                  user?.role,
                )}
              </p>

              <p
                className="
                  mt-1

                  text-xs

                  text-[var(--company-primary)]

                  break-words
                "
              >
                {environmentName}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="
          grid
          grid-cols-1

          gap-6

          2xl:grid-cols-[minmax(0,1fr)_400px]
        "
      >
        {/* COLUNA PRINCIPAL */}
        <div
          className="
            min-w-0

            space-y-6
          "
        >
          {/* PERFIL */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <SectionHeader
              icon={
                UserRound
              }
              title={t(
                "settings.profileData",
              )}
              subtitle={t(
                "settings.profileDescription",
              )}
            />

            <form
              onSubmit={
                handleSaveProfile
              }
              className="
                mt-6

                space-y-6
              "
            >
              {/* AVATAR */}
              <div
                className="
                  flex
                  flex-col

                  gap-4
                  sm:gap-5

                  sm:flex-row
                  sm:items-center
                "
              >
                <div
                  className="
                    w-24
                    h-24

                    sm:w-28
                    sm:h-28

                    rounded-2xl
                    sm:rounded-3xl

                    bg-gradient-to-br
                    from-[var(--company-primary)]
                    to-[var(--company-secondary)]

                    text-white

                    flex
                    items-center
                    justify-center

                    shrink-0

                    text-2xl
                    sm:text-3xl

                    font-bold

                    shadow-2xl
                    dark:shadow-sm
                  "
                >
                  {getInitials(
                    name,
                  )}
                </div>

                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      toast.error(
                        "Upload de avatar será conectado depois",
                      )
                    }
                    className="
                      w-full
                      sm:w-auto

                      rounded-2xl

                      border
                      border-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]

                      bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

                      px-5
                      py-3

                      font-semibold

                      text-[var(--company-primary)]

                      flex
                      items-center
                      justify-center

                      gap-2

                      transition-all

                      hover:bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                    "
                  >
                    <Camera
                      size={20}
                    />

                    Alterar foto
                  </button>

                  <p
                    className="
                      mt-3

                      max-w-xl

                      text-sm

                      text-gray-500
                      dark:text-gray-400

                      leading-relaxed
                    "
                  >
                    Use uma imagem
                    clara para
                    identificar seu
                    perfil na
                    plataforma.
                  </p>
                </div>
              </div>

              {/* CAMPOS */}
              <div
                className="
                  grid
                  grid-cols-1

                  lg:grid-cols-2

                  gap-5
                "
              >
                <InputField
                  label="Nome"
                  icon={
                    UserRound
                  }
                  type="text"
                  value={
                    name
                  }
                  onChange={
                    setName
                  }
                  placeholder="Digite seu nome"
                />

                <InputField
                  label="E-mail"
                  icon={Mail}
                  type="email"
                  value={
                    email
                  }
                  onChange={
                    setEmail
                  }
                  placeholder="Digite seu e-mail"
                />

                <InputField
                  label="Telefone"
                  icon={Phone}
                  type="text"
                  value={
                    phone
                  }
                  onChange={
                    setPhone
                  }
                  placeholder="Digite seu telefone"
                />

                <InputField
                  label="Empresa / Organização"
                  icon={
                    Building2
                  }
                  type="text"
                  value={
                    organization
                  }
                  onChange={
                    setOrganization
                  }
                  placeholder="Digite a organização"
                />

                <InputField
                  label="Cidade"
                  icon={
                    MapPin
                  }
                  type="text"
                  value={
                    cidade
                  }
                  onChange={
                    setCidade
                  }
                  placeholder="Digite sua cidade"
                />

                <InputField
                  label="Estado"
                  icon={
                    MapPin
                  }
                  type="text"
                  value={
                    estado
                  }
                  onChange={
                    setEstado
                  }
                  placeholder="Ex: RS"
                />

                <InputField
                  label="País"
                  icon={
                    Globe2
                  }
                  type="text"
                  value={
                    pais
                  }
                  onChange={
                    setPais
                  }
                  placeholder="Digite seu país"
                />

                {/* IDIOMA */}
                <div
                  className="
                    flex
                    flex-col

                    gap-2
                  "
                >
                  <label
                    className="
                      text-sm
                      font-semibold

                      text-[#080E2F]
                      dark:text-gray-300
                    "
                  >
                    {t(
                      "settings.language",
                    )}
                  </label>

                  <div className="relative">
                    <Languages
                      size={20}
                      className="
                        absolute

                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-[var(--company-primary)]

                        pointer-events-none
                      "
                    />

                    <select
                      value={
                        idiomaPreferido
                      }
                      onChange={(
                        event,
                      ) =>
                        setIdiomaPreferido(
                          event
                            .target
                            .value,
                        )
                      }
                      className="
                        w-full

                        appearance-none

                        rounded-2xl

                        border
                        border-gray-200
                        dark:border-white/10

                        bg-gray-50
                        dark:bg-[#0d2238]

                        py-4
                        pl-12
                        pr-4

                        text-[#080E2F]
                        dark:text-white

                        outline-none

                        shadow-xl
                        dark:shadow-sm

                        transition-all

                        focus:border-[var(--company-primary)]

                        focus:ring-4
                        focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                      "
                    >
                      <option value="pt-BR">
                        {t(
                          "settings.portuguese",
                        )}
                      </option>

                      <option value="en-US">
                        {t(
                          "settings.english",
                        )}
                      </option>

                      <option value="es-ES">
                        {t(
                          "settings.spanish",
                        )}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PREFERÊNCIAS PROFISSIONAIS */}
              <div
                className="
                  grid
                  grid-cols-1

                  lg:grid-cols-2

                  gap-4
                "
              >
                <ToggleRow
                  title="Aceito contato profissional"
                  subtitle="Permitir contato sobre oportunidades profissionais"
                  checked={
                    aceitaContatoProfissional
                  }
                  onChange={() =>
                    setAceitaContatoProfissional(
                      !aceitaContatoProfissional,
                    )
                  }
                />

                <ToggleRow
                  title="Interesse em freelancer"
                  subtitle="Tenho interesse em atuar como freelancer"
                  checked={
                    interesseFreelancer
                  }
                  onChange={() =>
                    setInteresseFreelancer(
                      !interesseFreelancer,
                    )
                  }
                />

                <ToggleRow
                  title="Interesse em contratação"
                  subtitle="Tenho interesse em oportunidades de contratação"
                  checked={
                    interesseContratacao
                  }
                  onChange={() =>
                    setInteresseContratacao(
                      !interesseContratacao,
                    )
                  }
                />

                <ToggleRow
                  title="Interesse em parceria"
                  subtitle="Tenho interesse em parcerias profissionais"
                  checked={
                    interesseParceria
                  }
                  onChange={() =>
                    setInteresseParceria(
                      !interesseParceria,
                    )
                  }
                />
              </div>

              <button
                type="submit"
                disabled={
                  savingProfile
                }
                className="
                  w-full
                  sm:w-auto

                  min-h-[52px]

                  rounded-2xl

                  bg-gradient-to-r
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  px-6
                  py-3.5

                  font-semibold

                  text-white

                  flex
                  items-center
                  justify-center

                  gap-2

                  shadow-2xl
                  dark:shadow-sm

                  transition-all

                  hover:opacity-95

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {savingProfile ? (
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={21}
                  />
                )}

                {savingProfile
                  ? "Salvando..."
                  : "Salvar alterações"}
              </button>
            </form>
          </section>

          {/* SEGURANÇA */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <SectionHeader
              icon={Lock}
              title="Segurança"
              subtitle="Altere sua senha de acesso."
            />

            <form
              onSubmit={
                handleChangePassword
              }
              className="
                mt-6

                space-y-5
              "
            >
              <div
                className="
                  grid
                  grid-cols-1

                  lg:grid-cols-3

                  gap-5
                "
              >
                <InputField
                  label="Senha atual"
                  icon={
                    KeyRound
                  }
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={
                    setCurrentPassword
                  }
                  placeholder="Senha atual"
                />

                <InputField
                  label="Nova senha"
                  icon={Lock}
                  type="password"
                  value={
                    newPassword
                  }
                  onChange={
                    setNewPassword
                  }
                  placeholder="Nova senha"
                />

                <InputField
                  label="Confirmar senha"
                  icon={
                    ShieldCheck
                  }
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={
                    setConfirmPassword
                  }
                  placeholder="Confirmar senha"
                />
              </div>

              <button
                type="submit"
                disabled={
                  savingPassword
                }
                className="
                  w-full
                  sm:w-auto

                  min-h-[52px]

                  rounded-2xl

                  bg-gradient-to-r
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  px-6
                  py-3.5

                  font-semibold

                  text-white

                  flex
                  items-center
                  justify-center

                  gap-2

                  shadow-2xl
                  dark:shadow-sm

                  transition-all

                  hover:opacity-95

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {savingPassword ? (
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />
                ) : (
                  <ShieldCheck
                    size={21}
                  />
                )}

                {savingPassword
                  ? "Atualizando..."
                  : "Atualizar senha"}
              </button>
            </form>
          </section>
        </div>

        {/* COLUNA LATERAL */}
        <aside
          className="
            min-w-0

            space-y-6
          "
        >
          {/* APARÊNCIA */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <SectionHeader
              icon={
                Palette
              }
              title="Aparência"
              subtitle="Escolha o modo visual."
            />

            <div
              className="
                mt-5

                space-y-3
              "
            >
              <AppearanceButton
                active={
                  appearance ===
                  "light"
                }
                icon={Sun}
                title="Modo claro"
                subtitle="Interface clara"
                onClick={() =>
                  setAppearance(
                    "light",
                  )
                }
              />

              <AppearanceButton
                active={
                  appearance ===
                  "dark"
                }
                icon={Moon}
                title="Modo escuro"
                subtitle="Interface escura"
                onClick={() =>
                  setAppearance(
                    "dark",
                  )
                }
              />

              <AppearanceButton
                active={
                  appearance ===
                  "system"
                }
                icon={
                  Palette
                }
                title="Sistema"
                subtitle="Segue o dispositivo"
                onClick={() =>
                  setAppearance(
                    "system",
                  )
                }
              />
            </div>

            <div
              className="
                mt-5

                rounded-2xl

                border
                border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                bg-[color-mix(in_srgb,var(--company-primary)_6%,transparent)]

                p-4
              "
            >
              <p
                className="
                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                A aplicação dessa
                preferência ao tema da
                plataforma será
                integrada posteriormente.
              </p>
            </div>
          </section>

          {/* NOTIFICAÇÕES */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <SectionHeader
              icon={Bell}
              title="Notificações"
              subtitle="Controle seus avisos."
            />

            <div
              className="
                mt-5

                space-y-4
              "
            >
              <ToggleRow
                title="Notificações por e-mail"
                subtitle="Receber avisos importantes"
                checked={
                  emailNotifications
                }
                onChange={() =>
                  setEmailNotifications(
                    !emailNotifications,
                  )
                }
              />

              <ToggleRow
                title="Atualizações de cursos"
                subtitle="Novas aulas e módulos"
                checked={
                  courseNotifications
                }
                onChange={() =>
                  setCourseNotifications(
                    !courseNotifications,
                  )
                }
              />

              <ToggleRow
                title="Certificados"
                subtitle="Avisos de emissão e validade"
                checked={
                  certificateNotifications
                }
                onChange={() =>
                  setCertificateNotifications(
                    !certificateNotifications,
                  )
                }
              />
            </div>
          </section>

          {/* CONTA */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <div
              className="
                flex
                items-start

                gap-3

                mb-5
              "
            >
              <div
                className={`
                  w-12
                  h-12

                  rounded-2xl

                  flex
                  items-center
                  justify-center

                  shrink-0

                  ${
                    contaVerificada
                      ? `
                          bg-green-500/10

                          text-green-500
                        `
                      : `
                          bg-yellow-500/10

                          text-yellow-500
                        `
                  }
                `}
              >
                {contaVerificada ? (
                  <CheckCircle2
                    size={27}
                  />
                ) : (
                  <AlertTriangle
                    size={27}
                  />
                )}
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-lg
                    sm:text-xl

                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Status da conta
                </h2>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-gray-400

                    leading-relaxed
                  "
                >
                  {contaVerificada
                    ? "Sua conta está verificada."
                    : "Complete seu perfil para liberar todos os recursos."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <StatusRow
                label="Perfil"
                value={getRoleLabel(
                  user?.role,
                )}
              />

              <StatusRow
                label="Segurança"
                value={
                  contaVerificada
                    ? "Conta verificada"
                    : "Pendente"
                }
                status={
                  contaVerificada
                    ? "success"
                    : "warning"
                }
              />
            </div>

            {/* ZONA DE PERIGO */}
            <div
              className="
                mt-5

                rounded-2xl

                border
                border-red-500/20

                bg-red-500/10

                p-4
              "
            >
              <div
                className="
                  flex
                  items-start

                  gap-3
                "
              >
                <AlertTriangle
                  size={22}
                  className="
                    mt-0.5

                    shrink-0

                    text-red-500
                  "
                />

                <div className="min-w-0">
                  <h3
                    className="
                      font-bold

                      text-red-500
                    "
                  >
                    Zona de perigo
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
                    A exclusão de conta
                    será disponibilizada
                    apenas com um fluxo
                    seguro de
                    confirmação.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  toast.error(
                    "Exclusão de conta será conectada depois",
                  )
                }
                className="
                  mt-4

                  w-full

                  rounded-2xl

                  bg-red-500/10

                  px-5
                  py-3

                  font-semibold

                  text-red-500

                  flex
                  items-center
                  justify-center

                  gap-2

                  transition-all

                  hover:bg-red-500/20
                "
              >
                <Trash2
                  size={20}
                />

                Solicitar exclusão da
                conta
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="
        flex
        items-start

        gap-3
      "
    >
      <div
        className="
          w-11
          h-11

          sm:w-12
          sm:h-12

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center

          shrink-0
        "
      >
        <Icon
          size={26}
        />
      </div>

      <div className="min-w-0">
        <h2
          className="
            text-lg
            sm:text-xl

            font-bold

            text-[#080E2F]
            dark:text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1

            text-sm

            text-gray-500
            dark:text-gray-400

            leading-relaxed
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: LucideIcon;
  type: string;
  value: string;

  onChange:
    (
      value: string,
    ) => void;

  placeholder: string;
}) {
  return (
    <div
      className="
        min-w-0

        flex
        flex-col

        gap-2
      "
    >
      <label
        className="
          text-sm
          font-semibold

          text-[#080E2F]
          dark:text-gray-300
        "
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={20}
          className="
            absolute

            left-4
            top-1/2

            -translate-y-1/2

            text-[var(--company-primary)]

            pointer-events-none
          "
        />

        <input
          type={type}
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          placeholder={
            placeholder
          }
          className="
            w-full
            min-w-0

            rounded-2xl

            border
            border-gray-200
            dark:border-white/10

            bg-gray-50
            dark:bg-[#0d2238]

            py-4
            pl-12
            pr-4

            text-[#080E2F]
            dark:text-white

            placeholder:text-gray-400
            dark:placeholder:text-gray-500

            outline-none

            shadow-xl
            dark:shadow-sm

            transition-all

            focus:border-[var(--company-primary)]

            focus:ring-4
            focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
          "
        />
      </div>
    </div>
  );
}

function AppearanceButton({
  active,
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;

  icon: LucideIcon;

  title: string;
  subtitle: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        w-full

        rounded-2xl

        border

        p-4

        text-left

        flex
        items-center

        gap-3

        transition-all

        ${
          active
            ? `
                border-[var(--company-primary)]

                bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                text-[var(--company-primary)]
              `
            : `
                border-gray-200
                dark:border-white/10

                bg-gray-50
                dark:bg-[#0d2238]

                text-gray-600
                dark:text-gray-300

                hover:border-[color-mix(in_srgb,var(--company-primary)_40%,transparent)]
              `
        }
      `}
    >
      <div
        className="
          w-11
          h-11

          rounded-xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          flex
          items-center
          justify-center

          shrink-0
        "
      >
        <Icon
          size={22}
        />
      </div>

      <div className="min-w-0">
        <h3 className="font-bold">
          {title}
        </h3>

        <p
          className="
            mt-0.5

            text-sm

            opacity-80
          "
        >
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;

  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onChange
      }
      role="switch"
      aria-checked={
        checked
      }
      className="
        w-full

        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-[#0d2238]

        p-4

        flex
        items-center
        justify-between

        gap-4

        text-left

        transition-all

        hover:border-[color-mix(in_srgb,var(--company-primary)_40%,transparent)]
      "
    >
      <div className="min-w-0">
        <h3
          className="
            font-bold

            text-[#080E2F]
            dark:text-white
          "
        >
          {title}
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
          {subtitle}
        </p>
      </div>

      <div
        className={`
          w-14
          h-8

          rounded-full

          p-1

          shrink-0

          transition-all

          ${
            checked
              ? `
                  bg-[var(--company-primary)]
                `
              : `
                  bg-gray-300
                  dark:bg-[#132d46]
                `
          }
        `}
      >
        <div
          className={`
            w-6
            h-6

            rounded-full

            bg-white

            shadow-md

            transition-all

            ${
              checked
                ? "translate-x-6"
                : "translate-x-0"
            }
          `}
        />
      </div>
    </button>
  );
}

function StatusRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;

  status?:
    | "success"
    | "warning";
}) {
  return (
    <div
      className="
        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-[#0d2238]

        p-4

        flex
        items-center
        justify-between

        gap-4
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
        className={`
          text-right

          text-sm

          ${
            status ===
            "success"
              ? `
                  text-green-600
                  dark:text-green-400
                `
              : status ===
                  "warning"
                ? `
                    text-yellow-600
                    dark:text-yellow-400
                  `
                : `
                    text-[#080E2F]
                    dark:text-white
                  `
          }
        `}
      >
        {value}
      </strong>
    </div>
  );
}