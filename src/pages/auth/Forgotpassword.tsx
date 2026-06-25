import logo from "../../assets/logo.png";

import {
  Link
} from "react-router-dom";

import {
  useState
} from "react";

import { api } from "../../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleForgotPassword(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

   await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

      toast.success(
        "Email de recuperação enviado!"
      );

    } catch (error: any) {

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message
        || "Erro ao enviar email"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="min-h-screen bg-[#2E3B7B] flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#0B2239] rounded-[30px] px-8 py-10 shadow-2xl">

        {/* logo */}
        <div className="flex justify-center mb-10">

          <img
            src={logo}
            alt="Sirros logo"
            className="w-40"
          />

        </div>

        {/* Título */}
        <div className="text-center mb-10">

          <h1 className="text-white text-2xl font-bold mb-3">
            Recuperação de Senha
          </h1>

          <p className="text-gray-400">
            Digite seu e-mail para receber as instruções
          </p>

        </div>

        {/* Formulário */}
        <form
          onSubmit={handleForgotPassword}
          className="flex flex-col gap-6"
        >

          {/* EMAIL */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium">
              Email
            </label>

            <input
              type="email"

              placeholder="Digite seu e-mail"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* Botões */}
          <div className="flex flex-col gap-5 mt-4">

            <button
              type="submit"

              disabled={loading}

              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all"
            >

              {loading
                ? "Enviando..."
                : "Enviar E-mail de Recuperação"}

            </button>

            <Link
              to="/"

              className="w-full border border-[#28475F] hover:bg-[#132D49] text-white font-semibold py-4 rounded-2xl transition-all text-center block"
            >

              Voltar para Login

            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}