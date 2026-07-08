import logo from "../../assets/logo_sirros_roxa_transparente(1).png";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import { api } from "../../services/api";

import toast from "react-hot-toast";

export default function Registro() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (senha !== confirmarSenha) {

      toast.error("As senhas não coincidem");

      return;
    }

    try {

      setLoading(true);

          await api.post(
        "/auth/register",
        {
          name,
          email,
          senha,
          role: "student",
        }
      );

      toast.success("Conta criada com sucesso!");

      navigate("/");

    } catch (error: any) {

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao criar conta"
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

        {/* titulo */}
        <div className="text-center mb-10">

          <h1 className="text-white text-2xl font-bold mb-3">

            Acesse sua plataforma de treinamento IoT

          </h1>

        </div>

        {/* formulario */}
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-6"
        >

          {/* nome */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium">
              Nome
            </label>

            <input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* email */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* senha */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium">
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* confirmar senha */}
          <div className="flex flex-col gap-2">

            <label className="text-slate-300 font-medium">
              Confirme sua senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha novamente"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(e.target.value)
              }
              className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />

          </div>

          {/* botoes */}
          <div className="flex flex-col gap-5 mt-4">

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all"
            >

              {loading
                ? "Criando conta..."
                : "Criar conta"}

            </button>

            <Link
              to="/"
              className="w-full border border-[#28475F] hover:bg-[#132D49] text-white font-semibold py-4 rounded-2xl transition-all text-center block"
            >

              Já tenho conta

            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}