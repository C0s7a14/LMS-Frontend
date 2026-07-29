import {
  Search,
  Grid3X3,
  List,
  Star,
  BookOpen,
  ArrowRight,
  Cpu,
  Plus,
  Send,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import toast from "react-hot-toast";

import DeviceModal from "../../components/modals/DeviceModal";
import CoursePreviewModal from "../../components/modals/CoursePreviewModal";
import axios from "axios";


interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
  course_id?: number | null;
  course_title?: string | null;
  enrollment_request_id?: number | null;
  enrollment_status?: "pendente" | "aprovada" | "rejeitada" | "cancelada" | null;
  enrollment_requested_at?: string | null;
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
  dispositivo_id: number;
  dispositivo_nome: string;
  dispositivo_modelo?: string | null;
  dispositivo_imagem_url?: string | null;
  total_modulos: number;
  total_aulas: number;
  modulos: CourseModule[];
}


export default function Device() {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CoursePreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [requestingEnrollment, setRequestingEnrollment] = useState(false);
  const [selectedEnrollmentStatus, setSelectedEnrollmentStatus] = useState<
  DeviceType["enrollment_status"]>(null);



  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userRole = user?.role;
  const isAdmin = userRole === "admin";
  const isClient = userRole === "client" || userRole === "cliente";
  const isStudent = userRole === "student" || userRole === "aluno";



 async function getDevices() {
  try {
    setLoading(true);

   const endpoint = isClient
  ? "/client/devices"
  : isStudent
  ? "/student/course-catalog"
  : "/devices";

    const response = await api.get<DeviceType[]>(endpoint);

    setDevices(response.data);
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar dispositivos");
  } finally {
    setLoading(false);
  }
}

async function handleOpenCoursePreview(device: DeviceType) {
  const courseId = device.course_id;

  if (!courseId) {
    toast.error("Este curso ainda não está disponível.");
    return;
  }

  try {
    setPreviewModalOpen(true);
    setLoadingPreview(true);
    setSelectedCourse(null);
    setSelectedEnrollmentStatus(device.enrollment_status ?? null);

    const response = await api.get<CoursePreview>(
      `/student/courses/${courseId}/preview`
    );

    setSelectedCourse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.error || "Erro ao carregar prévia do curso."
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
        mensagem: "Tenho interesse em realizar este treinamento.",
      }
    );

    toast.success(
      response.data?.message ||
        "Solicitação de matrícula enviada com sucesso."
    );

    setSelectedEnrollmentStatus("pendente");

setDevices((prevDevices) =>
  prevDevices.map((device) =>
    device.course_id === selectedCourse.id
      ? {
          ...device,
          enrollment_status: "pendente",
        }
      : device
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

async function handleRequestEnrollmentByCourseId(courseId?: number | null) {
  if (!courseId) {
    toast.error("Este curso ainda não está disponível.");
    return;
  }

  try {
    setRequestingEnrollment(true);

    const response = await api.post(
      `/student/courses/${courseId}/enrollment-request`,
      {
        mensagem: "Tenho interesse em realizar este treinamento.",
      }
    );

    toast.success(
      response.data?.message ||
        "Solicitação de matrícula enviada com sucesso."
    );

    setDevices((prevDevices) =>
  prevDevices.map((device) =>
    device.course_id === courseId
      ? {
          ...device,
          enrollment_status: "pendente",
        }
      : device
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

function getEnrollmentButtonText(status?: string | null) {
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

function getEnrollmentButtonClass(status?: string | null) {
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

function isEnrollmentButtonDisabled(status?: string | null) {
  return status === "pendente" || status === "rejeitada";
}

function handleEnrollmentButtonClick(device: DeviceType) {
  if (device.enrollment_status === "pendente") {
    toast("Sua solicitação está aguardando aprovação do administrador.");
    return;
  }

  if (device.enrollment_status === "aprovada") {
    if (device.course_id) {
      navigate(`/courses/${device.course_id}`);
      return;
    }

    toast.error("Curso não encontrado.");
    return;
  }

  if (device.enrollment_status === "rejeitada") {
    toast.error("Sua solicitação para este curso foi rejeitada.");
    return;
  }

  handleRequestEnrollmentByCourseId(device.course_id);
}


  useEffect(() => {
    getDevices();
  }, []);

  const filteredDevices = devices.filter((device) => {
  const searchLower = search.toLowerCase();

    if (isStudent && !device.course_id) {
      return false;
    }

    return (
      device.nome?.toLowerCase().includes(searchLower) ||
      device.modelo?.toLowerCase().includes(searchLower) ||
      device.tipo?.toLowerCase().includes(searchLower) ||
      device.course_title?.toLowerCase().includes(searchLower)
    );
  });

  const pageTitle = isClient
  ? "Meus Dispositivos SIRROS"
  : isStudent
  ? "Cursos disponíveis"
  : "Dispositivos SIRROS";

const pageSubtitle = isClient
  ? "Acesse os dispositivos vinculados à sua empresa."
  : isStudent
  ? "Escolha um curso disponível, veja a prévia e solicite matrícula."
  : "Gerencie os dispositivos cadastrados na plataforma.";

const searchPlaceholder = isStudent
  ? "Buscar cursos..."
  : "Buscar dispositivos...";

const emptyTitle = isStudent
  ? "Nenhum curso disponível"
  : "Nenhum dispositivo encontrado";

const emptyDescription = isClient
  ? "Nenhum dispositivo foi vinculado à sua conta ainda."
  : isStudent
  ? "Nenhum curso publicado foi vinculado aos dispositivos no momento."
  : "Cadastre dispositivos para eles aparecerem aqui.";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-10">
          <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
            {pageTitle}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
            {pageSubtitle}
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
                placeholder={searchPlaceholder}
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
                  dark:shadow-sm dark:shadow-blue-500
                "
              />
            </div>

            {/* Botão Novo Dispositivo */}
           {isAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                h-16
                px-5
                py-4
                rounded-2xl
                font-semibold
                transition-all
                flex
                items-center
                justify-center
                gap-2
                shadow-2xl
                dark:shadow-sm
                dark:shadow-blue-500
              "
            >
              <Plus size={20} />
              Novo Dispositivo
            </button>
          )}
            {/* View buttons */}
            <div className="hidden sm:flex bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-1 shadow-2xl  dark:shadow-sm dark:shadow-blue-500">
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
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
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
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center text-gray-500 dark:text-gray-400 ">
            {isStudent ? "Carregando cursos disponíveis..." : "Carregando dispositivos..."}
          </div>
        )}

        {/* Empty */}
        {!loading && filteredDevices.length === 0 && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center ">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Cpu size={36} className="text-blue-500 dark:text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
            {emptyTitle}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {emptyDescription}
          </p>
          </div>
        )}

        {/* Devices */}
        {!loading && filteredDevices.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7"
                : "flex flex-col gap-5"
            }
          >
            {filteredDevices.map((device) => (
              <div
                key={device.id}
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
                  shadow-2xl dark:shadow-sm dark:shadow-blue-500
                  ${
                    viewMode === "list"
                      ? "flex flex-col md:flex-row md:items-center"
                      : ""
                  }
                `}
              >
                {/* Área da imagem */}
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
                  <div className="absolute top-5 left-5 z-10 bg-blue-500/20 text-blue-500 dark:text-blue-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium ">
                    <Star size={16} fill="currentColor" />
                    {isStudent ? "Curso disponível" : device.tipo || "Dispositivo"}
                  </div>

                  <button className="absolute top-5 right-5 z-10 text-gray-400 hover:text-blue-400 transition-all">
                    <Star size={24} />
                  </button>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full bg-blue-500/10 blur-sm" />
                  </div>

                  <div className="relative z-10 h-full flex items-center justify-center">
                    {device.imagem_url ? (
                      <img
                        src={device.imagem_url}
                        alt={device.nome}
                        className="max-h-44 max-w-[85%] object-contain drop-shadow-xl"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                        <Cpu
                          size={70}
                          className="text-blue-500 dark:text-blue-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1">
                  <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mb-2">
                    {isStudent ? device.course_title || "Curso vinculado" : device.nome}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed min-h-[52px]">
                    {isStudent
                      ? device.descricao ||
                        "Curso técnico vinculado a um dispositivo SIRROS. Veja a prévia e solicite matrícula para iniciar seus estudos."
                      : device.descricao ||
                        "Dispositivo SIRROS para treinamentos e cursos da plataforma."}
                  </p>  

                  {isStudent ? (
                    <p className="text-sm text-blue-500 dark:text-blue-400 font-medium mt-3">
                      Dispositivo: {device.nome}
                    </p>
                  ) : (
                    device.modelo && (
                      <p className="text-sm text-blue-500 dark:text-blue-400 font-medium mt-3">
                        Modelo: {device.modelo}
                      </p>
                    )
                  )}

                  <div className="border-t border-gray-200 dark:border-white/10 mt-5 pt-4">
                    {isStudent ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleEnrollmentButtonClick(device)}
                          disabled={
                            requestingEnrollment ||
                            isEnrollmentButtonDisabled(device.enrollment_status)
                          }
                          className={`
                            flex-1
                            ${getEnrollmentButtonClass(device.enrollment_status)}
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
                          {getEnrollmentButtonText(device.enrollment_status)}
                        </button>

                        <button
                          onClick={() => handleOpenCoursePreview(device)}
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
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-blue-500 dark:text-blue-400">
                          <BookOpen size={24} />

                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            {isClient ? "Acessar dispositivo" : "Ver cursos"}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (isClient) {
                              navigate(`/devices/${device.id}`);
                              return;
                            }

                            if (device.course_id) {
                              navigate(`/courses/${device.course_id}`);
                              return;
                            }

                            navigate("/courses");
                          }}
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-blue-500/20
                            text-blue-500
                            dark:text-blue-400
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-500
                            hover:text-white
                            transition-all
                            cursor-pointer
                          "
                        >
                          <ArrowRight size={24} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

        {isAdmin && (
          <DeviceModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={getDevices}
          />
        )}
      </div>
    </main>
  );
}