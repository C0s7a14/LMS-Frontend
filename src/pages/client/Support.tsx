import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import {
  Bot,
  BotMessageSquare,
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
  Wifi,
  Wrench,
} from "lucide-react";

import {
  useCompany,
} from "../../contexts/CompanyContext";

interface DeviceType {
  id: number;
  nome: string;

  modelo?: string | null;
  tipo?: string | null;
  descricao?: string | null;
  imagem_url?: string | null;
}

interface ChatSource {
  documento_id: number;
  documento_titulo: string;
  nome_arquivo_original: string;

  pagina: number | null;

  chunk_index: number;
}

interface ChatMessage {
  id: number;

  type:
    | "user"
    | "ai";

  text: string;

  sources?: ChatSource[];
}

interface AiConversation {
  id: number;
  usuario_id: number;
  dispositivo_id: number;

  dispositivo_nome: string;

  titulo: string;

  criado_em: string;
  atualizado_em: string;
}

interface AiChatResponse {
  conversa_id: number;
  resposta: string;
  fontes: ChatSource[];
}

interface QuickAction {
  icon: typeof Cpu;
  title: string;
  subtitle: string;
  question: string;
}

export default function Support() {
  const {
    company,
  } = useCompany();

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingInitialData,
    setLoadingInitialData,
  ] = useState(true);

  const [
    devices,
    setDevices,
  ] =
    useState<DeviceType[]>(
      [],
    );

  const [
    selectedDeviceId,
    setSelectedDeviceId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    currentConversationId,
    setCurrentConversationId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    messages,
    setMessages,
  ] =
    useState<ChatMessage[]>(
      [
        {
          id: 1,

          type: "ai",

          text:
            "Olá! Sou o agente técnico de IA. Selecione um dispositivo e faça uma pergunta para consultar a documentação técnica vinculada a ele.",
        },
      ],
    );

  const environmentName =
    company?.configuracao
      ?.nomeAmbiente ||
    company?.nomeFantasia ||
    "Plataforma de Treinamento";

  const selectedDevice =
    useMemo(
      () =>
        devices.find(
          (
            device,
          ) =>
            device.id ===
            selectedDeviceId,
        ) || null,
      [
        devices,
        selectedDeviceId,
      ],
    );

  const suggestions =
    useMemo(() => {
      const deviceName =
        selectedDevice?.nome ||
        "dispositivo";

      return [
        `Como instalar o ${deviceName}?`,

        `Como fazer a configuração inicial do ${deviceName}?`,

        `Quais são os LEDs e indicadores do ${deviceName}?`,

        `Quais requisitos de rede são necessários para o ${deviceName}?`,

        `Quais cuidados de operação e manutenção devo ter com o ${deviceName}?`,
      ];
    }, [
      selectedDevice,
    ]);

  const quickActions:
    QuickAction[] =
    useMemo(() => {
      const deviceName =
        selectedDevice?.nome ||
        "dispositivo";

      return [
        {
          icon: Wrench,

          title:
            "Instalação",

          subtitle:
            "Consultar procedimentos",

          question:
            `Como instalar corretamente o ${deviceName}?`,
        },

        {
          icon: Cpu,

          title:
            "Configuração",

          subtitle:
            "Consultar parâmetros",

          question:
            `Como configurar corretamente o ${deviceName}?`,
        },

        {
          icon: Wifi,

          title:
            "Rede",

          subtitle:
            "Consultar requisitos",

          question:
            `Quais são os requisitos de rede para o ${deviceName}?`,
        },

        {
          icon: ShieldCheck,

          title:
            "Diagnóstico",

          subtitle:
            "Consultar problemas comuns",

          question:
            `Quais são os problemas mais comuns do ${deviceName} e como diagnosticá-los?`,
        },
      ];
    }, [
      selectedDevice,
    ]);

  useEffect(() => {
    void loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoadingInitialData(
        true,
      );

      const token =
        localStorage.getItem(
          "token",
        );

      if (!token) {
        toast.error(
          "Sessão expirada. Faça login novamente.",
        );

        return;
      }

      const config = {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };

      /*
        A consulta de conversas foi
        mantida porque já faz parte
        do fluxo existente, embora
        o histórico ainda não esteja
        sendo exibido nesta tela.
      */
      const [
        devicesResponse,
      ] =
        await Promise.all([
          axios.get<
            DeviceType[]
          >(
            "http://localhost:3333/client/devices",
            config,
          ),

          axios.get<
            AiConversation[]
          >(
            "http://localhost:3333/client/ai/conversations",
            config,
          ),
        ]);

      setDevices(
        devicesResponse.data,
      );

      /*
        Preserva o dispositivo
        atualmente selecionado.

        Isso evita voltar para o
        primeiro dispositivo após
        uma atualização dos dados.
      */
      setSelectedDeviceId(
        (
          currentDeviceId,
        ) => {
          const currentStillExists =
            currentDeviceId &&
            devicesResponse.data.some(
              (
                device,
              ) =>
                device.id ===
                currentDeviceId,
            );

          if (
            currentStillExists
          ) {
            return currentDeviceId;
          }

          return (
            devicesResponse
              .data[0]?.id ||
            null
          );
        },
      );
    } catch (error) {
      console.log(
        error,
      );

      toast.error(
        "Erro ao carregar dados do suporte IA.",
      );
    } finally {
      setLoadingInitialData(
        false,
      );
    }
  }

  function handleSuggestionClick(
    question: string,
  ) {
    setMessage(
      question,
    );
  }

  function handleQuickAction(
    question: string,
  ) {
    setMessage(
      question,
    );
  }

  function handleDeviceChange(
    deviceId: number,
  ) {
    setSelectedDeviceId(
      deviceId,
    );

    setCurrentConversationId(
      null,
    );

    const device =
      devices.find(
        (
          item,
        ) =>
          item.id ===
          deviceId,
      );

    setMessages([
      {
        id: Date.now(),

        type: "ai",

        text: device
          ? `Dispositivo selecionado: ${device.nome}. Faça uma pergunta para consultar a base técnica vinculada a ele.`
          : "Selecione um dispositivo para iniciar a consulta técnica.",
      },
    ]);
  }

  async function handleSendMessage(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      !message.trim()
    ) {
      toast.error(
        "Digite uma pergunta antes de enviar",
      );

      return;
    }

    if (
      !selectedDeviceId
    ) {
      toast.error(
        "Selecione um dispositivo antes de perguntar.",
      );

      return;
    }

    const question =
      message.trim();

    const userMessage:
      ChatMessage = {
      id: Date.now(),

      type: "user",

      text: question,
    };

    setMessages(
      (
        previous,
      ) => [
        ...previous,
        userMessage,
      ],
    );

    setMessage("");

    setLoading(true);

    try {
      const token =
        localStorage.getItem(
          "token",
        );

      if (!token) {
        toast.error(
          "Sessão expirada. Faça login novamente.",
        );

        return;
      }

      const response =
        await axios.post<AiChatResponse>(
          "http://localhost:3333/client/ai/chat",
          {
            dispositivo_id:
              selectedDeviceId,

            pergunta:
              question,

            conversa_id:
              currentConversationId,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setCurrentConversationId(
        response.data
          .conversa_id,
      );

      const aiMessage:
        ChatMessage = {
        id:
          Date.now() + 1,

        type: "ai",

        text:
          response.data
            .resposta,

        sources:
          response.data
            .fontes,
      };

      setMessages(
        (
          previous,
        ) => [
          ...previous,
          aiMessage,
        ],
      );

      /*
        Não recarregamos todos
        os dados aqui.

        O código anterior chamava
        loadInitialData(), o que
        poderia trocar o dispositivo
        selecionado depois de cada
        resposta.
      */
    } catch (error) {
      console.log(
        error,
      );

      const errorMessage:
        ChatMessage = {
        id:
          Date.now() + 1,

        type: "ai",

        text:
          "Não consegui responder agora. Tente novamente em alguns instantes.",
      };

      setMessages(
        (
          previous,
        ) => [
          ...previous,
          errorMessage,
        ],
      );

      toast.error(
        "Erro ao enviar pergunta para o agente IA.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <section
        className="
          relative

          overflow-hidden

          rounded-2xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#091a2c]

          p-4
          sm:p-6
          lg:p-8

          shadow-2xl
          dark:shadow-sm
        "
      >
        {/* FUNDO */}
        <div
          className="
            absolute
            inset-0

            pointer-events-none
          "
        >
          <div
            className="
              absolute

              -top-24
              right-0

              w-72
              h-72

              rounded-full

              bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

              blur-3xl
            "
          />

          <div
            className="
              absolute

              bottom-0
              left-1/3

              w-80
              h-32

              rounded-full

              bg-[color-mix(in_srgb,var(--company-secondary)_8%,transparent)]

              blur-3xl
            "
          />
        </div>

        <div
          className="
            relative

            grid
            grid-cols-1

            gap-6
            lg:gap-8

            xl:grid-cols-[minmax(0,1fr)_300px]

            items-center
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-4
                sm:mb-5

                inline-flex
                items-center

                gap-2

                rounded-full

                border
                border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                px-4
                py-2

                text-sm
                font-semibold

                text-[var(--company-primary)]
              "
            >
              <Sparkles
                size={18}
              />

              Agente técnico de IA
            </div>

            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                2xl:text-5xl

                font-bold

                text-[#080E2F]
                dark:text-white

                leading-tight
              "
            >
              Suporte técnico
              inteligente
            </h1>

            <p
              className="
                mt-3
                sm:mt-4

                max-w-3xl

                text-sm
                sm:text-base
                lg:text-lg

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              Consulte o agente
              técnico sobre instalação,
              configuração, operação e
              documentação dos
              dispositivos vinculados à
              sua empresa.
            </p>

            <div
              className="
                mt-4

                inline-flex
                items-center

                gap-2

                text-sm
                font-medium

                text-[var(--company-primary)]
              "
            >
              <ShieldCheck
                size={18}
              />

              {environmentName}
            </div>
          </div>

          {/* REPRESENTAÇÃO DO AGENTE */}
          <div
            className="
              hidden
              xl:flex

              justify-center
            "
          >
            <div
              className="
                relative

                w-52
                h-52
              "
            >
              <div
                className="
                  absolute
                  inset-0

                  rounded-full

                  bg-[color-mix(in_srgb,var(--company-primary)_14%,transparent)]

                  blur-3xl
                "
              />

              <div
                className="
                  relative

                  w-full
                  h-full

                  rounded-full

                  border
                  border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                  bg-gradient-to-br
                  from-white
                  to-gray-100

                  dark:from-[#10263d]
                  dark:to-[#0d2238]

                  flex
                  items-center
                  justify-center

                  shadow-2xl
                "
              >
                <div
                  className="
                    w-32
                    h-24

                    rounded-[2rem]

                    bg-[#071827]

                    flex
                    flex-col
                    items-center
                    justify-center

                    shadow-xl
                  "
                >
                  <div
                    className="
                      flex

                      gap-6
                    "
                  >
                    <div
                      className="
                        w-5
                        h-5

                        rounded-full

                        bg-[var(--company-primary)]
                      "
                    />

                    <div
                      className="
                        w-5
                        h-5

                        rounded-full

                        bg-[var(--company-primary)]
                      "
                    />
                  </div>

                  <div
                    className="
                      mt-3

                      w-11
                      h-5

                      rounded-full

                      border-b-4
                      border-[var(--company-primary)]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO O AGENTE AJUDA */}
      <section
        className="
          grid
          grid-cols-1

          md:grid-cols-3

          gap-4
          sm:gap-5
        "
      >
        <FeatureCard
          icon={Brain}
          title="Base técnica"
          description="Consulta a documentação cadastrada e vinculada ao dispositivo selecionado."
        />

        <FeatureCard
          icon={Cpu}
          title="Contexto por dispositivo"
          description="Cada pergunta é enviada utilizando o dispositivo escolhido como contexto técnico."
        />

        <FeatureCard
          icon={FileText}
          title="Fontes consultadas"
          description="Quando disponíveis, as referências utilizadas pelo agente são exibidas junto à resposta."
        />
      </section>

      {/* AÇÕES RÁPIDAS */}
      <section>
        <div
          className="
            mb-4

            flex
            flex-col

            gap-1
          "
        >
          <h2
            className="
              text-lg
              sm:text-xl

              font-bold

              text-[#080E2F]
              dark:text-white
            "
          >
            Consultas rápidas
          </h2>

          <p
            className="
              text-sm

              text-gray-500
              dark:text-gray-400
            "
          >
            Use uma consulta como
            ponto de partida para
            conversar com o agente.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1

            sm:grid-cols-2
            2xl:grid-cols-4

            gap-4
          "
        >
          {quickActions.map(
            (
              action,
            ) => {
              const Icon =
                action.icon;

              return (
                <button
                  key={
                    action.title
                  }
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      action.question,
                    )
                  }
                  disabled={
                    !selectedDevice
                  }
                  className="
                    min-w-0

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-white
                    dark:bg-[#091a2c]

                    p-4
                    sm:p-5

                    text-left

                    flex
                    items-center

                    gap-4

                    shadow-xl
                    dark:shadow-sm

                    transition-all

                    hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  <div
                    className="
                      w-11
                      h-11

                      sm:w-12
                      sm:h-12

                      rounded-xl

                      bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                      text-[var(--company-primary)]

                      flex
                      items-center
                      justify-center

                      shrink-0
                    "
                  >
                    <Icon
                      size={23}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        font-bold

                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {
                        action.title
                      }
                    </h3>

                    <p
                      className="
                        mt-1

                        text-sm

                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {
                        action.subtitle
                      }
                    </p>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </section>

      {/* CHAT + LATERAL */}
      <div
        className="
          grid
          grid-cols-1

          gap-6

          xl:grid-cols-[minmax(0,1fr)_360px]

          2xl:grid-cols-[minmax(0,1fr)_400px]
        "
      >
        {/* CHAT */}
        <section
          className="
            min-w-0

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-4
            sm:p-5
            lg:p-6

            shadow-2xl
            dark:shadow-sm
          "
        >
          {/* HEADER DO CHAT */}
          <div
            className="
              mb-5
              sm:mb-6

              flex
              flex-col

              gap-4

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                min-w-0

                flex
                items-start

                gap-3
              "
            >
              <div
                className="
                  w-11
                  h-11

                  sm:w-12
                  sm:h-12

                  rounded-2xl

                  bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                  text-[var(--company-primary)]

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <Bot
                  size={27}
                />
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-lg
                    sm:text-xl

                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Conversa com o agente
                </h2>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Selecione o
                  dispositivo que deve
                  ser usado como
                  contexto.
                </p>
              </div>
            </div>

            {/* SELECT DISPOSITIVO */}
            <div
              className="
                w-full

                lg:w-[300px]

                shrink-0
              "
            >
              <label
                className="
                  mb-2

                  block

                  text-xs
                  font-semibold

                  uppercase
                  tracking-wide

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Dispositivo
              </label>

              <select
                value={
                  selectedDeviceId ??
                  ""
                }
                onChange={(
                  event,
                ) =>
                  handleDeviceChange(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                disabled={
                  loadingInitialData ||
                  devices.length ===
                    0
                }
                className="
                  w-full

                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/10

                  bg-gray-50
                  dark:bg-[#0d2238]

                  px-4
                  py-3

                  text-[#080E2F]
                  dark:text-white

                  outline-none

                  shadow-xl
                  dark:shadow-sm

                  transition-all

                  focus:border-[var(--company-primary)]

                  focus:ring-4
                  focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                  disabled:opacity-60
                "
              >
                {devices.length ===
                0 ? (
                  <option value="">
                    Nenhum dispositivo
                    disponível
                  </option>
                ) : (
                  devices.map(
                    (
                      device,
                    ) => (
                      <option
                        key={
                          device.id
                        }
                        value={
                          device.id
                        }
                      >
                        {
                          device.nome
                        }
                        {device.modelo
                          ? ` — ${device.modelo}`
                          : ""}
                      </option>
                    ),
                  )
                )}
              </select>
            </div>
          </div>

          {/* SEM DISPOSITIVO */}
          {!loadingInitialData &&
            devices.length ===
              0 && (
              <div
                className="
                  mb-5

                  rounded-2xl

                  border
                  border-yellow-200
                  dark:border-yellow-800

                  bg-yellow-50
                  dark:bg-yellow-950/20

                  p-4

                  flex
                  items-start

                  gap-3
                "
              >
                <Cpu
                  size={21}
                  className="
                    mt-0.5

                    shrink-0

                    text-yellow-600
                    dark:text-yellow-400
                  "
                />

                <div>
                  <h3
                    className="
                      font-bold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Nenhum dispositivo
                    vinculado
                  </h3>

                  <p
                    className="
                      mt-1

                      text-sm

                      text-gray-600
                      dark:text-gray-400
                    "
                  >
                    O agente técnico
                    precisa de um
                    dispositivo
                    vinculado à sua
                    conta para consultar
                    a base documental.
                  </p>
                </div>
              </div>
            )}

          {/* MENSAGENS */}
          <div
            className="
              h-[480px]

              sm:h-[540px]
              lg:h-[580px]

              overflow-y-auto

              pr-1
              sm:pr-2

              space-y-4
            "
          >
            {messages.map(
              (
                item,
              ) => (
                <div
                  key={
                    item.id
                  }
                  className={`
                    flex

                    gap-2
                    sm:gap-3

                    ${
                      item.type ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >
                  {/* ÍCONE IA */}
                  {item.type ===
                    "ai" && (
                    <div
                      className="
                        w-9
                        h-9

                        sm:w-10
                        sm:h-10

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        text-[var(--company-primary)]

                        flex
                        items-center
                        justify-center

                        shrink-0
                      "
                    >
                      <Bot
                        size={21}
                      />
                    </div>
                  )}

                  {/* BALÃO */}
                  <div
                    className={`
                      max-w-[88%]

                      sm:max-w-[80%]

                      rounded-2xl

                      px-4
                      py-3

                      sm:px-5
                      sm:py-4

                      text-sm
                      sm:text-base

                      leading-relaxed

                      shadow-lg
                      dark:shadow-sm

                      ${
                        item.type ===
                        "user"
                          ? `
                              bg-gradient-to-br
                              from-[var(--company-primary)]
                              to-[var(--company-secondary)]

                              text-white
                            `
                          : `
                              border
                              border-gray-200
                              dark:border-white/10

                              bg-gray-50
                              dark:bg-[#0d2238]

                              text-gray-600
                              dark:text-gray-300
                            `
                      }
                    `}
                  >
                    <p
                      className="
                        whitespace-pre-line
                        break-words
                      "
                    >
                      {
                        item.text
                      }
                    </p>

                    {/* FONTES */}
                    {item.type ===
                      "ai" &&
                      item.sources &&
                      item.sources
                        .length >
                        0 && (
                        <div
                          className="
                            mt-4

                            border-t
                            border-gray-200
                            dark:border-white/10

                            pt-3
                          "
                        >
                          <p
                            className="
                              mb-2

                              text-xs
                              font-bold

                              uppercase
                              tracking-wide

                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Fontes
                            consultadas
                          </p>

                          <div className="space-y-2">
                            {item.sources
                              .slice(
                                0,
                                3,
                              )
                              .map(
                                (
                                  source,
                                  index,
                                ) => (
                                  <div
                                    key={`${source.documento_id}-${source.chunk_index}-${index}`}
                                    className="
                                      rounded-xl

                                      border
                                      border-gray-200
                                      dark:border-white/10

                                      bg-white/70
                                      dark:bg-white/5

                                      px-3
                                      py-2

                                      text-xs

                                      text-gray-500
                                      dark:text-gray-400
                                    "
                                  >
                                    <strong
                                      className="
                                        block

                                        text-gray-700
                                        dark:text-gray-200

                                        break-words
                                      "
                                    >
                                      {
                                        source.documento_titulo
                                      }
                                    </strong>

                                    <span
                                      className="
                                        mt-1

                                        block

                                        break-all
                                      "
                                    >
                                      {
                                        source.nome_arquivo_original
                                      }
                                    </span>

                                    {source.pagina !==
                                      null && (
                                      <span
                                        className="
                                          mt-1

                                          block

                                          text-[var(--company-primary)]
                                        "
                                      >
                                        Página{" "}
                                        {
                                          source.pagina
                                        }
                                      </span>
                                    )}
                                  </div>
                                ),
                              )}

                            {item.sources
                              .length >
                              3 && (
                              <p
                                className="
                                  mt-2

                                  text-xs

                                  text-gray-400
                                  dark:text-gray-500
                                "
                              >
                                +
                                {item
                                  .sources
                                  .length -
                                  3}{" "}
                                fontes
                                adicionais
                                consultadas.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* ÍCONE USUÁRIO */}
                  {item.type ===
                    "user" && (
                    <div
                      className="
                        w-9
                        h-9

                        sm:w-10
                        sm:h-10

                        rounded-xl

                        bg-gray-100
                        dark:bg-[#0d2238]

                        text-gray-500
                        dark:text-gray-300

                        flex
                        items-center
                        justify-center

                        shrink-0
                      "
                    >
                      <UserRound
                        size={21}
                      />
                    </div>
                  )}
                </div>
              ),
            )}

            {/* PENSANDO */}
            {loading && (
              <div
                className="
                  flex
                  items-center

                  gap-3
                "
              >
                <div
                  className="
                    w-10
                    h-10

                    rounded-xl

                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                    text-[var(--company-primary)]

                    flex
                    items-center
                    justify-center
                  "
                >
                  <Bot
                    size={22}
                  />
                </div>

                <div
                  className="
                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-[#0d2238]

                    px-5
                    py-4

                    flex
                    items-center

                    gap-2

                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  <Loader2
                    size={18}
                    className="
                      animate-spin

                      text-[var(--company-primary)]
                    "
                  />

                  Consultando base
                  técnica...
                </div>
              </div>
            )}
          </div>

          {/* ENVIO */}
          <form
            onSubmit={
              handleSendMessage
            }
            className="
              mt-5

              flex
              flex-col

              gap-3

              sm:flex-row
            "
          >
            <input
              type="text"
              value={
                message
              }
              onChange={(
                event,
              ) =>
                setMessage(
                  event.target
                    .value,
                )
              }
              disabled={
                loading ||
                !selectedDeviceId
              }
              placeholder={
                selectedDevice
                  ? `Pergunte sobre ${selectedDevice.nome}...`
                  : "Selecione um dispositivo para começar"
              }
              className="
                min-w-0
                flex-1

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-gray-50
                dark:bg-[#0d2238]

                px-5
                py-4

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                outline-none

                shadow-xl
                dark:shadow-sm

                transition-all

                focus:border-[var(--company-primary)]

                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />

            <button
              type="submit"
              disabled={
                loading ||
                !selectedDeviceId
              }
              className="
                min-h-[54px]

                rounded-2xl

                bg-gradient-to-r
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                px-6
                py-4

                font-semibold

                text-white

                flex
                items-center
                justify-center

                gap-2

                shadow-2xl

                transition-all

                hover:opacity-95

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <Loader2
                  size={21}
                  className="animate-spin"
                />
              ) : (
                <Send
                  size={21}
                />
              )}

              {loading
                ? "Enviando..."
                : "Enviar"}
            </button>
          </form>
        </section>

        {/* LATERAL */}
        <aside
          className="
            min-w-0

            space-y-6
          "
        >
          {/* SUGESTÕES */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <h2
              className="
                text-lg
                sm:text-xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Sugestões de perguntas
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              Clique em uma sugestão
              para preencher sua
              pergunta.
            </p>

            <div
              className="
                mt-5

                space-y-3
              "
            >
              {suggestions.map(
                (
                  suggestion,
                ) => (
                  <button
                    key={
                      suggestion
                    }
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(
                        suggestion,
                      )
                    }
                    disabled={
                      !selectedDevice
                    }
                    className="
                      w-full

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-gray-50
                      dark:bg-[#0d2238]

                      p-4

                      text-left

                      text-sm

                      text-gray-600
                      dark:text-gray-300

                      flex
                      items-start

                      gap-3

                      transition-all

                      hover:border-[color-mix(in_srgb,var(--company-primary)_40%,transparent)]

                      hover:text-[var(--company-primary)]

                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    <MessageCircle
                      size={19}
                      className="
                        mt-0.5

                        shrink-0
                      "
                    />

                    <span
                      className="
                        leading-relaxed
                      "
                    >
                      {
                        suggestion
                      }
                    </span>
                  </button>
                ),
              )}
            </div>
          </section>

          {/* CONTEXTO ATUAL */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <h2
              className="
                text-lg
                sm:text-xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Contexto da consulta
            </h2>

            <div
              className="
                mt-5

                space-y-3
              "
            >
              <ContextRow
                label="Dispositivo"
                value={
                  selectedDevice
                    ?.nome ||
                  "Não selecionado"
                }
                active={
                  Boolean(
                    selectedDevice,
                  )
                }
              />

              <ContextRow
                label="Dispositivos vinculados"
                value={String(
                  devices.length,
                )}
                active={
                  devices.length >
                  0
                }
              />

              <ContextRow
                label="Base consultada"
                value="Documentação vinculada"
                active={
                  Boolean(
                    selectedDevice,
                  )
                }
              />

              <ContextRow
                label="Fontes"
                value="Exibidas nas respostas"
                active
              />
            </div>

            <div
              className="
                mt-5

                rounded-2xl

                border
                border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                bg-[color-mix(in_srgb,var(--company-primary)_6%,transparent)]

                p-4

                flex
                items-start

                gap-3
              "
            >
              <BotMessageSquare
                size={21}
                className="
                  mt-0.5

                  shrink-0

                  text-[var(--company-primary)]
                "
              />

              <p
                className="
                  text-sm

                  text-gray-600
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                O agente responde com
                base na documentação
                técnica cadastrada para
                o dispositivo
                selecionado.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        sm:rounded-3xl

        border
        border-gray-200
        dark:border-white/10

        bg-white
        dark:bg-[#091a2c]

        p-4
        sm:p-5
        lg:p-6

        shadow-2xl
        dark:shadow-sm
      "
    >
      <div
        className="
          w-12
          h-12

          sm:w-14
          sm:h-14

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center
        "
      >
        <Icon
          size={28}
        />
      </div>

      <h2
        className="
          mt-4

          text-lg
          sm:text-xl

          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-2

          text-sm
          sm:text-base

          text-gray-500
          dark:text-gray-400

          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
}

function ContextRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className="
        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-[#0d2238]

        p-4

        flex
        items-start
        justify-between

        gap-3
      "
    >
      <span
        className="
          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </span>

      <span
        className={`
          text-right

          text-sm
          font-semibold

          ${
            active
              ? `
                  text-[#080E2F]
                  dark:text-white
                `
              : `
                  text-yellow-600
                  dark:text-yellow-400
                `
          }
        `}
      >
        {value}
      </span>
    </div>
  );
}