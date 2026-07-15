import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Award,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  RotateCcw,
  Send,
  ShieldCheck,
  Trophy,
  XCircle,
} from "lucide-react";

import {
  getQuizById,
  submitQuiz,
} from "../../services/quizService";

import type {
  Quiz,
  SubmitQuizResult,
} from "../../types/quiz";

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export default function QuizAttempt() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const numericQuizId = Number(quizId);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitQuizResult | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);

        if (!numericQuizId || Number.isNaN(numericQuizId)) {
          toast.error("Quiz inválido");
          return;
        }

        const data = await getQuizById(numericQuizId);
        setQuiz(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar avaliação");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [numericQuizId]);

  const isFinalExam = quiz?.tipo === "prova_final";

  useEffect(() => {
    if (!isFinalExam || result) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinalExam, result]);

  useEffect(() => {
    if (!isFinalExam || result) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFinalExam, result]);

  const currentQuestion = quiz?.questoes[currentQuestionIndex];

  const totalQuestions = quiz?.questoes.length || 0;

  const answeredQuestions = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const progressPercent = totalQuestions
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0;

  const minimumScore = Number(quiz?.nota_minima || 70);

  function handleSelectOption(questionId: number, optionId: number) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }

  function handleNextQuestion() {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questoes.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }

  function handleClearAnswer() {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });
  }

  function handleToggleReview() {
    if (!currentQuestion) return;

    setMarkedForReview((prev) => {
      if (prev.includes(currentQuestion.id)) {
        return prev.filter((id) => id !== currentQuestion.id);
      }

      return [...prev, currentQuestion.id];
    });
  }

  async function handleSubmitQuiz() {
    if (!quiz) return;

    if (answeredQuestions < quiz.questoes.length) {
      toast.error("Responda todas as questões antes de finalizar");
      return;
    }

    const respostas = quiz.questoes.map((questao) => ({
      questao_id: questao.id,
      opcao_id: answers[questao.id],
    }));

    try {
      setSubmitting(true);

      const submitResult = await submitQuiz(quiz.id, respostas);

      setResult(submitResult);

      if (submitResult.tentativa.aprovado) {
        toast.success("Avaliação finalizada com aprovação");
      } else {
        toast.error("Avaliação finalizada sem aprovação");
      }
    } catch (error) {
      console.error(error);

      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        err.response?.data?.message || "Erro ao finalizar avaliação"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p className="text-slate-600 font-semibold">
            Carregando avaliação...
          </p>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-slate-950">
            Avaliação não encontrada
          </h1>

          <p className="text-slate-500 mt-2">
            Não foi possível carregar as perguntas deste quiz.
          </p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm max-w-2xl w-full text-center">
          {result.tentativa.aprovado ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}

          <h1 className="text-3xl font-extrabold text-slate-950">
            {result.tentativa.aprovado
              ? "Avaliação aprovada!"
              : "Avaliação não aprovada"}
          </h1>

          <p className="text-slate-500 mt-3">
            Você acertou {result.tentativa.total_acertos} de{" "}
            {result.tentativa.total_questoes} questões.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <ResultCard
              label="Nota"
              value={`${result.tentativa.nota}%`}
            />

            <ResultCard
              label="Nota mínima"
              value={`${result.tentativa.nota_minima}%`}
            />

            <ResultCard
              label="Tentativas"
              value={`${result.tentativa.tentativas_usadas}/${result.tentativa.max_tentativas}`}
            />
          </div>

          {result.tentativa.certificado_emitido && (
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3 text-left">
              <Award className="w-8 h-8 text-indigo-600" />

              <div>
                <h3 className="font-bold text-indigo-950">
                  Certificado liberado
                </h3>

                <p className="text-sm text-indigo-700">
                  Seu certificado já está disponível na área de certificados.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 mt-8">
            <button
              onClick={() => navigate("/meus-cursos")}
              className="h-12 flex-1 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Voltar aos cursos
            </button>

            {result.tentativa.certificado_emitido && (
              <button
                onClick={() => navigate("/certificados")}
                className="h-12 flex-1 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Ver certificado
              </button>
            )}

            {!result.tentativa.aprovado && (
              <button
                onClick={() => window.location.reload()}
                className="h-12 flex-1 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="max-w-[1600px] mx-auto p-5 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <main className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <button
                    onClick={() => navigate("/meus-cursos")}
                    className="text-indigo-600 hover:underline"
                  >
                    Meus Cursos
                  </button>

                  <span className="text-slate-400">›</span>
                  <span>Curso</span>
                  <span className="text-slate-400">›</span>

                  <span>
                    {isFinalExam ? "Prova final" : "Quiz do módulo"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950">
                  {isFinalExam ? "Prova final do curso" : quiz.titulo}
                </h1>

                <p className="text-slate-500 mt-3 text-base md:text-lg">
                  {isFinalExam
                    ? "Avaliação final obrigatória para validar seu conhecimento e liberar o certificado."
                    : "Responda as perguntas para validar seu aprendizado e liberar a próxima etapa."}
                </p>
              </div>

              <div className="min-w-[280px]">
                <div className="flex justify-between text-sm font-bold text-slate-900 mb-2">
                  <span>
                    Pergunta {currentQuestionIndex + 1} de {totalQuestions}
                  </span>

                  <span>{progressPercent}%</span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {isFinalExam && (
                  <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock3 className="w-5 h-5" />

                      <span className="text-sm font-medium">
                        Tempo decorrido
                      </span>
                    </div>

                    <strong className="text-xl text-slate-950">
                      {formatTime(elapsedTime)}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard
                icon={<FileText className="w-6 h-6" />}
                title={`${totalQuestions} perguntas`}
              />

              <SummaryCard
                icon={<Trophy className="w-6 h-6" />}
                title={`Nota mínima ${minimumScore}%`}
              />

              <SummaryCard
                icon={<Clock3 className="w-6 h-6" />}
                title={`${quiz.max_tentativas} tentativa(s)`}
              />
            </div>

            <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 md:p-8">
                <div className="flex justify-between items-center gap-4 mb-6">
                  <span className="inline-flex items-center px-4 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold">
                    Pergunta {currentQuestionIndex + 1}
                  </span>

                  {isFinalExam && (
                    <button
                      onClick={handleToggleReview}
                      className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          markedForReview.includes(currentQuestion.id)
                            ? "fill-indigo-600 text-indigo-600"
                            : ""
                        }`}
                      />

                      Marcar para revisar
                    </button>
                  )}
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 leading-tight max-w-4xl">
                  {currentQuestion.pergunta}
                </h2>

                <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-500 font-medium">
                  Selecione apenas uma alternativa.
                </div>

                <div className="mt-4 space-y-3">
                  {currentQuestion.opcoes.map((opcao) => {
                    const selected =
                      answers[currentQuestion.id] === opcao.id;

                    return (
                      <button
                        key={opcao.id}
                        onClick={() =>
                          handleSelectOption(currentQuestion.id, opcao.id)
                        }
                        className={`w-full min-h-[64px] rounded-2xl border px-5 py-4 text-left transition flex items-center gap-4 ${
                          selected
                            ? "border-indigo-600 bg-indigo-50/70 shadow-sm"
                            : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selected
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-slate-400"
                          }`}
                        >
                          {selected && (
                            <span className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </span>

                        <span className="font-semibold text-slate-900">
                          {opcao.texto_opcao}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={handleClearAnswer}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar resposta
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 p-5 md:p-8 flex flex-col md:flex-row gap-4 justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="h-14 px-8 rounded-xl border border-slate-300 text-slate-700 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Questão anterior
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="h-14 px-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                  >
                    Próxima questão
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="h-14 px-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? "Finalizando..." : "Finalizar avaliação"}
                  </button>
                )}
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-extrabold text-slate-950">
                  {isFinalExam ? "Resumo da prova" : "Resumo do quiz"}
                </h3>

                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>

              <p className="font-bold text-slate-950 mb-5">
                {quiz.titulo}
              </p>

              <div className="space-y-3">
                <SidebarInfo
                  icon={<FileText className="w-5 h-5" />}
                  label={`${totalQuestions} perguntas`}
                />

                <SidebarInfo
                  icon={<Trophy className="w-5 h-5" />}
                  label={`Nota mínima: ${minimumScore}%`}
                />

                <SidebarInfo
                  icon={<Clock3 className="w-5 h-5" />}
                  label="Sem limite de tempo"
                />

                {isFinalExam && (
                  <SidebarInfo
                    icon={<Award className="w-5 h-5" />}
                    label="Certificado liberado após aprovação"
                  />
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-950 mb-5">
                Navegação das questões
              </h3>

              <div className="grid grid-cols-5 gap-3">
                {quiz.questoes.map((questao, index) => {
                  const isCurrent = index === currentQuestionIndex;
                  const isAnswered = Boolean(answers[questao.id]);
                  const isMarked = markedForReview.includes(questao.id);

                  return (
                    <button
                      key={questao.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`h-12 rounded-xl border font-bold transition relative ${
                        isCurrent
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : isAnswered
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      {index + 1}

                      {isMarked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
                <LegendDot color="bg-indigo-600" label="Atual" />
                <LegendDot color="bg-indigo-100" label="Respondida" />

                {isFinalExam && (
                  <LegendDot color="bg-amber-400" label="Revisar" />
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-950 mb-4">
                {isFinalExam ? "Regras da prova" : "Progresso do módulo"}
              </h3>

              <div className="space-y-3">
                <RuleItem
                  checked
                  label={
                    isFinalExam
                      ? "Aulas concluídas"
                      : "Aulas do módulo concluídas"
                  }
                />

                <RuleItem
                  checked={answeredQuestions > 0}
                  label={`${answeredQuestions}/${totalQuestions} questões respondidas`}
                />

                <RuleItem
                  checked={answeredQuestions === totalQuestions}
                  label="Avaliação pronta para envio"
                />
              </div>

              <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                {isFinalExam ? (
                  <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                ) : (
                  <Info className="w-6 h-6 text-indigo-600 shrink-0" />
                )}

                <p className="text-sm text-indigo-800 font-medium">
                  {isFinalExam
                    ? "Após iniciar a prova, recomenda-se não sair da página. As respostas devem ser enviadas ao finalizar."
                    : `Você precisa atingir pelo menos ${minimumScore}% para avançar.`}
                </p>
              </div>

              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="mt-5 w-full h-12 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {submitting
                  ? "Finalizando..."
                  : isFinalExam
                  ? "Finalizar prova"
                  : "Finalizar quiz"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
}

function SummaryCard({ icon, title }: SummaryCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>

      <strong className="text-slate-950">{title}</strong>
    </div>
  );
}

interface SidebarInfoProps {
  icon: React.ReactNode;
  label: string;
}

function SidebarInfo({ icon, label }: SidebarInfoProps) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <div className="text-indigo-600">{icon}</div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

interface LegendDotProps {
  color: string;
  label: string;
}

function LegendDot({ color, label }: LegendDotProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

interface RuleItemProps {
  checked: boolean;
  label: string;
}

function RuleItem({ checked, label }: RuleItemProps) {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <Clock3 className="w-5 h-5 text-indigo-500" />
      )}

      <span className="font-semibold text-slate-700">{label}</span>
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
}

function ResultCard({ label, value }: ResultCardProps) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <strong className="text-2xl text-slate-950">{value}</strong>
    </div>
  );
}