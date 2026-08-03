import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Clock3,
  Cpu,
  Download,
  FileText,
  MoreVertical,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import ActionButton from "../components/ActionButton";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AdminDashboardData,
  CoursePublicationStatus,
  CourseType,
  DeviceType,
} from "../types/adminDashboard.types";


export default function CoursesTab({
  courses,
  search,
  dashboardData,
  devices,
  createCourse,
  manageCourseLessons,
  deleteCourse,
  updateCourseStatus,
  updatingCourseStatusId,
  editCourse,
}: {
  courses: CourseType[];
  search: string;
  dashboardData: AdminDashboardData | null;
  devices: DeviceType[];
  createCourse: () => void;
  manageCourseLessons: (courseId: number) => void;
  deleteCourse: (course: CourseType) => void;
  updateCourseStatus: (
    course: CourseType,
    status: CoursePublicationStatus,
  ) => void;
  updatingCourseStatusId: number | null;
  editCourse: (course: CourseType) => void;
}) {
  const resumo = dashboardData?.resumo;
  const [selectedCourseActions, setSelectedCourseActions] =
  useState<CourseType | null>(null);

const [selectedCourseForDevice, setSelectedCourseForDevice] =
  useState<CourseType | null>(null);

const [selectedCourseDeviceId, setSelectedCourseDeviceId] = useState("");
const [linkingCourseDevice, setLinkingCourseDevice] = useState(false);

async function handleLinkDeviceToCourse() {
  try {
    if (!selectedCourseForDevice) {
      return;
    }

    if (!selectedCourseDeviceId) {
      toast.error("Selecione um dispositivo.");
      return;
    }

    setLinkingCourseDevice(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    await axios.post(
      `http://localhost:3333/devices/courses/${selectedCourseForDevice.id}/devices/${selectedCourseDeviceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Dispositivo vinculado ao curso.");

    setSelectedCourseForDevice(null);
    setSelectedCourseDeviceId("");

    window.location.reload();
  } catch (error) {
    console.log(error);

    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao vincular dispositivo ao curso."
      );

      return;
    }

    toast.error("Erro inesperado ao vincular dispositivo ao curso.");
  } finally {
    setLinkingCourseDevice(false);
  }
}

const filteredCourses = courses.filter((course) => {
  const term = search.toLowerCase();

  return (
    course.titulo?.toLowerCase().includes(term) ||
    course.descricao?.toLowerCase().includes(term) ||
    course.status?.toLowerCase().includes(term) ||
    course.curso_publicacao_status?.toLowerCase().includes(term)
  );
});

  function getCourseStatus(course: CourseType) {
    return course.status || course.curso_publicacao_status || "publicado";
  }

  function getCourseStatusStyle(status: string) {
    if (status === "publicado") {
      return "bg-green-500/15 text-green-600 dark:text-green-400";
    }

    if (status === "rascunho") {
      return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
    }

    if (status === "arquivado") {
      return "bg-gray-500/15 text-gray-600 dark:text-gray-400";
    }

    return "bg-gray-500/15 text-gray-600 dark:text-gray-400";
  }

  function getCourseStatusLabel(status: string) {
    if (status === "publicado") return "Publicado";
    if (status === "rascunho") return "Rascunho";
    if (status === "arquivado") return "Arquivado";

    return status;
  }

  function getNextCourseStatus(status: string) {
  if (status === "rascunho") {
    return "publicado";
  }

  if (status === "publicado") {
    return "arquivado";
  }

  return "rascunho";
}

function getStatusActionLabel(status: string) {
  if (status === "rascunho") {
    return "Publicar";
  }

  if (status === "publicado") {
    return "Arquivar";
  }

  return "Restaurar";
}

function getStatusActionStyle(status: string) {
  if (status === "rascunho") {
    return "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20";
  }

  if (status === "publicado") {
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20";
  }

  return "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20";
}

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total de Cursos"
          value={resumo?.totalCursos ?? courses.length}
          subtitle="Todos os cursos"
          icon={BookOpen}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Publicados"
          value={resumo?.cursosPublicados ?? 0}
          subtitle="Disponíveis"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Rascunhos"
          value={resumo?.cursosRascunho ?? 0}
          subtitle="Não publicados"
          icon={FileText}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Arquivados"
          value={resumo?.cursosArquivados ?? 0}
          subtitle="Fora da listagem"
          icon={Clock3}
          color="bg-gray-500/15 text-gray-600 dark:text-gray-400"
        />

        <StatCard
          title="Alunos"
          value={resumo?.totalAlunos ?? 0}
          subtitle="Perfil estudante"
          icon={Users}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Revisões"
          value={resumo?.revisoesPendentes ?? 0}
          subtitle="Pendentes"
          icon={Activity}
          color="bg-red-500/15 text-red-600 dark:text-red-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)] gap-5 sm:gap-6">
        <TableCard title="Lista de Cursos">
  <div className="w-full">
    <div className="grid grid-cols-[minmax(0,1fr)_100px_80px_110px_56px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
      <span>Curso</span>
      <span>Status</span>
      <span>Aulas</span>
      <span>Criação</span>
      <span className="text-right">Ações</span>
    </div>

    {filteredCourses.length > 0 ? (
      filteredCourses.map((course) => {
        const status = getCourseStatus(course);

        return (
          <div
            key={course.id}
            className="grid grid-cols-[minmax(0,1fr)_100px_80px_110px_56px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#0d2238] overflow-hidden flex items-center justify-center shrink-0">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    className="w-full h-full object-cover"
                    alt={course.titulo}
                  />
                ) : (
                  <BookOpen className="text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                  {course.titulo}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {course.descricao || "Sem descrição"}
                </p>
              </div>
            </div>

            <span
              className={`w-fit px-3 py-1 rounded-xl font-semibold text-sm ${getCourseStatusStyle(
                status
              )}`}
            >
              {getCourseStatusLabel(status)}
            </span>

            <p className="text-gray-600 dark:text-gray-400">
              {course.total_aulas ?? 0} aulas
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              {course.criado_em
                ? new Date(course.criado_em).toLocaleDateString("pt-BR")
                : "-"}
            </p>

            <div className="flex justify-end">
            <button
            type="button"
            onClick={() => setSelectedCourseActions(course)}
            title="Ações do curso"
            className="
              inline-flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-600
              dark:text-blue-400
              hover:bg-blue-500/20
              transition-all
            "
          >
            <MoreVertical size={20} />
          </button>
            </div>
          </div>
        );
      })
    ) : (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        Nenhum curso encontrado.
      </div>
    )}
  </div>
</TableCard>

        <TableCard title="Ações Rápidas">
          <div className="grid grid-cols-1 gap-4">
            <ActionButton
              icon={BookOpen}
              title="Criar curso"
              subtitle="Iniciar um novo curso"
              onClick={createCourse}
            />

            <ActionButton
              icon={Award}
              title="Ver certificados"
              subtitle="Acompanhar certificados emitidos"
              onClick={() => alert("Use a aba Certificados.")}
            />

            <ActionButton
              icon={Download}
              title="Exportar catálogo"
              subtitle="Exportar lista de cursos"
              onClick={() => alert("Conectar exportação depois.")}
            />
          </div>
        </TableCard>

        {selectedCourseActions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                  Ações do curso
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {selectedCourseActions.titulo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourseActions(null)}
                className="text-gray-500 hover:text-red-500 transition-all"
              >
                <X size={26} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  manageCourseLessons(selectedCourseActions.id);
                  setSelectedCourseActions(null);
                }}
                className="
                  w-full
                  inline-flex
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  bg-blue-500/10
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-blue-600
                  dark:text-blue-400
                  hover:bg-blue-500/20
                  transition-all
                "
              >
                <span className="inline-flex items-center gap-2">
                  <BookOpen size={18} />
                  Gerenciar aulas
                </span>

                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCourseForDevice(selectedCourseActions);
                  setSelectedCourseActions(null);
                  setSelectedCourseDeviceId("");
                }}
                className="
                  w-full
                  inline-flex
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  bg-cyan-500/10
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-cyan-600
                  dark:text-cyan-400
                  hover:bg-cyan-500/20
                  transition-all
                "
              >
                <span className="inline-flex items-center gap-2">
                  <Cpu size={18} />
                  Vincular dispositivo
                </span>

                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const currentStatus = getCourseStatus(selectedCourseActions);

                  updateCourseStatus(
                    selectedCourseActions,
                    getNextCourseStatus(currentStatus) as
                      | "rascunho"
                      | "publicado"
                      | "arquivado"
                  );

                  setSelectedCourseActions(null);
                }}
                disabled={updatingCourseStatusId === selectedCourseActions.id}
                className={`
                  w-full
                  inline-flex
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  ${getStatusActionStyle(getCourseStatus(selectedCourseActions))}
                `}
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={18} />
                  {getStatusActionLabel(getCourseStatus(selectedCourseActions))}
                </span>

                <ArrowRight size={18} />
              </button>

              <button
              type="button"
              onClick={() => {
                editCourse(selectedCourseActions);
                setSelectedCourseActions(null);
              }}
              className="
                w-full
                inline-flex
                items-center
                justify-between
                gap-3
                rounded-2xl
                bg-purple-500/10
                px-4
                py-3
                text-sm
                font-semibold
                text-purple-600
                dark:text-purple-400
                hover:bg-purple-500/20
                transition-all
              "
            >
              <span className="inline-flex items-center gap-2">
                <FileText size={18} />
                Editar dados
              </span>

              <ArrowRight size={18} />
            </button>

              <button
                type="button"
                onClick={() => {
                  deleteCourse(selectedCourseActions);
                  setSelectedCourseActions(null);
                }}
                className="
                  w-full
                  inline-flex
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  bg-red-500/10
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-red-500
                  hover:bg-red-500/20
                  transition-all
                "
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 size={18} />
                  Excluir curso
                </span>

                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCourseForDevice && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
            Vincular dispositivo
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Curso: <strong>{selectedCourseForDevice.titulo}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCourseForDevice(null);
            setSelectedCourseDeviceId("");
          }}
          disabled={linkingCourseDevice}
          className="text-gray-500 hover:text-red-500 transition-all disabled:opacity-60"
        >
          <X size={26} />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
            Dispositivo relacionado ao curso
          </label>

          <select
            value={selectedCourseDeviceId}
            onChange={(event) => setSelectedCourseDeviceId(event.target.value)}
            disabled={linkingCourseDevice}
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 disabled:opacity-60"
          >
            <option value="">Selecione um dispositivo</option>

            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.nome}
                {device.modelo ? ` - ${device.modelo}` : ""}
              </option>
            ))}
          </select>
        </div>

        {devices.length === 0 && (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-700 dark:text-orange-300">
            Nenhum dispositivo cadastrado. Cadastre um dispositivo antes de vincular ao curso.
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCourseForDevice(null);
              setSelectedCourseDeviceId("");
            }}
            disabled={linkingCourseDevice}
            className="rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleLinkDeviceToCourse}
            disabled={linkingCourseDevice || !selectedCourseDeviceId}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {linkingCourseDevice ? "Vinculando..." : "Vincular dispositivo"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
      </div>
  );
}
