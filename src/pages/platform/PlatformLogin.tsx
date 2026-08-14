import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  usePlatformAuth,
} from "../../contexts/PlatformAuthContext";

export default function PlatformLogin() {
  const navigate =
    useNavigate();

  const {
    login,
    isAuthenticated,
    loading: authLoading,
  } = usePlatformAuth();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  /**
   * Caso o usuário já possua
   * sessão Platform válida,
   * não faz sentido permanecer
   * na tela de login.
   */
  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated
    ) {
      navigate(
        "/platform/dashboard",
        {
          replace: true,
        }
      );
    }
  }, [
    authLoading,
    isAuthenticated,
    navigate,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Informe seu e-mail."
      );

      return;
    }

    if (!senha) {
      setError(
        "Informe sua senha."
      );

      return;
    }

    try {
      setLoading(true);

      await login({
        email:
          normalizedEmail,

        senha,
      });

      navigate(
        "/platform/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        const message =
          error.response?.data
            ?.error ||
          error.response?.data
            ?.message;

        setError(
          message ||
            "Não foi possível entrar na plataforma."
        );

        return;
      }

      setError(
        "Não foi possível entrar na plataforma."
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Enquanto o contexto verifica
   * uma sessão salva, evitamos
   * mostrar o formulário rapidamente.
   */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <span className="text-sm font-medium text-slate-500">
            Verificando sessão...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/platform/dashboard"
        replace
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* efeitos decorativos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize:
              "52px 52px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* lado institucional */}
          <section className="relative hidden min-h-[690px] overflow-hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-28 top-20 h-72 w-72 rounded-full border border-white/10" />

              <div className="absolute -right-10 top-40 h-72 w-72 rounded-full border border-white/[0.06]" />

              <div className="absolute bottom-16 left-12 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl" />
            </div>

            <div className="relative">
              <div className="mb-14 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5L12 4l8 4.5-8 4.5-8-4.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M7 11v4.5c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5V11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-base font-bold tracking-tight">
                    Sirros Academy
                  </p>

                  <p className="text-xs font-medium text-slate-400">
                    Administração da plataforma
                  </p>
                </div>
              </div>

              <div className="max-w-lg">
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-300">
                  Console SuperAdmin
                </span>

                <h1 className="mt-6 text-4xl font-bold tracking-tight xl:text-5xl xl:leading-[1.08]">
                  Gestão centralizada da plataforma.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                  Controle empresas, administradores,
                  identidade visual e acompanhe os
                  principais indicadores do ambiente em
                  um único painel.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium text-slate-400">
                  Empresas
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Gestão global
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium text-slate-400">
                  Acessos
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Separados
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-medium text-slate-400">
                  Ambiente
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Plataforma
                </p>
              </div>
            </div>
          </section>

          {/* formulário */}
          <section className="flex min-h-[620px] items-center bg-white p-6 sm:p-10 lg:min-h-[690px] lg:p-12 xl:p-16">
            <div className="mx-auto w-full max-w-md">
              {/* marca mobile */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5L12 4l8 4.5-8 4.5-8-4.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M7 11v4.5c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5V11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-bold text-slate-950">
                    Sirros Academy
                  </p>

                  <p className="text-xs text-slate-500">
                    Console SuperAdmin
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Acesso administrativo
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Entre na plataforma
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Utilize uma conta autorizada como
                  SuperAdmin.
                </p>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-9 space-y-5"
              >
                <div>
                  <label
                    htmlFor="platform-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    E-mail
                  </label>

                  <input
                    id="platform-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value
                      );

                      if (error) {
                        setError(null);
                      }
                    }}
                    placeholder="voce@empresa.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="platform-password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </label>

                  <div className="relative">
                    <input
                      id="platform-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      value={senha}
                      onChange={(event) => {
                        setSenha(
                          event.target.value
                        );

                        if (error) {
                          setError(null);
                        }
                      }}
                      placeholder="Digite sua senha"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                    >
                      {showPassword
                        ? "Ocultar"
                        : "Mostrar"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Entrando..."
                    : "Entrar no painel"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-xs leading-5 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2M6 10h12v10H6V10Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Área restrita aos administradores da
                  plataforma.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}