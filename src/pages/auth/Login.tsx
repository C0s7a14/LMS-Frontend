import logo from "../../assets/logo3.png";

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
  UserPlus,
  Cpu,
  BarChart3,
} from "lucide-react";

import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Digite seu e-mail");
      return;
    }

    if (!senha.trim()) {
      toast.error("Digite sua senha");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const data = response.data;

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login feito com sucesso!");

      navigate("/home");
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao fazer login"
        );

        return;
      }

      toast.error("Erro inesperado ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white relative">
      {/* Fundo industrial fake / gradiente */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),linear-gradient(90deg,#ffffff_0%,#f8fbff_42%,rgba(15,23,42,0.08)_100%)]" />

      <div className="absolute inset-y-0 right-0 w-[55%] bg-[linear-gradient(90deg,rgba(255,255,255,0.15),rgba(15,23,42,0.35)),radial-gradient(circle_at_center,rgba(59,130,246,0.22),transparent_40%)] hidden lg:block" />

      {/* Pontos decorativos */}
      <div className="absolute left-0 top-0 w-64 h-64 opacity-40 bg-[radial-gradient(circle,#7c3aed_2px,transparent_2px)] [background-size:18px_18px]" />

      {/* Ondas inferiores */}
      <div className="absolute left-0 bottom-0 w-[60%] h-48 pointer-events-none">
        <div className="absolute left-[-120px] bottom-[-80px] w-[750px] h-[260px] rounded-[50%] border-t-2 border-blue-500/30 rotate-[-8deg]" />
        <div className="absolute left-[-80px] bottom-[-60px] w-[680px] h-[230px] rounded-[50%] border-t-2 border-purple-500/30 rotate-[-3deg]" />
        <div className="absolute left-[-30px] bottom-[-40px] w-[620px] h-[200px] rounded-[50%] border-t-2 border-blue-400/30 rotate-[4deg]" />
      </div>

      <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Lado esquerdo */}
        <section className="hidden lg:flex flex-col justify-center px-16 xl:px-24 py-12 relative">
          <div className="max-w-[720px]">          
            <h1 className="text-[86px] xl:text-[105px] font-black leading-[0.9] tracking-tight text-[#071827]">
              SIRROS
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ACADEMY
              </span>
            </h1>

            <h2 className="mt-10 text-2xl font-bold text-[#071827]">
              Treinamento inteligente para{" "}
              <span className="text-blue-600">
                dispositivos IoT.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-600">
              Capacite técnicos, acompanhe cursos, emita certificados
              e conte com suporte por IA em uma única plataforma.
            </p>

            <div className="grid grid-cols-4 gap-5 mt-10 max-w-[680px]">
              <FeatureCard
                icon={GraduationCap}
                title="Cursos"
                subtitle="técnicos"
              />

              <FeatureCard
                icon={Award}
                title="Certificados"
                subtitle="digitais"
              />

              <FeatureCard
                icon={Bot}
                title="Agente"
                subtitle="de IA"
              />

              <FeatureCard
                icon={Cpu}
                title="Dispositivos"
                subtitle="IoT"
              />
            </div>
          </div>

          {/* Cards flutuantes */}
          <FloatingBadge
            className="top-[16%] right-[12%]"
            icon={Brain}
            text="Análise Inteligente"
          />

          <FloatingBadge
            className="top-[58%] right-[4%]"
            icon={Bot}
            text="Suporte por IA"
          />

          <FloatingBadge
            className="bottom-[10%] right-[8%]"
            icon={BarChart3}
            text="Performance em tempo real"
          />
        </section>

        {/* Lado direito */}
        <section className="flex items-center justify-center px-6 py-10 lg:py-12">
          <div className="w-full max-w-[590px] bg-white/95 backdrop-blur-xl rounded-[36px] border border-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="flex justify-center mb-8">
              <img
                src={logo}
                alt="Sirros logo"
                className="w-52 object-contain"
              />
            </div>

            <div className="text-center mb-9">
              <h1 className="text-4xl lg:text-5xl font-black text-[#071827]">
                Acesse sua{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  conta
                </span>
              </h1>

              <p className="text-slate-500 mt-4 text-lg">
                Entre para continuar sua jornada de aprendizado.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-all"
                  >
                    {showPassword ? (
                      <EyeOff size={25} />
                    ) : (
                      <Eye size={25} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
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
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
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
                <LogIn size={25} />

                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-slate-500">
                  ou continue com
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                to="/register"
                className="
                  w-full
                  border
                  border-blue-500
                  hover:bg-blue-500/10
                  text-[#071827]
                  font-bold
                  py-5
                  rounded-2xl
                  transition-all
                  text-center
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-lg
                  shadow-xl
                "
              >
                <UserPlus size={25} />
                Criar conta
              </Link>

              <div className="flex items-center justify-center gap-2 text-slate-500 pt-2">
                <ShieldCheck size={20} className="text-blue-600" />
                <span>Seus dados estão protegidos conosco.</span>
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
      <Icon size={40} className="mx-auto text-purple-600" />

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
  className: string;
}

function FloatingBadge({
  icon: Icon,
  text,
  className,
}: FloatingBadgeProps) {
  return (
    <div
      className={`
        absolute
        bg-white/90
        backdrop-blur-xl
        border
        border-white
        rounded-2xl
        shadow-[0_16px_35px_rgba(15,23,42,0.16)]
        px-5
        py-4
        flex
        items-center
        gap-3
        ${className}
      `}
    >
      <Icon size={26} className="text-purple-600" />

      <span className="font-black text-[#071827]">
        {text}
      </span>
    </div>
  );
}