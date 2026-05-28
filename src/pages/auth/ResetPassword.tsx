import logo from "../../assets/logo.png";

import {
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

export default function ResetPassword() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) return;

    const newCode = [...code];
    newCode[index] = value[0];
    setCode(newCode);

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newCode = pastedData.split("");

    while (newCode.length < 6) {
      newCode.push("");
    }

    setCode(newCode);
  };

  return (
    <div className="min-h-screen bg-[#2E3B7B] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-[#0B2239] rounded-[24px] md:rounded-[32px] border border-[#28475F] shadow-2xl px-5 py-8 sm:px-8 sm:py-10">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Sirros logo"
            className="w-28 sm:w-36 md:w-40"
          />
        </div>

        {/* Etapa 1 */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
            Etapa 1: Digite o Código do E-mail
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
            Verifique sua caixa de entrada e spam
            <br className="hidden sm:block" />
            por um código de 6 dígitos.
          </p>
        </div>

        {/* Código */}
        <div className="mb-10">
          <label className="text-slate-300 font-medium block mb-4 text-sm sm:text-base">
            Código de 6 dígitos
          </label>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="
                  w-11 h-14
                  sm:w-14 sm:h-16
                  md:w-16 md:h-20
                  bg-[#3D4B97]
                  text-white
                  text-xl sm:text-2xl
                  text-center
                  rounded-xl sm:rounded-2xl
                  outline-none
                  border border-transparent
                  focus:border-blue-400
                  transition-all
                "
              />
            ))}
          </div>
        </div>

        {/* Linha */}
        <div className="w-full h-[2px] bg-blue-500 mb-10"></div>

        {/* Etapa 2 */}
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
            Etapa 2: Digite sua Nova Senha
          </h2>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            Agora, crie uma senha forte e segura.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5 sm:gap-6">

          {/* Nova senha */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 font-medium text-sm sm:text-base">
              Nova Senha
            </label>

            <input
              type="password"
              placeholder="Crie sua nova senha"
              className="
                bg-[#3D4B97]
                text-white
                placeholder:text-slate-300
                rounded-xl sm:rounded-2xl
                px-4 py-3
                sm:px-5 sm:py-4
                text-sm sm:text-base
                outline-none
                border border-transparent
                focus:border-blue-400
                transition-all
              "
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
              className="
                bg-[#3D4B97]
                text-white
                placeholder:text-slate-300
                rounded-xl sm:rounded-2xl
                px-4 py-3
                sm:px-5 sm:py-4
                text-sm sm:text-base
                outline-none
                border border-transparent
                focus:border-blue-400
                transition-all
              "
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="
              mt-3
              bg-blue-500
              hover:bg-blue-600
              text-white
              font-semibold
              py-3 sm:py-4
              rounded-xl sm:rounded-2xl
              transition-all
              text-sm sm:text-lg
            "
          >
            Redefinir Senha e Ir para Login
          </button>
        </form>
      </div>
    </div>
  );
}