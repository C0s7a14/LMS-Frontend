import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import {
  AlertCircle,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Cpu,
  FileText,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

interface ChatMessage {
  id: number;
  type: "user" | "ai";
  text: string;
}

const quickActions = [
  {
    icon: Cpu,
    title: "Analisar dispositivos",
    subtitle: "Verificar status dos equipamentos",
  },
  {
    icon: AlertCircle,
    title: "Ver alertas ativos",
    subtitle: "Consultar possíveis problemas",
  },
  {
    icon: BarChart3,
    title: "Relatório de desempenho",
    subtitle: "Resumo operacional dos dispositivos",
  },
  {
    icon: ShieldCheck,
    title: "Otimizar rede",
    subtitle: "Sugestões de melhoria",
  },
];

const suggestions = [
  "Quais dispositivos estão offline?",
  "Como está o consumo dos dispositivos?",
  "Mostre os alertas ativos",
  "Relatório de desempenho mensal",
  "Quais dispositivos precisam de manutenção?",
];

export default function Support() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai",
      text: "Olá! Eu sou o agente de IA da Sirros. Posso ajudar com dúvidas sobre dispositivos, instalação, configuração, alertas e relatórios.",
    },
  ]);

  function handleSuggestionClick(question: string) {
    setMessage(question);
  }

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Digite uma pergunta antes de enviar");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: "Essa é uma resposta simulada do agente de IA. Depois vamos conectar essa tela com o backend e com a IA usando a documentação dos dispositivos da Sirros.",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 900);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-80 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 px-4 py-2 font-semibold text-sm mb-5">
                <Sparkles size={18} />
                Versão Agente de IA
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-[#080E2F] dark:text-white leading-tight">
                Olá, sou o seu Agente de IA!
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg lg:text-xl max-w-3xl">
                Estou aqui para analisar, responder e ajudar você com dúvidas sobre dispositivos, configuração, instalação e suporte técnico.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />

                <div className="relative w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-white to-blue-100 dark:from-[#10263d] dark:to-[#0d2238] border border-blue-500/20 shadow-2xl flex items-center justify-center">
                  <div className="w-36 h-28 rounded-[2rem] bg-[#071827] flex flex-col items-center justify-center shadow-xl">
                    <div className="flex gap-6">
                      <div className="w-6 h-6 rounded-full bg-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.9)]" />
                      <div className="w-6 h-6 rounded-full bg-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.9)]" />
                    </div>

                    <div className="w-12 h-5 border-b-4 border-blue-400 rounded-full mt-3" />
                  </div>

                  <div className="absolute -top-4 w-6 h-12 rounded-full bg-blue-200 dark:bg-blue-500/30" />
                  <div className="absolute -left-4 w-8 h-20 rounded-full bg-blue-100 dark:bg-blue-500/20" />
                  <div className="absolute -right-4 w-8 h-20 rounded-full bg-blue-100 dark:bg-blue-500/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards principais */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5">
              <Brain size={30} />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Análise Inteligente
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Analiso informações e identifico padrões para auxiliar no suporte.
            </p>
          </div>

          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5">
              <Zap size={30} />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Respostas Rápidas
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Ajudo com dúvidas técnicas, instalação, configuração e operação.
            </p>
          </div>

          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5">
              <MessageCircle size={30} />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Suporte Contínuo
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Um canal de apoio para usuários, técnicos e clientes da plataforma.
            </p>
          </div>
        </section>

        {/* Ações rápidas */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                onClick={() =>
                  toast.error("Essa ação será conectada depois.")
                }
                className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-left flex items-center gap-4 shadow-xl dark:shadow-sm dark:shadow-blue-500/30 hover:-translate-y-1 hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Icon size={24} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-[#080E2F] dark:text-white truncate">
                    {action.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          {/* Chat */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                <Bot size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  Conversa com o Agente
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Faça perguntas sobre dispositivos e suporte técnico.
                </p>
              </div>
            </div>

            <div className="h-[430px] overflow-y-auto pr-2 space-y-4">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 ${
                    item.type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.type === "ai" && (
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Bot size={22} />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[80%]
                      rounded-2xl
                      px-5
                      py-4
                      leading-relaxed
                      ${
                        item.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-50 dark:bg-[#0d2238] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                      }
                    `}
                  >
                    {item.text}
                  </div>

                  {item.type === "user" && (
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#0d2238] text-gray-500 dark:text-gray-300 flex items-center justify-center shrink-0">
                      <UserRound size={22} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                    <Bot size={22} />
                  </div>

                  <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Pensando...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="mt-5 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua pergunta ou solicitação..."
                className="flex-1 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-all shadow-xl dark:shadow-sm dark:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={22} />
                Enviar
              </button>
            </form>
          </section>

          {/* Sugestões */}
          <aside className="space-y-6">
            <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Sugestões de perguntas
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Clique em uma sugestão para preencher o chat.
              </p>

              <div className="mt-5 space-y-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all flex items-center gap-3"
                  >
                    <MessageCircle size={20} />
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Status do agente
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    Chat visual
                  </span>

                  <span className="flex items-center gap-2 text-green-500 font-semibold">
                    <CheckCircle2 size={18} />
                    Ativo
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    Backend IA
                  </span>

                  <span className="text-yellow-500 font-semibold">
                    Em breve
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    Base de manuais
                  </span>

                  <span className="text-yellow-500 font-semibold">
                    Em breve
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Esta tela já está pronta visualmente. Depois vamos conectar com a IA e com os manuais dos dispositivos.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}