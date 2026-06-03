import logo from "../../assets/logo.png";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:3333/auth/login",
        {
          email,
          senha,
        }
      );

      const data = response.data;

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
        JSON.stringify(data.user)
      );

      alert("Login realizado com sucesso!");

      navigate("/home");

    } catch (error: any) {

      alert(
        error.response?.data?.error ||
        "Erro ao fazer login"
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
          onSubmit={handleLogin}
          className="flex flex-col gap-6"
        >

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

          {/* botoes */}
          <div className="flex flex-col gap-5 mt-4">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all"
            >

              {loading
                ? "Entrando..."
                : "Entrar"}

            </button>

            <Link
              to="/register"
              className="w-full border border-[#28475F] hover:bg-[#132D49] text-white font-semibold py-4 rounded-2xl transition-all text-center block"
            >

              Criar Conta

            </Link>

          </div>

          {/* esqueceu senha */}
          <div className="flex justify-center">

            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-all hover:cursor-pointer"
            >

              Esqueceu a senha?

            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}