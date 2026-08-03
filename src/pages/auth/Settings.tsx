import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { api } from "../../services/api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  AlertTriangle,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
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

type AppearanceType = "light" | "dark" | "system";

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: "student" | "client" | "admin";
}

interface UserProfile {
  id: number;
  user_id: number;
  foto_url: string | null;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  pais: string | null;
  idioma_preferido: string | null;
  empresa: string | null;
  aceita_contato_profissional: number | boolean;
  interesse_freelancer: number | boolean;
  interesse_contratacao: number | boolean;
  interesse_parceria: number | boolean;
  conta_verificada: number | boolean;
  verificado_em: string | null;
  name: string;
  email: string;
  role: "student" | "client" | "admin";
}

export default function Settings() {

  const { t, i18n } = useTranslation();

  const user: UserData = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("Sirros Academy");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("Brasil");
  const [idiomaPreferido, setIdiomaPreferido] = useState("pt-BR");

  const [aceitaContatoProfissional, setAceitaContatoProfissional] =
    useState(false);

  const [interesseFreelancer, setInteresseFreelancer] =
    useState(false);

  const [interesseContratacao, setInteresseContratacao] =
    useState(false);

  const [interesseParceria, setInteresseParceria] =
    useState(false);

  const [contaVerificada, setContaVerificada] = useState(false);
  const [, setLoadingProfile] = useState(true);

  const [appearance, setAppearance] =
    useState<AppearanceType>("system");

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [courseNotifications, setCourseNotifications] =
    useState(true);

  const [certificateNotifications, setCertificateNotifications] =
    useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  
  function getRoleLabel(role?: UserData["role"]) {
    if (role === "admin") {
      return "Administrador";
    }

    if (role === "client") {
      return "Cliente";
    }

    return "Aluno";
  }

  function getInitials(value: string) {
    if (!value.trim()) {
      return "U";
    }

    return value
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  useEffect(() => {
  async function loadProfile() {
    try {
      setLoadingProfile(true);

      const response = await api.get<UserProfile>("/users/me/profile");

      const profile = response.data;

      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.telefone || "");
      setCompany(profile.empresa || "");
      setCidade(profile.cidade || "");
      setEstado(profile.estado || "");
      setPais(profile.pais || "Brasil");

      const profileLanguage = profile.idioma_preferido || "pt-BR";

      setIdiomaPreferido(profileLanguage);
      i18n.changeLanguage(profileLanguage);

      setAceitaContatoProfissional(
        Boolean(profile.aceita_contato_profissional)
      );

      setInteresseFreelancer(Boolean(profile.interesse_freelancer));
      setInteresseContratacao(Boolean(profile.interesse_contratacao));
      setInteresseParceria(Boolean(profile.interesse_parceria));
      setContaVerificada(Boolean(profile.conta_verificada));

      const updatedUser = {
        ...user,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        foto_url: profile.foto_url,
        conta_verificada: Boolean(profile.conta_verificada),
        idioma_preferido: profile.idioma_preferido,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoadingProfile(false);
    }
  }

  loadProfile();
}, []);

async function handleSaveProfile(e: FormEvent) {
  e.preventDefault();

  if (!phone.trim()) {
    toast.error("O telefone é obrigatório para verificar a conta");
    return;
  }

  if (!cidade.trim()) {
    toast.error("A cidade é obrigatória para verificar a conta");
    return;
  }

  if (!estado.trim()) {
    toast.error("O estado é obrigatório para verificar a conta");
    return;
  }

  if (!pais.trim()) {
    toast.error("O país é obrigatório para verificar a conta");
    return;
  }

  if (!idiomaPreferido.trim()) {
    toast.error("O idioma preferido é obrigatório");
    return;
  }

  try {
    setSavingProfile(true);

    const response = await api.patch("/users/me/profile", {
      telefone: phone,
      cidade,
      estado,
      pais,
      idioma_preferido: idiomaPreferido,
      empresa: company,
      aceita_contato_profissional: aceitaContatoProfissional,
      interesse_freelancer: interesseFreelancer,
      interesse_contratacao: interesseContratacao,
      interesse_parceria: interesseParceria,
    });

    const profile: UserProfile = response.data.profile;

    setContaVerificada(Boolean(profile.conta_verificada));

    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      foto_url: profile.foto_url,
      conta_verificada: Boolean(profile.conta_verificada),
      idioma_preferido: profile.idioma_preferido,
    };

   localStorage.setItem("user", JSON.stringify(updatedUser));

    i18n.changeLanguage(profile.idioma_preferido || idiomaPreferido);

    window.dispatchEvent(new Event("user-profile-updated"));

    toast.success(response.data.message || "Perfil atualizado com sucesso");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao salvar perfil"
      );

      return;
    }

    toast.error("Erro inesperado ao salvar perfil");
  } finally {
    setSavingProfile(false);
  }
}

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Digite sua senha atual");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("Digite a nova senha");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha precisa ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setSavingPassword(true);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Senha atualizada com sucesso");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar senha");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 px-4 py-2 text-sm font-semibold mb-4">
              <Palette size={18} />
              Configurações da plataforma
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
             {t("settings.title")}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
              {t("settings.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-xl dark:shadow-sm dark:shadow-blue-500/20">
            <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-xl">
              {getInitials(name)}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#080E2F] dark:text-white">
                {name || "Usuário"}
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_420px] gap-6">
        {/* Coluna principal */}
        <div className="space-y-6">
          {/* Perfil */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                <UserRound size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  {t("settings.profileData")}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("settings.profileDescription")}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="w-28 h-28 rounded-3xl bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
                  {getInitials(name)}
                </div>

                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() =>
                      toast.error("Upload de avatar será conectado depois")
                    }
                    className="border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3 font-semibold text-blue-500 dark:text-blue-400 flex items-center gap-2 hover:bg-blue-500/10 transition-all"
                  >
                    <Camera size={20} />
                    Alterar foto
                  </button>

                  <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
                    Use uma imagem clara para identificar seu perfil na plataforma.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <InputField
                  label="Nome"
                  icon={UserRound}
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="Digite seu nome"
                />

                <InputField
                  label="E-mail"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Digite seu e-mail"
                />

                <InputField
                  label="Telefone"
                  icon={Phone}
                  type="text"
                  value={phone}
                  onChange={setPhone}
                  placeholder="Digite seu telefone"
                />

                <InputField
                  label="Empresa / Organização"
                  icon={Building2}
                  type="text"
                  value={company}
                  onChange={setCompany}
                  placeholder="Digite a organização"
                />

                <InputField
                label="Cidade"
                icon={Building2}
                type="text"
                value={cidade}
                onChange={setCidade}
                placeholder="Digite sua cidade"
              />

              <InputField
                label="Estado"
                icon={Building2}
                type="text"
                value={estado}
                onChange={setEstado}
                placeholder="Ex: RS"
              />

              <InputField
                label="País"
                icon={Building2}
                type="text"
                value={pais}
                onChange={setPais}
                placeholder="Digite seu país"
              />

              <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#080E2F] dark:text-gray-300">
            {t("settings.language")}
          </label>

          <div className="relative">
            <UserRound
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
            />

          <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#080E2F] dark:text-gray-300">
            {t("settings.language")}
          </label>

          <div className="relative">
            <UserRound
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
            />

            <select
              value={idiomaPreferido}
              onChange={(event) => setIdiomaPreferido(event.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30 transition-all"
            >
              <option value="pt-BR">{t("settings.portuguese")}</option>
              <option value="en-US">{t("settings.english")}</option>
              <option value="es-ES">{t("settings.spanish")}</option>
            </select>
          </div>
        </div>
        </div>
      </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ToggleRow
                title="Aceito contato profissional"
                subtitle="Permitir que a Sirros entre em contato para oportunidades"
                checked={aceitaContatoProfissional}
                onChange={() =>
                  setAceitaContatoProfissional(!aceitaContatoProfissional)
                }
              />

              <ToggleRow
                title="Interesse em freelancer"
                subtitle="Tenho interesse em atuar como freelancer"
                checked={interesseFreelancer}
                onChange={() => setInteresseFreelancer(!interesseFreelancer)}
              />

              <ToggleRow
                title="Interesse em contratação"
                subtitle="Tenho interesse em oportunidades de contratação"
                checked={interesseContratacao}
                onChange={() => setInteresseContratacao(!interesseContratacao)}
              />

              <ToggleRow
                title="Interesse em parceria"
                subtitle="Tenho interesse em parcerias técnicas"
                checked={interesseParceria}
                onChange={() => setInteresseParceria(!interesseParceria)}
              />
            </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-all shadow-xl dark:shadow-sm dark:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save size={22} />
                {savingProfile ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          </section>

          {/* Segurança */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                <Lock size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  Segurança
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Altere sua senha de acesso.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <InputField
                  label="Senha atual"
                  icon={KeyRound}
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="Senha atual"
                />

                <InputField
                  label="Nova senha"
                  icon={Lock}
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Nova senha"
                />

                <InputField
                  label="Confirmar senha"
                  icon={ShieldCheck}
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirmar senha"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-all shadow-xl dark:shadow-sm dark:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShieldCheck size={22} />
                {savingPassword ? "Atualizando..." : "Atualizar senha"}
              </button>
            </form>
          </section>
        </div>

        {/* Coluna lateral */}
        <aside className="space-y-6">
          {/* Aparência */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                <Palette size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  Aparência
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Escolha o modo visual.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <AppearanceButton
                active={appearance === "light"}
                icon={Sun}
                title="Modo claro"
                subtitle="Interface clara"
                onClick={() => setAppearance("light")}
              />

              <AppearanceButton
                active={appearance === "dark"}
                icon={Moon}
                title="Modo escuro"
                subtitle="Interface escura"
                onClick={() => setAppearance("dark")}
              />

              <AppearanceButton
                active={appearance === "system"}
                icon={Palette}
                title="Sistema"
                subtitle="Segue o dispositivo"
                onClick={() => setAppearance("system")}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A troca real do tema será conectada depois ao seu contexto de dark mode.
              </p>
            </div>
          </section>

          {/* Notificações */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                <Bell size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  Notificações
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Controle seus avisos.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                title="Notificações por e-mail"
                subtitle="Receber avisos importantes"
                checked={emailNotifications}
                onChange={() =>
                  setEmailNotifications(!emailNotifications)
                }
              />

              <ToggleRow
                title="Atualizações de cursos"
                subtitle="Novas aulas e módulos"
                checked={courseNotifications}
                onChange={() =>
                  setCourseNotifications(!courseNotifications)
                }
              />

              <ToggleRow
                title="Certificados"
                subtitle="Avisos de emissão e validade"
                checked={certificateNotifications}
                onChange={() =>
                  setCertificateNotifications(!certificateNotifications)
                }
              />
            </div>
          </section>

          {/* Conta */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  Status da conta
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {contaVerificada
                  ? "Sua conta está verificada."
                  : "Complete seu perfil para liberar todos os recursos."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4">
                <span className="text-gray-500 dark:text-gray-400">
                  Perfil
                </span>

                <strong className="text-[#080E2F] dark:text-white">
                  {getRoleLabel(user?.role)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4">
                <span className="text-gray-500 dark:text-gray-400">
                  Segurança
                </span>

                <span
                className={`font-semibold ${
                  contaVerificada ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {contaVerificada ? "Conta verificada" : "Pendente"}
              </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={22}
                  className="text-red-500 shrink-0 mt-0.5"
                />

                <div>
                  <h3 className="font-bold text-red-500">
                    Zona de perigo
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    A exclusão de conta será implementada apenas com confirmação segura.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  toast.error("Exclusão de conta será conectada depois")
                }
                className="mt-4 w-full rounded-2xl bg-red-500/10 text-red-500 px-5 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={20} />
                Solicitar exclusão da conta
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
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
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#080E2F] dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30 transition-all"
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
      onClick={onClick}
      className={`
        w-full
        text-left
        rounded-2xl
        border
        p-4
        flex
        items-center
        gap-3
        transition-all
        ${
          active
            ? "border-blue-500 bg-blue-500/10 text-blue-500 dark:text-blue-400"
            : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2238] text-gray-600 dark:text-gray-300 hover:border-blue-500/50"
        }
      `}
    >
      <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold">{title}</h3>

        <p className="text-sm opacity-80">
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
      onClick={onChange}
      className="w-full flex items-center justify-between gap-4 rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4 text-left hover:border-blue-500/50 transition-all"
    >
      <div>
        <h3 className="font-bold text-[#080E2F] dark:text-white">
          {title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div
        className={`
          w-14
          h-8
          rounded-full
          p-1
          transition-all
          shrink-0
          ${checked ? "bg-blue-500" : "bg-gray-300 dark:bg-[#132d46]"}
        `}
      >
        <div
          className={`
            w-6
            h-6
            rounded-full
            bg-white
            transition-all
            ${checked ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </div>
    </button>
  );
}