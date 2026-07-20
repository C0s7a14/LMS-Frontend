import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatsCard from "../../components/StatsCard";
import CourseCard from "../../components/CourseCard";

import { api } from "../../services/api";

import {
  BookOpen,
  GraduationCap,
  Clock3,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: "student" | "admin" | "client" | "aluno" | "adm" | "cliente";
}

interface StudentHomeResumo {
  totalCursosDisponiveis: number;
  totalCursosMatriculados: number;
  totalCursosConcluidos: number;
  horasEstudoMes: number;
  progressoGeral: number;
}

interface CursoEmAndamento {
  id: number;
  titulo: string;
  descricao: string;
  thumbnail?: string;
  dispositivo_nome?: string;
  total_aulas: number;
  aulas_concluidas: number;
  progresso: number;
  curso_status: string;
}

interface ProximaAula {
  curso_id: number;
  curso_titulo: string;
  modulo_id: number;
  modulo_titulo: string;
  aula_id: number;
  aula_titulo: string;
  duracao: number;
  dispositivo_nome?: string;
}

interface RevisaoPendente {
  curso_id: number;
  curso_titulo: string;
  curso_tentativa_id: number;
  numero_tentativa: number;
  nota_final: string | number | null;
  status: string;
}

interface StudentHomeData {
  resumo: StudentHomeResumo;
  cursosEmAndamento: CursoEmAndamento[];
  proximasAulas: ProximaAula[];
  revisoesPendentes: RevisaoPendente[];
}

function getUserFromStorage(): UserData {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

export default function Home() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const [homeData, setHomeData] = useState<StudentHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStudentHome() {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<StudentHomeData>("/student/home");

      setHomeData(response.data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados da Home.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudentHome();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-300">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span>Carregando sua Home...</span>
        </div>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center max-w-md">
          <h2 className="text-black dark:text-white text-xl font-bold">
            Erro ao carregar
          </h2>

          <p className="text-gray-500 dark:text-gray-300 mt-2">
            {error || "Não foi possível carregar os dados da Home."}
          </p>

          <button
            onClick={loadStudentHome}
            className="mt-5 bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-xl transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { resumo, cursosEmAndamento, proximasAulas, revisoesPendentes } =
    homeData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center md:text-left mt-15 md:mt-0">
          <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
            Bem-vindo{" "}
            <span className="text-blue-500 font-bold">
              {user?.name || "usuário"}
            </span>{" "}
            à Sirros Academy
          </h1>

          <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base">
            Continue aprendendo e acompanhe sua evolução nos treinamentos.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        <StatsCard
          title="Cursos Disponíveis"
          value={String(resumo.totalCursosMatriculados)}
          subtitle="Disponíveis"
          icon={BookOpen}
          iconColor="text-white"
          iconBg="bg-blue-500"
        />

        <StatsCard
          title="Cursos Concluídos"
          value={String(resumo.totalCursosConcluidos)}
          subtitle="Certificados"
          icon={GraduationCap}
          iconColor="text-white"
          iconBg="bg-green-500"
        />

        <StatsCard
          title="Horas de Estudo"
          value={`${resumo.horasEstudoMes}h`}
          subtitle="Este mês"
          icon={Clock3}
          iconColor="text-white"
          iconBg="bg-purple-500"
        />

        <StatsCard
          title="Progresso Geral"
          value={`${resumo.progressoGeral}%`}
          subtitle="Aulas concluídas"
          icon={TrendingUp}
          iconColor="text-white"
          iconBg="bg-orange-500"
        />
      </div>

      {/* Revisões pendentes */}
      {revisoesPendentes.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-3xl p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-yellow-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="text-white w-6 h-6" />
            </div>

            <div className="flex-1">
              <h2 className="text-black dark:text-white text-lg md:text-xl font-semibold">
                Revisões pendentes
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Você possui curso em revisão. Revise o conteúdo para liberar uma
                nova tentativa da prova final.
              </p>

              <div className="mt-4 space-y-3">
                {revisoesPendentes.map((review) => (
                  <div
                    key={review.curso_tentativa_id}
                    className="bg-white dark:bg-[#0d2238] rounded-2xl p-4 border border-yellow-200 dark:border-yellow-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <h3 className="text-black dark:text-white font-semibold">
                        {review.curso_titulo}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Tentativa {review.numero_tentativa} • Nota final:{" "}
                        {review.nota_final ?? "Não informada"}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/courses/${review.curso_id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Continuar revisão
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-5
        "
      >
        {/* Cursos */}
        <div
          className="
            xl:col-span-2
            bg-white
            dark:bg-[#091a2c]
            border
            border-gray-200
            dark:border-white/10
            rounded-3xl
            p-4
            md:p-5
            dark:shadow-sm
            dark:shadow-blue-500
          "
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-black dark:text-white text-lg md:text-xl font-semibold">
              Cursos em Andamento
            </h2>

            <button
              onClick={() => navigate("/courses")}
              className="text-blue-500 dark:text-blue-400 text-sm font-bold cursor-pointer hover:text-blue-300"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-4">
            {cursosEmAndamento.length > 0 ? (
              cursosEmAndamento.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="cursor-pointer"
                >
                  <CourseCard
                    title={course.titulo}
                    progress={course.progresso}
                    subtitle={`${course.dispositivo_nome || "Dispositivo"} • ${
                      course.aulas_concluidas
                    }/${course.total_aulas} aulas`}
                    progressColor="bg-blue-700 dark:bg-blue-500"
                  />
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-[#0d2238] rounded-2xl p-6 border border-gray-200 dark:border-white/5 text-center">
                <h3 className="text-black dark:text-white font-semibold">
                  Nenhum curso em andamento
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Inicie um curso publicado para acompanhar seu progresso aqui.
                </p>

                <button
                  onClick={() => navigate("/courses")}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                >
                  Ver cursos disponíveis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Próximas aulas */}
        <div
          className="
            bg-white
            dark:bg-[#091a2c]
            border
            border-gray-200
            dark:border-white/10
            rounded-3xl
            p-4
            md:p-5
            shadow-2xl
            dark:shadow-sm
            dark:shadow-blue-500
          "
        >
          <h2 className="text-black dark:text-white text-lg md:text-xl font-semibold mb-5">
            Próximas Aulas
          </h2>

          <div className="space-y-4">
            {proximasAulas.length > 0 ? (
              proximasAulas.map((lesson) => (
                <div
                  key={lesson.aula_id}
                  onClick={() => navigate(`/courses/${lesson.curso_id}`)}
                  className="
                    bg-white
                    dark:bg-[#0d2238]
                    rounded-2xl
                    p-4
                    border
                    border-gray-200
                    dark:border-white/5
                    shadow-2xl
                    cursor-pointer
                    transition-all
                    duration-300
                    ease-in-out
                    hover:scale-105
                    hover:shadow-xl
                    active:scale-95
                    active:shadow-sm
                    dark:shadow-xs
                    dark:shadow-blue-500
                    dark:hover:shadow-sm
                  "
                >
                  <h3 className="text-black dark:text-white font-medium">
                    {lesson.aula_titulo}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {lesson.modulo_titulo}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {lesson.curso_titulo}
                  </p>

                  <span className="text-blue-500 dark:text-blue-400 text-sm mt-3 block">
                    {lesson.duracao || 0}min
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-[#0d2238] rounded-2xl p-6 border border-gray-200 dark:border-white/5 text-center">
                <h3 className="text-black dark:text-white font-semibold">
                  Nenhuma aula pendente
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Você não possui próximas aulas pendentes no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}