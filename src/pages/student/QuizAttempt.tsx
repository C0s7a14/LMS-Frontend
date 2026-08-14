import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
  Trophy,
  XCircle,
} from "lucide-react";

import {
  startQuizAttempt,
  submitQuiz,
} from "../../services/quizService";

import type {
  Quiz,
  SubmitQuizResult,
} from "../../types/quiz";

function formatTime(
  totalSeconds: number,
) {
  const hours =
    Math.floor(
      totalSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60,
    );

  const seconds =
    totalSeconds % 60;

  return `${String(hours).padStart(
    2,
    "0",
  )}:${String(
    minutes,
  ).padStart(
    2,
    "0",
  )}:${String(
    seconds,
  ).padStart(
    2,
    "0",
  )}`;
}

export default function QuizAttempt() {
  const navigate =
    useNavigate();

  const {
    quizId,
  } = useParams();

  const numericQuizId =
    Number(
      quizId,
    );

  const [
    quiz,
    setQuiz,
  ] =
    useState<Quiz | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [
    answers,
    setAnswers,
  ] = useState<
    Record<number, number>
  >({});

  const [
    markedForReview,
    setMarkedForReview,
  ] = useState<
    number[]
  >([]);

  const [
    elapsedTime,
    setElapsedTime,
  ] = useState(0);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    result,
    setResult,
  ] =
    useState<SubmitQuizResult | null>(
      null,
    );

  const [
    tentativaId,
    setTentativaId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    loadError,
    setLoadError,
  ] =
    useState<string | null>(
      null,
    );

  const hasStartedAttempt =
    useRef(false);

  useEffect(() => {
    async function loadQuiz() {
      if (
        hasStartedAttempt.current
      ) {
        return;
      }

      try {
        hasStartedAttempt.current =
          true;

        setLoading(true);
        setLoadError(null);

        if (
          !numericQuizId ||
          Number.isNaN(
            numericQuizId,
          )
        ) {
          setLoadError(
            "Quiz inválido.",
          );

          toast.error(
            "Quiz inválido",
          );

          return;
        }

        const data =
          await startQuizAttempt(
            numericQuizId,
          );

        setQuiz(
          data.quiz,
        );

        setTentativaId(
          data.tentativa_id,
        );
      } catch (error) {
        console.error(error);

        const err =
          error as {
            response?: {
              data?: {
                message?: string;
                error?: string;
                detail?: string;
              };
            };
          };

        const message =
          err.response?.data
            ?.message ||
          err.response?.data
            ?.error ||
          err.response?.data
            ?.detail ||
          "Erro ao carregar avaliação";

        setLoadError(
          message,
        );

        toast.error(
          message,
        );

        hasStartedAttempt.current =
          false;
      } finally {
        setLoading(false);
      }
    }

    void loadQuiz();
  }, [
    numericQuizId,
  ]);

  const isFinalExam =
    quiz?.tipo ===
    "prova_final";

  const isLessonQuiz =
    quiz?.tipo ===
    "aula";

  const assessmentLabel =
    isFinalExam
      ? "Prova final"
      : isLessonQuiz
        ? "Quiz da aula"
        : "Quiz do módulo";

  useEffect(() => {
    if (
      !isFinalExam ||
      result
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setElapsedTime(
            (
              previous,
            ) =>
              previous +
              1,
          );
        },
        1000,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    isFinalExam,
    result,
  ]);

  useEffect(() => {
    if (
      !isFinalExam ||
      result
    ) {
      return;
    }

    function handleBeforeUnload(
      event: BeforeUnloadEvent,
    ) {
      event.preventDefault();

      event.returnValue =
        "";
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload,
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      );
    };
  }, [
    isFinalExam,
    result,
  ]);

  useEffect(() => {
    if (
      !isFinalExam ||
      result ||
      !quiz?.id
    ) {
      return;
    }

    const assessmentPath =
      `/meus-cursos/avaliacao/${quiz.id}`;

    window.history.pushState(
      {
        finalExamLocked:
          true,
      },
      "",
      assessmentPath,
    );

    function handlePopState() {
      toast.error(
        "Você precisa finalizar a prova antes de sair.",
      );

      window.history.pushState(
        {
          finalExamLocked:
            true,
        },
        "",
        assessmentPath,
      );

      navigate(
        assessmentPath,
        {
          replace: true,
        },
      );
    }

    window.addEventListener(
      "popstate",
      handlePopState,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState,
      );
    };
  }, [
    isFinalExam,
    result,
    quiz?.id,
    navigate,
  ]);

  const currentQuestion =
    quiz?.questoes[
      currentQuestionIndex
    ];

  const totalQuestions =
    quiz?.questoes.length ||
    0;

  const answeredQuestions =
    useMemo(
      () =>
        Object.keys(
          answers,
        ).length,
      [
        answers,
      ],
    );

  const progressPercent =
    totalQuestions
      ? Math.round(
          ((currentQuestionIndex +
            1) /
            totalQuestions) *
            100,
        )
      : 0;

  const minimumScore =
    Number(
      quiz?.nota_minima ||
        70,
    );

  function handleSelectOption(
    questionId: number,
    optionId: number,
  ) {
    setAnswers(
      (
        previous,
      ) => ({
        ...previous,

        [questionId]:
          optionId,
      }),
    );
  }

  function handleNextQuestion() {
    if (!quiz) {
      return;
    }

    if (
      currentQuestionIndex <
      quiz.questoes.length -
        1
    ) {
      setCurrentQuestionIndex(
        (
          previous,
        ) =>
          previous + 1,
      );
    }
  }

  function handlePreviousQuestion() {
    if (
      currentQuestionIndex >
      0
    ) {
      setCurrentQuestionIndex(
        (
          previous,
        ) =>
          previous - 1,
      );
    }
  }

  function handleClearAnswer() {
    if (
      !currentQuestion
    ) {
      return;
    }

    setAnswers(
      (
        previous,
      ) => {
        const updated = {
          ...previous,
        };

        delete updated[
          currentQuestion.id
        ];

        return updated;
      },
    );
  }

  function handleToggleReview() {
    if (
      !currentQuestion
    ) {
      return;
    }

    setMarkedForReview(
      (
        previous,
      ) => {
        if (
          previous.includes(
            currentQuestion.id,
          )
        ) {
          return previous.filter(
            (
              id,
            ) =>
              id !==
              currentQuestion.id,
          );
        }

        return [
          ...previous,
          currentQuestion.id,
        ];
      },
    );
  }

  function handleExitAssessment() {
    if (
      isFinalExam &&
      !result
    ) {
      toast.error(
        "Finalize a prova antes de sair desta página.",
      );

      return;
    }

    if (
      quiz?.curso_id
    ) {
      navigate(
        `/courses/${quiz.curso_id}`,
      );

      return;
    }

    navigate(
      "/courses",
    );
  }

  async function handleSubmitQuiz() {
    if (!quiz) {
      return;
    }

    if (
      !tentativaId
    ) {
      toast.error(
        "Tentativa não iniciada. Recarregue a avaliação.",
      );

      return;
    }

    if (
      answeredQuestions <
      quiz.questoes.length
    ) {
      toast.error(
        "Responda todas as questões antes de finalizar",
      );

      return;
    }

    const respostas =
      quiz.questoes.map(
        (
          questao,
        ) => ({
          questao_id:
            questao.id,

          opcao_id:
            answers[
              questao.id
            ],
        }),
      );

    try {
      setSubmitting(
        true,
      );

      const submitResult =
        await submitQuiz(
          quiz.id,
          tentativaId,
          respostas,
        );

      setResult(
        submitResult,
      );

      if (
        submitResult.tentativa
          .aprovado
      ) {
        toast.success(
          "Avaliação finalizada com aprovação",
        );
      } else {
        toast.error(
          "Avaliação finalizada sem aprovação",
        );
      }
    } catch (error) {
      console.error(error);

      const err =
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

      toast.error(
        err.response?.data
          ?.message ||
          "Erro ao finalizar avaliação",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  if (loading) {
    return (
      <div
        className="
          min-h-[100dvh]

          bg-gray-50
          dark:bg-[#071827]

          flex
          items-center
          justify-center

          p-4
          sm:p-6
        "
      >
        <div
          className="
            w-full
            max-w-sm

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-6
            sm:p-8

            flex
            flex-col
            items-center

            gap-3

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          <Loader2
            className="
              w-8
              h-8

              animate-spin

              text-[var(--company-primary)]
            "
          />

          <p
            className="
              font-semibold

              text-gray-600
              dark:text-gray-300
            "
          >
            Carregando avaliação...
          </p>
        </div>
      </div>
    );
  }

  if (
    !quiz ||
    !currentQuestion
  ) {
    return (
      <div
        className="
          min-h-[100dvh]

          bg-gray-50
          dark:bg-[#071827]

          flex
          items-center
          justify-center

          p-4
          sm:p-6
        "
      >
        <div
          className="
            w-full
            max-w-lg

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-6
            sm:p-8

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          <XCircle
            className="
              w-12
              h-12

              mx-auto
              mb-4

              text-red-500
            "
          />

          <h1
            className="
              text-xl
              sm:text-2xl

              font-bold

              text-[#080E2F]
              dark:text-white
            "
          >
            Avaliação não encontrada
          </h1>

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
            {loadError ||
              "Não foi possível carregar as perguntas desta avaliação."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/courses",
              )
            }
            className="
              mt-6

              w-full
              sm:w-auto

              rounded-xl

              bg-gradient-to-r
              from-[var(--company-primary)]
              to-[var(--company-secondary)]

              px-5
              py-3

              font-semibold

              text-white

              shadow-xl

              transition-all

              hover:opacity-95
            "
          >
            Voltar para meus cursos
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div
        className="
          min-h-[100dvh]

          bg-gray-50
          dark:bg-[#071827]

          flex
          items-center
          justify-center

          p-4
          sm:p-6
          lg:p-8
        "
      >
        <div
          className="
            w-full
            max-w-3xl

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-5
            sm:p-8

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          {result.tentativa
            .aprovado ? (
            <div
              className="
                w-20
                h-20

                mx-auto
                mb-5

                rounded-3xl

                bg-green-500/10

                flex
                items-center
                justify-center
              "
            >
              <CheckCircle2
                className="
                  w-11
                  h-11

                  text-green-500
                "
              />
            </div>
          ) : (
            <div
              className="
                w-20
                h-20

                mx-auto
                mb-5

                rounded-3xl

                bg-red-500/10

                flex
                items-center
                justify-center
              "
            >
              <XCircle
                className="
                  w-11
                  h-11

                  text-red-500
                "
              />
            </div>
          )}

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-extrabold

              text-[#080E2F]
              dark:text-white
            "
          >
            {result.tentativa
              .aprovado
              ? "Avaliação aprovada!"
              : "Avaliação não aprovada"}
          </h1>

          <p
            className="
              mt-3

              text-sm
              sm:text-base

              text-gray-500
              dark:text-gray-400
            "
          >
            Você acertou{" "}
            {
              result.tentativa
                .total_acertos
            }{" "}
            de{" "}
            {
              result.tentativa
                .total_questoes
            }{" "}
            questões.
          </p>

          <div
            className="
              mt-8

              grid
              grid-cols-1

              sm:grid-cols-3

              gap-4
            "
          >
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

          {result.tentativa
            .certificado_emitido && (
            <div
              className="
                mt-6

                rounded-2xl

                border
                border-green-200
                dark:border-green-800

                bg-green-50
                dark:bg-green-950/20

                p-4
                sm:p-5

                flex
                items-start

                gap-3

                text-left

                shadow-xl
                dark:shadow-sm
              "
            >
              <Award
                className="
                  w-8
                  h-8

                  shrink-0

                  text-green-600
                  dark:text-green-400
                "
              />

              <div className="min-w-0">
                <h3
                  className="
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Certificado liberado
                </h3>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  Seu certificado já
                  está disponível na
                  área de certificados.
                </p>
              </div>
            </div>
          )}

          <div
            className="
              mt-8

              flex
              flex-col

              gap-3

              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={
                handleExitAssessment
              }
              className="
                min-h-[48px]

                flex-1

                rounded-xl

                border
                border-gray-300
                dark:border-white/10

                bg-white
                dark:bg-[#0d2238]

                px-4
                py-3

                font-semibold

                text-gray-700
                dark:text-gray-200

                shadow-xl
                dark:shadow-sm

                transition-all

                hover:bg-gray-50
                dark:hover:bg-white/5
              "
            >
              Voltar ao curso
            </button>

            {result.tentativa
              .certificado_emitido && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/certificate",
                  )
                }
                className="
                  min-h-[48px]

                  flex-1

                  rounded-xl

                  bg-gradient-to-r
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  px-4
                  py-3

                  font-semibold

                  text-white

                  shadow-xl

                  transition-all

                  hover:opacity-95
                "
              >
                Ver certificado
              </button>
            )}

            {!result.tentativa
              .aprovado &&
              isFinalExam && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/courses/${quiz.curso_id}?review=1`,
                    )
                  }
                  className="
                    min-h-[48px]

                    flex-1

                    rounded-xl

                    bg-gradient-to-r
                    from-[var(--company-primary)]
                    to-[var(--company-secondary)]

                    px-4
                    py-3

                    font-semibold

                    text-white

                    shadow-xl

                    transition-all

                    hover:opacity-95
                  "
                >
                  Revisar curso
                </button>
              )}

            {!result.tentativa
              .aprovado &&
              !isFinalExam && (
                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="
                    min-h-[48px]

                    flex-1

                    rounded-xl

                    bg-gradient-to-r
                    from-[var(--company-primary)]
                    to-[var(--company-secondary)]

                    px-4
                    py-3

                    font-semibold

                    text-white

                    flex
                    items-center
                    justify-center

                    gap-2

                    shadow-xl

                    transition-all

                    hover:opacity-95
                  "
                >
                  <RotateCcw
                    size={18}
                  />

                  Tentar novamente
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-[100dvh]

        bg-gray-50
        dark:bg-[#071827]

        text-[#080E2F]
        dark:text-white

        transition-colors
      "
    >
      <div
        className="
          w-full
          max-w-[1600px]

          mx-auto

          px-4
          py-5

          sm:px-6
          sm:py-6

          lg:px-8
          lg:py-8
        "
      >
        <div
          className="
            grid
            grid-cols-1

            gap-6

            xl:grid-cols-[minmax(0,1fr)_340px]

            2xl:grid-cols-[minmax(0,1fr)_380px]
          "
        >
          <main
            className="
              min-w-0

              space-y-6
            "
          >
            {/* CABEÇALHO */}
            <section
              className="
                flex
                flex-col

                gap-5

                lg:flex-row
                lg:items-start
                lg:justify-between
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    mb-4

                    flex
                    flex-wrap
                    items-center

                    gap-2

                    text-sm
                    font-semibold
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleExitAssessment
                    }
                    className={
                      isFinalExam
                        ? `
                            cursor-not-allowed

                            text-gray-400
                          `
                        : `
                            text-[var(--company-primary)]

                            hover:underline
                          `
                    }
                  >
                    Meus Cursos
                  </button>

                  <ChevronRight
                    size={15}
                    className="
                      text-gray-400
                    "
                  />

                  <span
                    className="
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Curso
                  </span>

                  <ChevronRight
                    size={15}
                    className="
                      text-gray-400
                    "
                  />

                  <span
                    className="
                      text-gray-600
                      dark:text-gray-300
                    "
                  >
                    {assessmentLabel}
                  </span>
                </div>

                <h1
                  className="
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    2xl:text-5xl

                    font-extrabold

                    tracking-tight

                    text-[#080E2F]
                    dark:text-white

                    leading-tight
                    break-words
                  "
                >
                  {isFinalExam
                    ? "Prova final do curso"
                    : quiz.titulo}
                </h1>

                <p
                  className="
                    mt-3

                    max-w-3xl

                    text-sm
                    sm:text-base
                    lg:text-lg

                    text-gray-500
                    dark:text-gray-400

                    leading-relaxed
                  "
                >
                  {isFinalExam
                    ? "Avaliação final obrigatória para validar seu conhecimento e liberar o certificado."
                    : isLessonQuiz
                      ? "Responda as perguntas para validar seu aprendizado nesta aula."
                      : "Responda as perguntas para validar seu aprendizado neste módulo."}
                </p>
              </div>

              {/* PROGRESSO */}
              <div
                className="
                  w-full

                  lg:w-[320px]
                  xl:w-[300px]
                  2xl:w-[340px]

                  shrink-0
                "
              >
                <div
                  className="
                    mb-2

                    flex
                    items-center
                    justify-between

                    gap-3

                    text-sm
                    font-bold
                  "
                >
                  <span
                    className="
                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Pergunta{" "}
                    {currentQuestionIndex +
                      1}{" "}
                    de{" "}
                    {
                      totalQuestions
                    }
                  </span>

                  <span
                    className="
                      text-[var(--company-primary)]
                    "
                  >
                    {progressPercent}%
                  </span>
                </div>

                <div
                  className="
                    h-3

                    w-full

                    overflow-hidden

                    rounded-full

                    bg-gray-200
                    dark:bg-[#132d46]
                  "
                >
                  <div
                    className="
                      h-full

                      rounded-full

                      bg-gradient-to-r
                      from-[var(--company-primary)]
                      to-[var(--company-secondary)]

                      transition-all
                    "
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>

                {isFinalExam && (
                  <div
                    className="
                      mt-4

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-white
                      dark:bg-[#091a2c]

                      p-4

                      flex
                      items-center
                      justify-between

                      gap-3

                      shadow-2xl
                      dark:shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        items-center

                        gap-2

                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      <Clock3
                        className="
                          w-5
                          h-5

                          shrink-0
                        "
                      />

                      <span
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Tempo decorrido
                      </span>
                    </div>

                    <strong
                      className="
                        text-lg
                        sm:text-xl

                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatTime(
                        elapsedTime,
                      )}
                    </strong>
                  </div>
                )}
              </div>
            </section>

            {/* RESUMOS */}
            <div
              className="
                grid
                grid-cols-1

                sm:grid-cols-3

                gap-4
              "
            >
              <SummaryCard
                icon={
                  <FileText
                    className="
                      w-6
                      h-6
                    "
                  />
                }
                title={`${totalQuestions} perguntas`}
              />

              <SummaryCard
                icon={
                  <Trophy
                    className="
                      w-6
                      h-6
                    "
                  />
                }
                title={`Nota mínima ${minimumScore}%`}
              />

              <SummaryCard
                icon={
                  <Clock3
                    className="
                      w-6
                      h-6
                    "
                  />
                }
                title={
                  isFinalExam
                    ? "Tentativa da prova"
                    : `${quiz.max_tentativas} tentativa(s)`
                }
              />
            </div>

            {/* QUESTÃO */}
            <section
              className="
                overflow-hidden

                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                shadow-2xl
                dark:shadow-sm
              "
            >
              <div
                className="
                  p-4
                  sm:p-5
                  md:p-8
                "
              >
                <div
                  className="
                    mb-6

                    flex
                    flex-col

                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <span
                    className="
                      w-fit

                      inline-flex
                      items-center

                      min-h-10

                      rounded-xl

                      border
                      border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                      bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                      px-4

                      font-bold

                      text-[var(--company-primary)]
                    "
                  >
                    Pergunta{" "}
                    {currentQuestionIndex +
                      1}
                  </span>

                  {isFinalExam && (
                    <button
                      type="button"
                      onClick={
                        handleToggleReview
                      }
                      className="
                        w-fit

                        inline-flex
                        items-center

                        gap-2

                        font-medium

                        text-gray-500
                        dark:text-gray-400

                        transition-all

                        hover:text-[var(--company-primary)]
                      "
                    >
                      <Bookmark
                        className={`
                          w-5
                          h-5

                          ${
                            markedForReview.includes(
                              currentQuestion.id,
                            )
                              ? `
                                  fill-yellow-500
                                  text-yellow-500
                                `
                              : ""
                          }
                        `}
                      />

                      {markedForReview.includes(
                        currentQuestion.id,
                      )
                        ? "Marcada para revisar"
                        : "Marcar para revisar"}
                    </button>
                  )}
                </div>

                <h2
                  className="
                    max-w-4xl

                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    lg:text-4xl

                    font-extrabold

                    text-[#080E2F]
                    dark:text-white

                    leading-tight
                    break-words
                  "
                >
                  {
                    currentQuestion.pergunta
                  }
                </h2>

                <div
                  className="
                    mt-5

                    rounded-xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-[#0d2238]

                    px-4
                    py-3

                    text-sm

                    font-medium

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Selecione apenas uma
                  alternativa.
                </div>

                {/* ALTERNATIVAS */}
                <div
                  className="
                    mt-4

                    space-y-3
                  "
                >
                  {currentQuestion.opcoes.map(
                    (
                      opcao,
                    ) => {
                      const selected =
                        answers[
                          currentQuestion.id
                        ] ===
                        opcao.id;

                      return (
                        <button
                          key={
                            opcao.id
                          }
                          type="button"
                          onClick={() =>
                            handleSelectOption(
                              currentQuestion.id,
                              opcao.id,
                            )
                          }
                          className={`
                            w-full
                            min-w-0
                            min-h-[64px]

                            rounded-2xl

                            border

                            px-4
                            py-4

                            sm:px-5

                            text-left

                            flex
                            items-start

                            gap-3
                            sm:gap-4

                            shadow-lg
                            dark:shadow-sm

                            transition-all

                            ${
                              selected
                                ? `
                                    border-[var(--company-primary)]

                                    bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]
                                  `
                                : `
                                    border-gray-200
                                    dark:border-white/10

                                    bg-white
                                    dark:bg-[#0d2238]

                                    hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

                                    hover:bg-[color-mix(in_srgb,var(--company-primary)_4%,transparent)]
                                  `
                            }
                          `}
                        >
                          <span
                            className={`
                              mt-0.5

                              w-8
                              h-8

                              rounded-full

                              border-2

                              flex
                              items-center
                              justify-center

                              shrink-0

                              ${
                                selected
                                  ? `
                                      border-[var(--company-primary)]

                                      bg-[var(--company-primary)]
                                    `
                                  : `
                                      border-gray-400
                                      dark:border-gray-500
                                    `
                              }
                            `}
                          >
                            {selected && (
                              <span
                                className="
                                  w-3
                                  h-3

                                  rounded-full

                                  bg-white
                                "
                              />
                            )}
                          </span>

                          <span
                            className="
                              min-w-0

                              pt-1

                              font-semibold

                              text-gray-800
                              dark:text-gray-100

                              leading-relaxed
                              break-words
                            "
                          >
                            {
                              opcao.texto_opcao
                            }
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>

                <div
                  className="
                    mt-6
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleClearAnswer
                    }
                    disabled={
                      !answers[
                        currentQuestion.id
                      ]
                    }
                    className="
                      flex
                      items-center

                      gap-2

                      font-semibold

                      text-[var(--company-primary)]

                      transition-opacity

                      hover:opacity-70

                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    <RotateCcw
                      className="
                        w-4
                        h-4
                      "
                    />

                    Limpar resposta
                  </button>
                </div>
              </div>

              {/* NAVEGAÇÃO */}
              <div
                className="
                  border-t
                  border-gray-200
                  dark:border-white/10

                  p-4
                  sm:p-5
                  md:p-8

                  flex
                  flex-col

                  gap-3

                  sm:flex-row
                  sm:justify-between
                "
              >
                <button
                  type="button"
                  onClick={
                    handlePreviousQuestion
                  }
                  disabled={
                    currentQuestionIndex ===
                    0
                  }
                  className="
                    min-h-14

                    w-full
                    sm:w-auto

                    rounded-xl

                    border
                    border-gray-300
                    dark:border-white/10

                    bg-white
                    dark:bg-[#0d2238]

                    px-5
                    sm:px-8

                    font-bold

                    text-gray-700
                    dark:text-gray-200

                    flex
                    items-center
                    justify-center

                    gap-2

                    shadow-xl
                    dark:shadow-sm

                    transition-all

                    hover:bg-gray-50
                    dark:hover:bg-white/5

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  <ChevronLeft
                    className="
                      w-5
                      h-5
                    "
                  />

                  Questão anterior
                </button>

                {currentQuestionIndex <
                totalQuestions -
                  1 ? (
                  <button
                    type="button"
                    onClick={
                      handleNextQuestion
                    }
                    className="
                      min-h-14

                      w-full
                      sm:w-auto

                      rounded-xl

                      bg-gradient-to-r
                      from-[var(--company-primary)]
                      to-[var(--company-secondary)]

                      px-5
                      sm:px-8

                      font-bold

                      text-white

                      flex
                      items-center
                      justify-center

                      gap-2

                      shadow-2xl

                      transition-all

                      hover:opacity-95
                    "
                  >
                    Próxima questão

                    <ChevronRight
                      className="
                        w-5
                        h-5
                      "
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      handleSubmitQuiz
                    }
                    disabled={
                      submitting
                    }
                    className="
                      min-h-14

                      w-full
                      sm:w-auto

                      rounded-xl

                      bg-gradient-to-r
                      from-[var(--company-primary)]
                      to-[var(--company-secondary)]

                      px-5
                      sm:px-8

                      font-bold

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
                    {submitting ? (
                      <Loader2
                        className="
                          w-5
                          h-5

                          animate-spin
                        "
                      />
                    ) : (
                      <Send
                        className="
                          w-5
                          h-5
                        "
                      />
                    )}

                    {submitting
                      ? "Finalizando..."
                      : "Finalizar avaliação"}
                  </button>
                )}
              </div>
            </section>
          </main>

          {/* LATERAL */}
          <aside
            className="
              min-w-0

              space-y-5
            "
          >
            {/* RESUMO */}
            <section
              className="
                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-5
                sm:p-6

                shadow-2xl
                dark:shadow-sm
              "
            >
              <div
                className="
                  mb-5

                  flex
                  items-center
                  justify-between

                  gap-3
                "
              >
                <h3
                  className="
                    text-lg
                    sm:text-xl

                    font-extrabold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {isFinalExam
                    ? "Resumo da prova"
                    : "Resumo do quiz"}
                </h3>

                <BookOpen
                  className="
                    w-5
                    h-5

                    shrink-0

                    text-[var(--company-primary)]
                  "
                />
              </div>

              <p
                className="
                  mb-5

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  break-words
                "
              >
                {quiz.titulo}
              </p>

              <div className="space-y-3">
                <SidebarInfo
                  icon={
                    <FileText
                      className="
                        w-5
                        h-5
                      "
                    />
                  }
                  label={`${totalQuestions} perguntas`}
                />

                <SidebarInfo
                  icon={
                    <Trophy
                      className="
                        w-5
                        h-5
                      "
                    />
                  }
                  label={`Nota mínima: ${minimumScore}%`}
                />

                <SidebarInfo
                  icon={
                    <Clock3
                      className="
                        w-5
                        h-5
                      "
                    />
                  }
                  label="Sem limite de tempo"
                />

                {isFinalExam && (
                  <SidebarInfo
                    icon={
                      <Award
                        className="
                          w-5
                          h-5
                        "
                      />
                    }
                    label="Certificado liberado após aprovação"
                  />
                )}
              </div>
            </section>

            {/* NAVEGAÇÃO DAS QUESTÕES */}
            <section
              className="
                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-5
                sm:p-6

                shadow-2xl
                dark:shadow-sm
              "
            >
              <h3
                className="
                  mb-5

                  text-lg
                  sm:text-xl

                  font-extrabold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Navegação das questões
              </h3>

              <div
                className="
                  grid
                  grid-cols-5

                  gap-2
                  sm:gap-3
                "
              >
                {quiz.questoes.map(
                  (
                    questao,
                    index,
                  ) => {
                    const isCurrent =
                      index ===
                      currentQuestionIndex;

                    const isAnswered =
                      Boolean(
                        answers[
                          questao.id
                        ],
                      );

                    const isMarked =
                      markedForReview.includes(
                        questao.id,
                      );

                    return (
                      <button
                        key={
                          questao.id
                        }
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex(
                            index,
                          )
                        }
                        className={`
                          relative

                          h-11
                          sm:h-12

                          rounded-xl

                          border

                          font-bold

                          transition-all

                          ${
                            isCurrent
                              ? `
                                  border-[var(--company-primary)]

                                  bg-[var(--company-primary)]

                                  text-white

                                  shadow-lg
                                `
                              : isAnswered
                                ? `
                                    border-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]

                                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                                    text-[var(--company-primary)]
                                  `
                                : `
                                    border-gray-200
                                    dark:border-white/10

                                    bg-white
                                    dark:bg-[#0d2238]

                                    text-gray-700
                                    dark:text-gray-300

                                    hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]
                                  `
                          }
                        `}
                      >
                        {index +
                          1}

                        {isMarked && (
                          <span
                            className="
                              absolute

                              -right-1
                              -top-1

                              w-3
                              h-3

                              rounded-full

                              bg-yellow-500
                            "
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              <div
                className="
                  mt-5

                  flex
                  flex-wrap

                  gap-x-4
                  gap-y-2

                  text-xs
                  sm:text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                <LegendDot
                  className="bg-[var(--company-primary)]"
                  label="Atual"
                />

                <LegendDot
                  className="bg-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]"
                  label="Respondida"
                />

                {isFinalExam && (
                  <LegendDot
                    className="bg-yellow-500"
                    label="Revisar"
                  />
                )}
              </div>
            </section>

            {/* REGRAS */}
            <section
              className="
                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-5
                sm:p-6

                shadow-2xl
                dark:shadow-sm
              "
            >
              <h3
                className="
                  mb-4

                  text-lg
                  sm:text-xl

                  font-extrabold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                {isFinalExam
                  ? "Regras da prova"
                  : "Progresso da avaliação"}
              </h3>

              <div className="space-y-3">
                <RuleItem
                  checked
                  label={
                    isFinalExam
                      ? "Ambiente de prova em andamento"
                      : "Quiz em andamento"
                  }
                />

                <RuleItem
                  checked={
                    answeredQuestions >
                    0
                  }
                  label={`${answeredQuestions}/${totalQuestions} questões respondidas`}
                />

                <RuleItem
                  checked={
                    answeredQuestions ===
                    totalQuestions
                  }
                  label="Avaliação pronta para envio"
                />
              </div>

              <div
                className="
                  mt-5

                  rounded-2xl

                  border
                  border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                  bg-[color-mix(in_srgb,var(--company-primary)_7%,transparent)]

                  p-4

                  flex
                  items-start

                  gap-3
                "
              >
                {isFinalExam ? (
                  <ShieldCheck
                    className="
                      w-6
                      h-6

                      shrink-0

                      text-[var(--company-primary)]
                    "
                  />
                ) : (
                  <Info
                    className="
                      w-6
                      h-6

                      shrink-0

                      text-[var(--company-primary)]
                    "
                  />
                )}

                <p
                  className="
                    text-sm

                    font-medium

                    text-gray-600
                    dark:text-gray-300

                    leading-relaxed
                  "
                >
                  {isFinalExam
                    ? "Após iniciar a prova, permaneça nesta página até finalizar e enviar suas respostas."
                    : `Você precisa atingir pelo menos ${minimumScore}% para avançar.`}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleSubmitQuiz
                }
                disabled={
                  submitting
                }
                className="
                  mt-5

                  min-h-12

                  w-full

                  rounded-xl

                  bg-gradient-to-r
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  px-4

                  font-bold

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
                {submitting && (
                  <Loader2
                    className="
                      w-5
                      h-5

                      animate-spin
                    "
                  />
                )}

                {submitting
                  ? "Finalizando..."
                  : isFinalExam
                    ? "Finalizar prova"
                    : "Finalizar quiz"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
}

function SummaryCard({
  icon,
  title,
}: SummaryCardProps) {
  return (
    <div
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

        flex
        items-center

        gap-3
        sm:gap-4

        shadow-2xl
        dark:shadow-sm
      "
    >
      <div
        className="
          w-11
          h-11

          rounded-xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center

          shrink-0
        "
      >
        {icon}
      </div>

      <strong
        className="
          min-w-0

          text-sm
          sm:text-base

          text-[#080E2F]
          dark:text-white

          break-words
        "
      >
        {title}
      </strong>
    </div>
  );
}

interface SidebarInfoProps {
  icon: ReactNode;
  label: string;
}

function SidebarInfo({
  icon,
  label,
}: SidebarInfoProps) {
  return (
    <div
      className="
        flex
        items-start

        gap-3

        text-gray-700
        dark:text-gray-300
      "
    >
      <div
        className="
          mt-0.5

          shrink-0

          text-[var(--company-primary)]
        "
      >
        {icon}
      </div>

      <span
        className="
          font-semibold

          break-words
        "
      >
        {label}
      </span>
    </div>
  );
}

interface LegendDotProps {
  className: string;
  label: string;
}

function LegendDot({
  className,
  label,
}: LegendDotProps) {
  return (
    <div
      className="
        flex
        items-center

        gap-2
      "
    >
      <span
        className={`
          w-3
          h-3

          rounded-full

          ${className}
        `}
      />

      <span>
        {label}
      </span>
    </div>
  );
}

interface RuleItemProps {
  checked: boolean;
  label: string;
}

function RuleItem({
  checked,
  label,
}: RuleItemProps) {
  return (
    <div
      className="
        flex
        items-start

        gap-3
      "
    >
      {checked ? (
        <CheckCircle2
          className="
            mt-0.5

            w-5
            h-5

            shrink-0

            text-green-500
          "
        />
      ) : (
        <Clock3
          className="
            mt-0.5

            w-5
            h-5

            shrink-0

            text-[var(--company-primary)]
          "
        />
      )}

      <span
        className="
          font-semibold

          text-gray-700
          dark:text-gray-300

          break-words
        "
      >
        {label}
      </span>
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
}

function ResultCard({
  label,
  value,
}: ResultCardProps) {
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

        shadow-xl
        dark:shadow-sm
      "
    >
      <p
        className="
          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>

      <strong
        className="
          text-2xl

          text-[#080E2F]
          dark:text-white
        "
      >
        {value}
      </strong>
    </div>
  );
}