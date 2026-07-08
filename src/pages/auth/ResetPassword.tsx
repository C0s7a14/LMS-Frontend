import logo from "../../assets/logo_sirros_roxa_transparente(1).png";



import { useState } from "react";
import toast from "react-hot-toast";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { api } from "../../services/api";

export default function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");
    //console.log(token);

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleResetPassword(

    
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (
      newPassword !== confirmPassword
    ) {

      toast.error(
        "As senhas não coincidem"
      );

      return;
    }

    try {

      setLoading(true);

     await api.post(
  "/auth/reset-password",
  {
    token,
    newPassword,
  }
);
      toast.success(
        "Senha redefinida com sucesso!"
      );

      navigate("/");

    } catch (error: any) {

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message
        || "Erro ao redefinir senha"
      );

    } finally {

      setLoading(false);

    }


  }

  return (
    <div className="min-h-screen bg-[#2E3B7B] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-2xl bg-[#0B2239] rounded-3xl border border-[#28475F] shadow-2xl px-5 py-8 sm:px-8 sm:py-10">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Sirros logo"
            className="w-28 sm:w-36 md:w-52 fill-pink-700"
          />
        </div>

        {/* Título */}
        <div className="text-center mb-8">

          <h1 className="text-white text-2xl sm:text-3xl md:text-3xl font-bold leading-tight mb-4">
            Redefinir Senha
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            Digite sua nova senha abaixo.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleResetPassword}
          className="flex flex-col gap-5 sm:gap-6"
        >

          {/* Nova senha */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium text-sm sm:text-base">
              Nova Senha
            </label>

            <input
              type="password"
              placeholder="Crie sua nova senha"

              value={newPassword}

              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }

              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* Confirmar senha */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium text-sm sm:text-base">
              Confirmar Senha
            </label>

            <input
              type="password"
              placeholder="Repita a nova senha"

              value={confirmPassword}

              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }

              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* Botão */}
          <button
            type="submit"

            disabled={loading}

            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all"
          >

            {loading
              ? "Redefinindo..."
              : "Redefinir senha"}

          </button>

        </form>

      </div>

    </div>
  );
}