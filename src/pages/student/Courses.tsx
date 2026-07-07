import {
  Search,
  Grid3X3,
  List,
  BookOpen,
  ArrowRight,
  Clock3,
  Play,
  Award,
  Users,
  MapPin,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import toast from "react-hot-toast";

interface CourseType {
  id: number;
  titulo: string;
  descricao?: string;
  thumbnail?: string;
  criado_por?: number;
  criado_em?: string;
  criador?: string;

  progresso?: number;
  aulas_concluidas?: number;
  total_aulas?: number;
  duracao?: string;
  categoria?: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function getCourses() {
  try {
    setLoading(true);

    const response = await api.get<CourseType[]>("/courses");

    setCourses(response.data);
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar cursos");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchLower = search.toLowerCase();

    return (
      course.titulo?.toLowerCase().includes(searchLower) ||
      course.descricao?.toLowerCase().includes(searchLower) ||
      course.categoria?.toLowerCase().includes(searchLower)
    );
  });

  function getCourseProgress(course: CourseType) {
    return Number(course.progresso) || 0;
  }

  function getCourseTag(course: CourseType) {
    return course.categoria || "Treinamento";
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-8 ">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              Meus Cursos
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
              Acompanhe seus cursos em andamento
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 rounded-2xl px-5 py-2 font-medium">
              <Users size={20} />
              {filteredCourses.length} cursos em andamento
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 ">
            {/* Search */}
            <div className="relative w-full sm:w-[360px] shadow-2xl rounded-2xl">
              <Search
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  bg-white
                  dark:bg-[#091a2c]
                  border
                  border-gray-200
                  dark:border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-[#080E2F]
                  dark:text-white
                  placeholder:text-gray-500
                  dark:placeholder:text-gray-500
                  outline-none
                  focus:border-blue-500
                  transition-all
                "
              />
            </div>

            {/* View buttons */}
            <div className="hidden sm:flex bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-1 shadow-2xl ">
              <button
                onClick={() => setViewMode("grid")}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition-all
                  cursor-pointer
                  ${
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400 cursor-pointer"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 "
                  }
                `}
              >
                <Grid3X3 size={22} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition-all
                  cursor-pointer
                  ${
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400 "
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }
                `}
              >
                <List size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center text-gray-500 dark:text-gray-400">
            Carregando cursos...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredCourses.length === 0 && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={36} className="text-blue-500 dark:text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Nenhum curso encontrado
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Crie ou matricule-se em cursos para eles aparecerem aqui.
            </p>
          </div>
        )}

        {/* Courses */}
        {!loading && filteredCourses.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 xl:grid-cols-2 gap-7"
                : "flex flex-col gap-5"
            }
          >
            {filteredCourses.map((course) => {
              const progress = getCourseProgress(course);

              return (
                <div
                  key={course.id}
                  className={`
                    bg-white
                    dark:bg-[#091a2c]
                    border
                    border-gray-200
                    shadow-2xl
                    dark:shadow-sm
                    dark:shadow-blue-500
                    dark:border-white/10
                    rounded-3xl
                    overflow-hidden
                    cursor-pointer
                    transition-all
                    hover:-translate-y-1
                    hover:border-blue-500/40
                    ${
                      viewMode === "list"
                        ? "flex flex-col xl:flex-row"
                        : ""
                    }
                  `}
                >
                  {/* Banner */}
                  <div
                    className={`
                      relative
                      bg-gray-100
                      dark:bg-[#0d2238]
                      overflow-hidden
                      ${
                        viewMode === "list"
                          ? "xl:w-[420px] h-72 xl:h-auto"
                          : "h-64"
                      }
                    `}
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" />

                        <div className="relative w-40 h-40 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <BookOpen
                            size={78}
                            className="text-blue-500 dark:text-blue-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Progress badge */}
                    <div className="absolute top-5 right-5 bg-white/90 dark:bg-[#091a2c]/90 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2 text-[#080E2F] dark:text-white font-medium">
                      {progress}% completo
                    </div>

                    {/* Play button */}
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        w-20
                        h-20
                        rounded-full
                        bg-white
                        dark:bg-[#091a2c]
                        text-blue-500
                        dark:text-blue-400
                        flex
                        items-center
                        justify-center
                        shadow-xl
                        hover:scale-105
                        transition-all
                      "
                    >
                      <Play size={34} fill="currentColor" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl px-3 py-2 text-sm font-medium w-fit mb-4">
                      {getCourseTag(course).toLowerCase().includes("geo") ? (
                        <MapPin size={18} />
                      ) : (
                        <Users size={18} />
                      )}

                      {getCourseTag(course)}
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-bold text-[#080E2F] dark:text-white leading-tight">
                      {course.titulo}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                      {course.descricao ||
                        "Curso completo para instalação, configuração e operação dos dispositivos SIRROS."}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-5 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock3 size={22} />
                        <span>{course.duracao || "3h 45min"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen size={22} />
                        <span>
                          {course.aulas_concluidas || 0}/
                          {course.total_aulas || 0} aulas
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Progresso
                        </span>

                        <span className="text-[#080E2F] dark:text-white font-medium">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 dark:bg-[#132d46] rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${progress}%`,
                          }}
                          className="h-full bg-blue-500 rounded-full transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="
                        mt-6
                        w-full
                        bg-blue-500
                        hover:bg-blue-600
                        text-white
                        rounded-2xl
                        py-4
                        font-semibold
                        flex
                        shadow-2xl
                        dark:shadow-blue-700
                        dark:shadow-sm
                        cursor-pointer
                        items-center
                        justify-center
                        gap-3
                        transition-all
                      "
                    >
                      Continuar Curso
                      <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer callout */}
        <div className="mt-7 bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between transition-colors shadow-2xl dark:shadow-blue-500 dark:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Award className="text-blue-500 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Continue aprendendo
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Mantenha sua jornada de aprendizado e conquiste novos certificados.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/certificate")}
            className="
              border
              border-blue-500/40
              text-blue-500
              shadow-2xl
              dark:shadow-blue-500
              dark:shadow-sm
              dark:text-blue-400
              cursor-pointer
              px-5
              py-3
              rounded-2xl
              font-medium
              hover:bg-blue-500/10
              transition-all
            "
          >
            Ver certificados
          </button>
        </div>
      </div>
    </main>
  );
}