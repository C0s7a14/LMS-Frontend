import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Award,
  Bot,
  Brain,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  BarChart3,
  Building2,
} from "lucide-react";

import { api } from "../../services/api";
import { platformApi } from "../../services/platformApi";

type LoginMode =
  | "company"
  | "platform";

export default function Login() {
  const navigate =
    useNavigate();

  const [
    loginMode,
    setLoginMode,
  ] =
    useState<LoginMode>(
      "company"
    );

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    remember,
    setRemember,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  async function handleLogin(
    e: FormEvent
  ) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(
        "Digite seu e-mail"
      );

      return;
    }

    if (!senha.trim()) {
      toast.error(
        "Digite sua senha"
      );

      return;
    }

    try {
      setLoading(true);

      // =============================================
      // LOGIN SUPERADMIN
      // =============================================

      if (
        loginMode ===
        "platform"
      ) {
        const response =
          await platformApi.post(
            "/platform/auth/login",
            {
              email:
                email
                  .trim()
                  .toLowerCase(),

              senha,
            }
          );

        const data =
          response.data;

        if (
          !data.accessToken ||
          !data.refreshToken
        ) {
          throw new Error(
            "Resposta de autenticação inválida."
          );
        }

        localStorage.setItem(
          "platformAccessToken",
          data.accessToken
        );

        localStorage.setItem(
          "platformRefreshToken",
          data.refreshToken
        );

        toast.success(
          "Login SuperAdmin feito com sucesso!"
        );

        navigate(
          "/platform/dashboard"
        );

        return;
      }

      // =============================================
      // LOGIN EMPRESA
      // =============================================

      const response =
        await api.post(
          "/auth/login",
          {
            email:
              email
                .trim()
                .toLowerCase(),

            senha,
          }
        );

      const data =
        response.data;

      localStorage.setItem(
        "token",
        data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );

      toast.success(
        "Login feito com sucesso!"
      );

      const role =
        data.user.role;

      if (
        role ===
        "admin"
      ) {
        navigate(
          "/Dashboard"
        );

        return;
      }

      if (
        role ===
        "student"
      ) {
        navigate(
          "/home"
        );

        return;
      }

      if (
        role ===
        "client"
      ) {
        navigate(
          "/devices"
        );

        return;
      }

      navigate("/");
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
            (
              loginMode ===
              "platform"
                ? "Erro ao acessar o SuperAdmin"
                : "Erro ao fazer login"
            )
        );

        return;
      }

      toast.error(
        "Erro inesperado ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-white relative">
      {/* Fundo industrial fake / gradiente */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),linear-gradient(90deg,#ffffff_0%,#f8fbff_42%,rgba(15,23,42,0.08)_100%)]" />

      <div className="absolute inset-y-0 right-0 w-[55%] bg-[linear-gradient(90deg,rgba(255,255,255,0.15),rgba(15,23,42,0.35)),radial-gradient(circle_at_center,rgba(59,130,246,0.22),transparent_40%)] hidden lg:block" />

      {/* Pontos decorativos */}
      <div className="absolute left-0 top-0 w-64 h-64 opacity-40 bg-[radial-gradient(circle,#7c3aed_2px,transparent_2px)] [background-size:18px_18px]" />

      {/* Ondas inferiores */}
      <div
        className="
          absolute
          left-0
          bottom-0
          w-[60%]
          h-48
          pointer-events-none
          overflow-hidden
        "
      >
        <div className="absolute left-[-120px] bottom-[-80px] w-[750px] h-[260px] rounded-[50%] border-t-2 border-blue-500/30 rotate-[-8deg]" />

        <div className="absolute left-[-80px] bottom-[-60px] w-[680px] h-[230px] rounded-[50%] border-t-2 border-purple-500/30 rotate-[-3deg]" />

        <div className="absolute left-[-30px] bottom-[-40px] w-[620px] h-[200px] rounded-[50%] border-t-2 border-blue-400/30 rotate-[4deg]" />
      </div>

      <div className="relative min-h-screen grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr]">
        {/* LADO ESQUERDO */}
        <section
          className="
            hidden
            xl:flex
            items-center
            px-10
            2xl:px-16
            py-10
            relative
          "
        >
          <div
            className="
              w-full
              max-w-[900px]
              mx-auto
            "
          >
            <h1
              className="
                text-[56px]
                2xl:text-[78px]
                font-black
                leading-[0.9]
                tracking-tight
                text-[#071827]
              "
            >
              TREINAMENTO

              <span
                className="
                  block
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                "
              >
                INTELIGENTE
              </span>
            </h1>

            <h2
              className="
                mt-8
                text-xl
                2xl:text-2xl
                font-bold
                text-[#071827]
              "
            >
              Capacitação
              corporativa em{" "}
              <span className="text-blue-600">
                um único
                ambiente.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-[700px]
                text-lg
                2xl:text-xl
                leading-relaxed
                text-slate-600
              "
            >
              Aprenda,
              acompanhe
              treinamentos,
              conclua avaliações,
              emita
              certificados e
              utilize recursos
              de inteligência
              artificial em uma
              única plataforma.
            </p>

            {/* Destaques */}
            <div
              className="
                grid
                grid-cols-1
                2xl:grid-cols-3
                gap-3
                mt-7
                max-w-[760px]
              "
            >
              <FloatingBadge
                icon={Brain}
                text="Análise Inteligente"
              />

              <FloatingBadge
                icon={Bot}
                text="Aprendizado com IA"
              />

              <FloatingBadge
                icon={
                  BarChart3
                }
                text="Performance em tempo real"
              />
            </div>

            {/* Recursos */}
            <div
              className="
                grid
                grid-cols-2
                2xl:grid-cols-4
                gap-4
                mt-7
                max-w-[760px]
              "
            >
              <FeatureCard
                icon={
                  GraduationCap
                }
                title="Cursos"
                subtitle="online"
              />

              <FeatureCard
                icon={Award}
                title="Certificados"
                subtitle="digitais"
              />

              <FeatureCard
                icon={Bot}
                title="Assistente"
                subtitle="com IA"
              />

              <FeatureCard
                icon={
                  Building2
                }
                title="Gestão"
                subtitle="corporativa"
              />
            </div>
          </div>
        </section>

        {/* LADO DIREITO */}
        <section
          className="
            flex
            min-h-[100dvh]
            items-center
            justify-center
            px-3
            py-4
            sm:px-5
            sm:py-6
            lg:px-8
            xl:min-h-0
            xl:py-8
          "
        >
          <div
            className="
              w-full
              max-w-[590px]
              bg-white/95
              backdrop-blur-xl
              rounded-2xl
              sm:rounded-[30px]
              xl:rounded-[36px]
              border
              border-white
              shadow-[0_20px_60px_rgba(15,23,42,0.18)]
              sm:shadow-[0_28px_80px_rgba(15,23,42,0.22)]
             px-4
              py-5
              sm:px-7
              sm:py-7
              lg:px-9
              xl:px-10
              xl:py-8
            "
          >
            {/* Ícone */}
           <div className="flex flex-col items-center justify-center mb-5 sm:mb-6">
              <div
                className="
                 w-16
                  h-16
                  sm:w-20
                  sm:h-20
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  shadow-[0_16px_35px_rgba(37,99,235,0.28)]
                "
              >
                {loginMode ===
                "company" ? (
                  <GraduationCap
                    size={42}
                    className="text-white"
                  />
                ) : (
                  <ShieldCheck
                    size={40}
                    className="text-white"
                  />
                )}
              </div>

              <span className="mt-4 text-sm font-black tracking-[0.28em] text-slate-500 uppercase">
                {loginMode ===
                "company"
                  ? "Portal de Treinamentos"
                  : "Console SuperAdmin"}
              </span>
            </div>

            {/* ================================================= */}
            {/* SELETOR DE ACESSO                                  */}
            {/* ================================================= */}

            <div className="mb-7 rounded-2xl bg-slate-100 p-1.5 shadow-inner">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setLoginMode(
                      "company"
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    sm:text-base
                    font-bold
                    transition-all

                    ${
                      loginMode ===
                      "company"
                        ? `
                          bg-white
                          text-blue-600
                          shadow-lg
                        `
                        : `
                          text-slate-500
                          hover:text-[#071827]
                        `
                    }
                  `}
                >
                  <Building2
                    size={20}
                  />

                  Empresa
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLoginMode(
                      "platform"
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    sm:text-base
                    font-bold
                    transition-all

                    ${
                      loginMode ===
                      "platform"
                        ? `
                          bg-white
                          text-purple-600
                          shadow-lg
                        `
                        : `
                          text-slate-500
                          hover:text-[#071827]
                        `
                    }
                  `}
                >
                  <ShieldCheck
                    size={20}
                  />

                  SuperAdmin
                </button>
              </div>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#071827]">
                Acesse sua{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  conta
                </span>
              </h1>

              <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">
                {loginMode ===
                "company"
                  ? "Entre para continuar sua jornada de aprendizado."
                  : "Entre para administrar a plataforma."}
              </p>
            </div>

            <form
              onSubmit={
                handleLogin
              }
              className="space-y-6"
            >
              {/* E-MAIL */}
              <div className="flex flex-col gap-2">
                <label className="text-[#071827] font-bold">
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    size={26}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600"
                  />

                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(
                      e
                    ) =>
                      setEmail(
                        e.target
                          .value
                      )
                    }
                    className="
                      w-full
                      bg-white
                      text-[#071827]
                      placeholder:text-slate-500
                      rounded-2xl
                      pl-16
                      pr-5
                      py-5
                      outline-none
                      border
                      border-slate-200
                      focus:border-blue-500
                      focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]
                      transition-all
                      text-lg
                      shadow-xl
                      cursor-pointer
                    "
                  />
                </div>
              </div>

              {/* SENHA */}
              <div className="flex flex-col gap-2">
                <label className="text-[#071827] font-bold">
                  Senha
                </label>

                <div className="relative">
                  <Lock
                    size={26}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Digite sua senha"
                    value={
                      senha
                    }
                    onChange={(
                      e
                    ) =>
                      setSenha(
                        e.target
                          .value
                      )
                    }
                    className="
                      w-full
                      bg-white
                      text-[#071827]
                      placeholder:text-slate-500
                      rounded-2xl
                      pl-16
                      pr-16
                      py-5
                      outline-none
                      border
                      border-slate-200
                      focus:border-blue-500
                      focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]
                      transition-all
                      text-lg
                      shadow-xl
                      cursor-pointer
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-all"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={
                          25
                        }
                      />
                    ) : (
                      <Eye
                        size={
                          25
                        }
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* OPÇÕES */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setRemember(
                      !remember
                    )
                  }
                  className="flex items-center gap-3 text-[#071827] font-semibold"
                >
                  <span
                    className={`
                      w-6
                      h-6
                      rounded-md
                      border
                      flex
                      items-center
                      justify-center
                      transition-all

                      ${
                        remember
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-400 bg-white"
                      }
                    `}
                  >
                    {remember && (
                      <ShieldCheck
                        size={16}
                        className="text-white"
                      />
                    )}
                  </span>

                  Lembrar de mim
                </button>

                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-purple-600 font-semibold transition-all"
                >
                  Esqueceu a
                  senha?
                </Link>
              </div>

              {/* BOTÃO LOGIN */}
              <button
                type="submit"
                disabled={
                  loading
                }
                className="
                  w-full
                  bg-gradient-to-r
                  from-blue-500
                  to-purple-600
                  hover:from-blue-600
                  hover:to-purple-700
                  text-white
                  font-bold
                  py-5
                  rounded-2xl
                  transition-all
                  shadow-[0_16px_35px_rgba(37,99,235,0.35)]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-lg
                "
              >
                <LogIn
                  size={25}
                />

                {loading
                  ? "Entrando..."
                  : loginMode ===
                    "company"
                  ? "Entrar"
                  : "Entrar como SuperAdmin"}
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-500 pt-2">
                <ShieldCheck
                  size={20}
                  className="text-blue-600"
                />

                <span>
                  Seus dados
                  estão
                  protegidos
                  conosco.
                </span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

function FeatureCard({
  icon: Icon,
  title,
  subtitle,
}: FeatureCardProps) {
  return (
    <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white shadow-[0_16px_35px_rgba(15,23,42,0.12)] p-5 text-center">
      <Icon
        size={40}
        className="mx-auto text-purple-600"
      />

      <h3 className="font-black text-[#071827] mt-4 text-lg">
        {title}
      </h3>

      <p className="font-bold text-[#071827] text-lg">
        {subtitle}
      </p>
    </div>
  );
}

interface FloatingBadgeProps {
  icon: React.ElementType;
  text: string;
}

function FloatingBadge({
  icon: Icon,
  text,
}: FloatingBadgeProps) {
  return (
    <div
      className="
        min-h-[58px]
        bg-white/90
        backdrop-blur-xl
        border
        border-white
        rounded-2xl
        shadow-[0_12px_28px_rgba(15,23,42,0.12)]
        px-4
        py-3
        flex
        items-center
        gap-3
      "
    >
      <Icon
        size={22}
        className="
          text-purple-600
          shrink-0
        "
      />

      <span
        className="
          font-bold
          text-sm
          2xl:text-base
          text-[#071827]
          leading-tight
        "
      >
        {text}
      </span>
    </div>
  );
}