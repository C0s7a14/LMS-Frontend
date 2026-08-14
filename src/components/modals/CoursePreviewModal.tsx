import {
  BookOpen,
  Cpu,
  Layers,
  ListChecks,
  Loader2,
  Send,
  X,
} from "lucide-react";

interface CourseModule {
  id: number;
  titulo: string;
  ordem: number;
  total_aulas: number;
}

interface CoursePreview {
  id: number;
  titulo: string;
  descricao: string;
  status: string;

  dispositivo_id: number | null;
  dispositivo_nome: string | null;
  dispositivo_modelo?: string | null;
  dispositivo_imagem_url?: string | null;

  total_modulos: number;
  total_aulas: number;

  modulos: CourseModule[];
}

interface CoursePreviewModalProps {
  isOpen: boolean;
  course: CoursePreview | null;
  loading: boolean;
  requesting: boolean;

  enrollmentStatus?:
    | "pendente"
    | "aprovada"
    | "rejeitada"
    | "cancelada"
    | null;

  onClose: () => void;
  onRequestEnrollment: () => void;
}

export default function CoursePreviewModal({
  isOpen,
  course,
  loading,
  requesting,
  enrollmentStatus,
  onClose,
  onRequestEnrollment,
}: CoursePreviewModalProps) {
  if (!isOpen) {
    return null;
  }

  function getEnrollmentModalButtonText() {
    if (
      enrollmentStatus ===
      "pendente"
    ) {
      return "Solicitação pendente";
    }

    if (
      enrollmentStatus ===
      "aprovada"
    ) {
      return "Matrícula aprovada";
    }

    if (
      enrollmentStatus ===
      "rejeitada"
    ) {
      return "Solicitação rejeitada";
    }

    return "Solicitar matrícula";
  }

  function getEnrollmentModalButtonClass() {
    if (
      enrollmentStatus ===
      "pendente"
    ) {
      return `
        bg-yellow-500
        text-white
      `;
    }

    if (
      enrollmentStatus ===
      "aprovada"
    ) {
      return `
        bg-green-500
        text-white
      `;
    }

    if (
      enrollmentStatus ===
      "rejeitada"
    ) {
      return `
        bg-red-500
        text-white
      `;
    }

    return `
      bg-gradient-to-r
      from-[var(--company-primary)]
      to-[var(--company-secondary)]

      text-white

      hover:brightness-105
    `;
  }

  function isEnrollmentModalButtonDisabled() {
    return (
      requesting ||
      enrollmentStatus ===
        "pendente" ||
      enrollmentStatus ===
        "aprovada" ||
      enrollmentStatus ===
        "rejeitada"
    );
  }

  return (
    <div
      className="
        fixed inset-0 z-[110]

        bg-black/55
        backdrop-blur-[2px]

        flex
        items-center
        justify-center

        p-3 sm:p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-preview-title"
        className="
          w-full
          max-w-4xl

          max-h-[calc(100dvh-24px)]

          overflow-y-auto
          overscroll-contain

          bg-white
          dark:bg-[#091a2c]

          border
          border-gray-200
          dark:border-white/10

          rounded-2xl
          sm:rounded-3xl

          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-10

            bg-white/95
            dark:bg-[#091a2c]/95

            backdrop-blur-xl

            border-b
            border-gray-200
            dark:border-white/10

            p-4
            sm:p-5

            flex
            items-start
            justify-between

            gap-4
          "
        >
          <div className="min-w-0">
            <h2
              id="course-preview-title"
              className="
                text-xl
                sm:text-2xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Prévia do curso
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Confira as informações antes de solicitar matrícula.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="
              w-10 h-10

              rounded-xl

              bg-gray-100
              dark:bg-white/5

              text-gray-500
              dark:text-gray-300

              flex
              items-center
              justify-center

              hover:bg-red-500/10
              hover:text-red-500

              transition-all

              shrink-0
            "
          >
            <X size={22} />
          </button>
        </div>

        {loading && (
          <div
            className="
              p-10

              flex
              flex-col
              items-center
              justify-center

              text-sm

              text-gray-500
              dark:text-gray-300
            "
          >
            <Loader2
              className="
                w-8 h-8

                animate-spin

                text-[var(--company-primary)]

                mb-3
              "
            />

            Carregando prévia do curso...
          </div>
        )}

        {!loading && course && (
          <div
            className="
              p-4
              sm:p-5
              md:p-6

              space-y-6
            "
          >
            {/* APRESENTAÇÃO */}
            <div
              className="
                grid
                grid-cols-1

                lg:grid-cols-[280px_minmax(0,1fr)]

                gap-5
                lg:gap-6
              "
            >
              <div
                className="
                  bg-gray-100
                  dark:bg-[#0d2238]

                  rounded-2xl
                  sm:rounded-3xl

                  p-5

                  flex
                  items-center
                  justify-center

                  min-h-[200px]
                  sm:min-h-[240px]
                "
              >
                {course.dispositivo_imagem_url ? (
                  <img
                    src={
                      course.dispositivo_imagem_url
                    }
                    alt={
                      course.dispositivo_nome ||
                      course.titulo
                    }
                    className="
                      max-w-full
                      max-h-56

                      object-contain

                      drop-shadow-xl
                    "
                  />
                ) : (
                  <div
                    className="
                      w-28 h-28
                      sm:w-36 sm:h-36

                      rounded-3xl

                      bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                      flex
                      items-center
                      justify-center
                    "
                  >
                    {course.dispositivo_id ? (
                      <Cpu
                        size={60}
                        className="
                          text-[var(--company-primary)]
                        "
                      />
                    ) : (
                      <BookOpen
                        size={60}
                        className="
                          text-[var(--company-primary)]
                        "
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2

                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                    text-[var(--company-primary)]

                    px-4 py-2

                    rounded-xl

                    text-sm
                    font-semibold

                    mb-4
                  "
                >
                  <BookOpen size={18} />

                  Curso disponível
                </div>

                <h3
                  className="
                    text-2xl
                    md:text-3xl

                    font-bold

                    text-[#080E2F]
                    dark:text-white

                    leading-tight
                    break-words
                  "
                >
                  {course.titulo}
                </h3>

                <p
                  className="
                    mt-3

                    text-gray-500
                    dark:text-gray-400

                    leading-relaxed
                  "
                >
                  {course.descricao ||
                    "Este curso ainda não possui descrição cadastrada."}
                </p>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-3

                    gap-3

                    mt-5
                  "
                >
                  <InfoBox
                    icon={
                      course.dispositivo_id
                        ? Cpu
                        : BookOpen
                    }
                    title={
                      course.dispositivo_id
                        ? "Dispositivo"
                        : "Tipo"
                    }
                    value={
                      course.dispositivo_nome ||
                      "Treinamento geral"
                    }
                  />

                  <InfoBox
                    icon={Layers}
                    title="Módulos"
                    value={String(
                      course.total_modulos ||
                        0,
                    )}
                  />

                  <InfoBox
                    icon={ListChecks}
                    title="Aulas"
                    value={String(
                      course.total_aulas ||
                        0,
                    )}
                  />
                </div>
              </div>
            </div>

            {/* MÓDULOS */}
            <div
              className="
                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                rounded-2xl
                sm:rounded-3xl

                p-4
                sm:p-5
              "
            >
              <h4
                className="
                  text-lg
                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  mb-4
                "
              >
                Conteúdo previsto
              </h4>

              {course.modulos?.length >
              0 ? (
                <div className="space-y-3">
                  {course.modulos.map(
                    (module) => (
                      <div
                        key={module.id}
                        className="
                          bg-white
                          dark:bg-[#091a2c]

                          border
                          border-gray-200
                          dark:border-white/10

                          rounded-2xl

                          p-4

                          flex
                          items-center
                          justify-between

                          gap-4

                          shadow-sm
                        "
                      >
                        <div className="min-w-0">
                          <h5
                            className="
                              font-semibold

                              text-[#080E2F]
                              dark:text-white

                              break-words
                            "
                          >
                            {module.ordem}.{" "}
                            {module.titulo}
                          </h5>

                          <p
                            className="
                              mt-1

                              text-sm

                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            {
                              module.total_aulas
                            }{" "}
                            aula(s)
                          </p>
                        </div>

                        <BookOpen
                          size={22}
                          className="
                            text-[var(--company-primary)]
                            shrink-0
                          "
                        />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p
                  className="
                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Nenhum módulo cadastrado para este curso.
                </p>
              )}
            </div>

            {/* MATRÍCULA */}
            <div
              className="
                bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

                border
                border-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                rounded-2xl
                sm:rounded-3xl

                p-4
                sm:p-5
              "
            >
              <h4
                className="
                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Solicitação de matrícula
              </h4>

              <p
                className="
                  mt-2

                  text-sm

                  text-gray-600
                  dark:text-gray-300

                  leading-relaxed
                "
              >
                Ao solicitar matrícula, seu pedido ficará pendente até
                a aprovação de um administrador. Após a aprovação, o
                curso será liberado em Meus Cursos.
              </p>

              <button
                type="button"
                onClick={
                  onRequestEnrollment
                }
                disabled={isEnrollmentModalButtonDisabled()}
                className={`
                  w-full
                  sm:w-auto

                  mt-5

                  ${getEnrollmentModalButtonClass()}

                  font-bold

                  px-5 py-3

                  rounded-xl

                  transition-all

                  flex
                  items-center
                  justify-center

                  gap-2

                  shadow-lg

                  disabled:opacity-80
                  disabled:cursor-not-allowed
                `}
              >
                {requesting ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Enviando solicitação...
                  </>
                ) : (
                  <>
                    <Send size={20} />

                    {getEnrollmentModalButtonText()}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof BookOpen;
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        min-w-0

        bg-gray-50
        dark:bg-[#0d2238]

        border
        border-gray-200
        dark:border-white/10

        rounded-2xl

        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2

          text-[var(--company-primary)]
        "
      >
        <Icon
          size={20}
          className="shrink-0"
        />

        <span
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </span>
      </div>

      <p
        className="
          mt-2

          text-[#080E2F]
          dark:text-white

          font-bold

          break-words
        "
      >
        {value}
      </p>
    </div>
  );
}