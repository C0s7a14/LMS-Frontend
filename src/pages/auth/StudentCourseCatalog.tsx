import {
  Search,
  Grid3X3,
  List,
  Star,
  BookOpen,
  Cpu,
  Send,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { api } from "../../services/api";
import CoursePreviewModal from "../../components/modals/CoursePreviewModal";

interface CourseDevice {
  id: number;
  nome: string;
  modelo?: string | null;
  tipo?: string | null;
  descricao?: string | null;
  imagem_url?: string | null;
  criado_em?: string | null;
}

interface CourseCatalogItem {
  course_id: number;
  course_title: string;
  course_description?: string | null;
  course_thumbnail?: string | null;
  course_status?: string | null;
  course_created_at?: string | null;

  enrollment_request_id?: number | null;
  enrollment_status?:
    | "pendente"
    | "aprovada"
    | "rejeitada"
    | "cancelada"
    | null;

  enrollment_requested_at?: string | null;

  devices: CourseDevice[];
}

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

export default function StudentCourseCatalog() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseCatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [loading, setLoading] = useState(true);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<CoursePreview | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);

  const [requestingEnrollment, setRequestingEnrollment] =
    useState(false);

  const [
    selectedEnrollmentStatus,
    setSelectedEnrollmentStatus,
  ] = useState<CourseCatalogItem["enrollment_status"]>(null);

  async function getCourses() {
    try {
      setLoading(true);

      const response = await api.get<CourseCatalogItem[]>(
        "/student/course-catalog"
      );

      setCourses(response.data);
    } catch (error) {
      console.log(error);

      toast.error("Erro ao buscar cursos disponíveis");
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenCoursePreview(course: CourseCatalogItem) {
    try {
      setPreviewModalOpen(true);
      setLoadingPreview(true);
      setSelectedCourse(null);

      setSelectedEnrollmentStatus(
        course.enrollment_status ?? null
      );

      const response = await api.get<CoursePreview>(
        `/student/courses/${course.course_id}/preview`
      );

      setSelectedCourse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "Erro ao carregar prévia do curso."
        );

        return;
      }

      toast.error("Erro inesperado ao carregar prévia do curso.");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleRequestEnrollment() {
    if (!selectedCourse?.id) {
      toast.error("Curso não selecionado.");
      return;
    }

    try {
      setRequestingEnrollment(true);

      const response = await api.post(
        `/student/courses/${selectedCourse.id}/enrollment-request`,
        {
          mensagem:
            "Tenho interesse em realizar este treinamento.",
        }
      );

      toast.success(
        response.data?.message ||
          "Solicitação de matrícula enviada com sucesso."
      );

      setSelectedEnrollmentStatus("pendente");

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_id === selectedCourse.id
            ? {
                ...course,
                enrollment_status: "pendente",
              }
            : course
        )
      );

      setPreviewModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "Erro ao solicitar matrícula."
        );

        return;
      }

      toast.error("Erro inesperado ao solicitar matrícula.");
    } finally {
      setRequestingEnrollment(false);
    }
  }

  async function handleRequestEnrollmentByCourseId(
    courseId: number
  ) {
    try {
      setRequestingEnrollment(true);

      const response = await api.post(
        `/student/courses/${courseId}/enrollment-request`,
        {
          mensagem:
            "Tenho interesse em realizar este treinamento.",
        }
      );

      toast.success(
        response.data?.message ||
          "Solicitação de matrícula enviada com sucesso."
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_id === courseId
            ? {
                ...course,
                enrollment_status: "pendente",
              }
            : course
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "Erro ao solicitar matrícula."
        );

        return;
      }

      toast.error("Erro inesperado ao solicitar matrícula.");
    } finally {
      setRequestingEnrollment(false);
    }
  }

  function getEnrollmentButtonText(
    status?: CourseCatalogItem["enrollment_status"]
  ) {
    if (status === "pendente") {
      return "Solicitação pendente";
    }

    if (status === "aprovada") {
      return "Acessar curso";
    }

    if (status === "rejeitada") {
      return "Solicitação rejeitada";
    }

    return "Matricular-se";
  }

  function getEnrollmentButtonClass(
    status?: CourseCatalogItem["enrollment_status"]
  ) {
    if (status === "pendente") {
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    }

    if (status === "aprovada") {
      return "bg-green-500 hover:bg-green-600 text-white";
    }

    if (status === "rejeitada") {
      return "bg-red-500 hover:bg-red-600 text-white";
    }

    return "bg-blue-500 hover:bg-blue-600 text-white";
  }

  function isEnrollmentButtonDisabled(
    status?: CourseCatalogItem["enrollment_status"]
  ) {
    return status === "pendente" || status === "rejeitada";
  }

  function handleEnrollmentButtonClick(
    course: CourseCatalogItem
  ) {
    if (course.enrollment_status === "pendente") {
      toast(
        "Sua solicitação está aguardando aprovação do administrador."
      );

      return;
    }

    if (course.enrollment_status === "aprovada") {
      navigate(`/courses/${course.course_id}`);
      return;
    }

    if (course.enrollment_status === "rejeitada") {
      toast.error(
        "Sua solicitação para este curso foi rejeitada."
      );

      return;
    }

    handleRequestEnrollmentByCourseId(course.course_id);
  }

  function getCourseImage(course: CourseCatalogItem) {
    if (course.course_thumbnail) {
      return course.course_thumbnail;
    }

    const deviceWithImage = course.devices?.find(
      (device) => device.imagem_url
    );

    return deviceWithImage?.imagem_url || null;
  }

  function getCourseDeviceDescription(
    course: CourseCatalogItem
  ) {
    if (!course.devices || course.devices.length === 0) {
      return "Treinamento geral";
    }

    if (course.devices.length === 1) {
      return `Dispositivo: ${course.devices[0].nome}`;
    }

    return `Dispositivos: ${course.devices
      .map((device) => device.nome)
      .join(", ")}`;
  }

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchLower = search.trim().toLowerCase();

    if (!searchLower) {
      return true;
    }

    const deviceText = course.devices
      ?.map(
        (device) =>
          `${device.nome || ""} ${device.modelo || ""} ${
            device.tipo || ""
          }`
      )
      .join(" ")
      .toLowerCase();

    return (
      course.course_title
        ?.toLowerCase()
        .includes(searchLower) ||
      course.course_description
        ?.toLowerCase()
        .includes(searchLower) ||
      deviceText?.includes(searchLower)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              Cursos disponíveis
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
              Escolha um curso disponível, veja a prévia e solicite
              matrícula.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-[360px]">
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
                  placeholder:text-gray-400
                  dark:placeholder:text-gray-500
                  outline-none
                  focus:border-blue-500
                  transition-all
                  shadow-2xl
                  dark:shadow-sm
                  dark:shadow-blue-500
                "
              />
            </div>

            {/* View buttons */}
            <div className="hidden sm:flex bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-1 shadow-2xl dark:shadow-sm dark:shadow-blue-500">
              <button
                type="button"
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
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }
                `}
              >
                <Grid3X3 size={22} />
              </button>

              <button
                type="button"
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
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400"
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
            Carregando cursos disponíveis...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredCourses.length === 0 && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen
                size={36}
                className="text-blue-500 dark:text-blue-400"
              />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Nenhum curso disponível
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Nenhum curso publicado está disponível no momento.
            </p>
          </div>
        )}

        {/* Courses */}
        {!loading && filteredCourses.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7"
                : "flex flex-col gap-5"
            }
          >
            {filteredCourses.map((course) => {
              const courseImage = getCourseImage(course);
              const hasDevice =
                course.devices && course.devices.length > 0;

              return (
                <div
                  key={course.course_id}
                  className={`
                    bg-white
                    dark:bg-[#091a2c]
                    border
                    border-gray-200
                    dark:border-white/10
                    rounded-3xl
                    hover:border-blue-500/40
                    hover:-translate-y-1
                    transition-all
                    overflow-hidden
                    shadow-2xl
                    dark:shadow-sm
                    dark:shadow-blue-500
                    ${
                      viewMode === "list"
                        ? "flex flex-col md:flex-row md:items-center"
                        : ""
                    }
                  `}
                >
                  {/* Imagem */}
                  <div
                    className={`
                      relative
                      p-6
                      bg-gray-100
                      dark:bg-[#0d2238]
                      ${
                        viewMode === "list"
                          ? "md:w-72 h-56 md:h-48"
                          : "h-64"
                      }
                    `}
                  >
                    <div className="absolute top-5 left-5 z-10 bg-blue-500/20 text-blue-500 dark:text-blue-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                      <Star size={16} fill="currentColor" />
                      Curso disponível
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-44 h-44 rounded-full bg-blue-500/10 blur-sm" />
                    </div>

                    <div className="relative z-10 h-full flex items-center justify-center">
                      {courseImage ? (
                        <img
                          src={courseImage}
                          alt={course.course_title}
                          className="max-h-44 max-w-[85%] object-contain drop-shadow-xl"
                        />
                      ) : (
                        <div className="w-36 h-36 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                          {hasDevice ? (
                            <Cpu
                              size={70}
                              className="text-blue-500 dark:text-blue-400"
                            />
                          ) : (
                            <BookOpen
                              size={70}
                              className="text-blue-500 dark:text-blue-400"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1">
                    <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mb-2">
                      {course.course_title}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed min-h-[52px]">
                      {course.course_description ||
                        "Treinamento disponível na Sirros Academy. Veja a prévia e solicite matrícula para iniciar seus estudos."}
                    </p>

                    <p className="text-sm text-blue-500 dark:text-blue-400 font-medium mt-3">
                      {getCourseDeviceDescription(course)}
                    </p>

                    <div className="border-t border-gray-200 dark:border-white/10 mt-5 pt-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleEnrollmentButtonClick(course)
                          }
                          disabled={
                            requestingEnrollment ||
                            isEnrollmentButtonDisabled(
                              course.enrollment_status
                            )
                          }
                          className={`
                            flex-1
                            ${getEnrollmentButtonClass(
                              course.enrollment_status
                            )}
                            font-bold
                            px-4
                            py-3
                            rounded-xl
                            transition-all
                            cursor-pointer
                            flex
                            items-center
                            justify-center
                            gap-2
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                          `}
                        >
                          <Send size={18} />

                          {getEnrollmentButtonText(
                            course.enrollment_status
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenCoursePreview(course)
                          }
                          className="
                            flex-1
                            bg-blue-500/10
                            hover:bg-blue-500/20
                            text-blue-500
                            dark:text-blue-400
                            font-bold
                            px-4
                            py-3
                            rounded-xl
                            transition-all
                            cursor-pointer
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >
                          <BookOpen size={18} />
                          Ver prévia
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <CoursePreviewModal
          isOpen={previewModalOpen}
          course={selectedCourse}
          loading={loadingPreview}
          requesting={requestingEnrollment}
          enrollmentStatus={selectedEnrollmentStatus}
          onClose={() => setPreviewModalOpen(false)}
          onRequestEnrollment={handleRequestEnrollment}
        />
      </div>
    </main>
  );
}