import {
  X,
  BookOpen,
  Cpu,
  Layers,
  ListChecks,
  Send,
  Loader2,
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
  dispositivo_id: number;
  dispositivo_nome: string;
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
  enrollmentStatus?: "pendente" | "aprovada" | "rejeitada" | "cancelada" | null;
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
  if (enrollmentStatus === "pendente") {
    return "Solicitação pendente";
  }

  if (enrollmentStatus === "aprovada") {
    return "Matrícula aprovada";
  }

  if (enrollmentStatus === "rejeitada") {
    return "Solicitação rejeitada";
  }

  return "Solicitar matrícula";
}

function getEnrollmentModalButtonClass() {
  if (enrollmentStatus === "pendente") {
    return "bg-yellow-500 text-white";
  }

  if (enrollmentStatus === "aprovada") {
    return "bg-green-500 text-white";
  }

  if (enrollmentStatus === "rejeitada") {
    return "bg-red-500 text-white";
  }

  return "bg-blue-500 hover:bg-blue-600 text-white";
}

function isEnrollmentModalButtonDisabled() {
  return (
    requesting ||
    enrollmentStatus === "pendente" ||
    enrollmentStatus === "aprovada" ||
    enrollmentStatus === "rejeitada"
  );
}

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-[#091a2c] border-b border-gray-200 dark:border-white/10 p-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              Prévia do curso
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Confira as informações antes de solicitar matrícula.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition"
          >
            <X size={22} />
          </button>
        </div>

        {loading && (
          <div className="p-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            Carregando prévia do curso...
          </div>
        )}

        {!loading && course && (
          <div className="p-5 md:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              <div className="bg-gray-100 dark:bg-[#0d2238] rounded-3xl p-5 flex items-center justify-center min-h-[240px]">
                {course.dispositivo_imagem_url ? (
                  <img
                    src={course.dispositivo_imagem_url}
                    alt={course.dispositivo_nome}
                    className="max-h-56 object-contain drop-shadow-xl"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                    <Cpu size={70} className="text-blue-500" />
                  </div>
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold mb-4">
                  <BookOpen size={18} />
                  Curso disponível
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-[#080E2F] dark:text-white">
                  {course.titulo}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                  {course.descricao || "Este curso ainda não possui descrição cadastrada."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  <InfoBox
                    icon={Cpu}
                    title="Dispositivo"
                    value={course.dispositivo_nome || "Não informado"}
                  />

                  <InfoBox
                    icon={Layers}
                    title="Módulos"
                    value={String(course.total_modulos || 0)}
                  />

                  <InfoBox
                    icon={ListChecks}
                    title="Aulas"
                    value={String(course.total_aulas || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-3xl p-5">
              <h4 className="text-lg font-bold text-[#080E2F] dark:text-white mb-4">
                Conteúdo previsto
              </h4>

              {course.modulos?.length > 0 ? (
                <div className="space-y-3">
                  {course.modulos.map((module) => (
                    <div
                      key={module.id}
                      className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h5 className="font-semibold text-[#080E2F] dark:text-white">
                          {module.ordem}. {module.titulo}
                        </h5>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {module.total_aulas} aula(s)
                        </p>
                      </div>

                      <BookOpen size={22} className="text-blue-500 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum módulo cadastrado para este curso.
                </p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-3xl p-5">
              <h4 className="font-bold text-[#080E2F] dark:text-white">
                Solicitação de matrícula
              </h4>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Ao solicitar matrícula, seu pedido ficará pendente até a aprovação de um administrador.
                Após a aprovação, o curso será liberado em Meus Cursos.
              </p>

              <button
  type="button"
  onClick={onRequestEnrollment}
  disabled={isEnrollmentModalButtonDisabled()}
  className={`
    mt-5
    ${getEnrollmentModalButtonClass()}
    font-bold
    px-5
    py-3
    rounded-xl
    transition
    flex
    items-center
    justify-center
    gap-2
    disabled:opacity-80
    disabled:cursor-not-allowed
  `}
>
  {requesting ? (
    <>
      <Loader2 size={20} className="animate-spin" />
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
    <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
        <Icon size={20} />
        <span className="text-sm font-semibold">{title}</span>
      </div>

      <p className="text-[#080E2F] dark:text-white font-bold mt-2">
        {value}
      </p>
    </div>
  );
}