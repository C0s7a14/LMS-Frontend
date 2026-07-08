import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit,
  FileText,
  Plus,
  Save,
  Trash2,
  Video,
  X,
} from "lucide-react";

import { api } from "../../services/api";

interface AulaType {
  id: number;
  modulo_id: number;
  titulo: string;
  descricao: string | null;
  conteudo: string | null;
  video_url: string | null;
  pdf_url: string | null;
  duracao: number | null;
  ordem: number;
  status: "rascunho" | "publicada";
  criado_em: string;
  concluida: boolean;
  segundos_assistidos: number;
}

interface ModuloType {
  id: number;
  curso_id: number;
  titulo: string;
  ordem: number;
  aulas: AulaType[];
}

interface CourseContentType {
  id: number;
  titulo: string;
  descricao: string | null;
  thumbnail: string | null;
  criado_em: string;
  progresso: number;
  total_aulas: number;
  aulas_concluidas: number;
  modulos: ModuloType[];
}

interface AulaFormType {
  moduloId: number | "";
  titulo: string;
  descricao: string;
  conteudo: string;
  video_url: string;
  pdf_url: string;
  duracao: string;
  ordem: string;
  status: "rascunho" | "publicada";
}

const emptyForm: AulaFormType = {
  moduloId: "",
  titulo: "",
  descricao: "",
  conteudo: "",
  video_url: "",
  pdf_url: "",
  duracao: "",
  ordem: "",
  status: "publicada",
};

type DeleteTarget =
  | {
      type: "aula";
      id: number;
      name: string;
    }
  | {
      type: "modulo";
      id: number;
      name: string;
      aulasCount: number;
    };

export default function ManageCourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAulaId, setEditingAulaId] = useState<number | null>(null);
  const [deletingAulaId, setDeletingAulaId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [editingModuloId, setEditingModuloId] = useState<number | null>(null);
    const [moduleForm, setModuleForm] = useState({
    titulo: "",
    ordem: "",
    });
    const [savingModulo, setSavingModulo] = useState(false);
    const [deletingModuloId, setDeletingModuloId] = useState<number | null>(null);
  

  const [form, setForm] = useState<AulaFormType>(emptyForm);

  async function loadCourseContent() {
    try {
      setLoading(true);

      const response = await api.get<CourseContentType>(
        `/courses/${courseId}/content`
      );

      setCourse(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar curso");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  function updateForm(field: keyof AulaFormType, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleNewAula(moduloId: number) {
    setEditingAulaId(null);

    setForm({
      ...emptyForm,
      moduloId,
      ordem: "1",
    });
  }

  function handleEditAula(aula: AulaType) {
    setEditingAulaId(aula.id);

    setForm({
      moduloId: aula.modulo_id,
      titulo: aula.titulo || "",
      descricao: aula.descricao || "",
      conteudo: aula.conteudo || "",
      video_url: aula.video_url || "",
      pdf_url: aula.pdf_url || "",
      duracao: aula.duracao ? String(aula.duracao) : "",
      ordem: aula.ordem ? String(aula.ordem) : "",
      status: aula.status || "publicada",
    });
  }

  function handleCancelEdit() {
    setEditingAulaId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.moduloId) {
      toast.error("Selecione um módulo");
      return;
    }

    if (!form.titulo.trim()) {
      toast.error("O título da aula é obrigatório");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        conteudo: form.conteudo,
        video_url: form.video_url,
        pdf_url: form.pdf_url,
        duracao: form.duracao ? Number(form.duracao) : null,
        ordem: form.ordem ? Number(form.ordem) : 0,
        status: form.status,
      };

      if (editingAulaId) {
        await api.put(`/aulas/${editingAulaId}`, payload);
        toast.success("Aula atualizada com sucesso");
      } else {
        await api.post(`/modulos/${form.moduloId}/aulas`, payload);
        toast.success("Aula criada com sucesso");
      }

      setEditingAulaId(null);
      setForm(emptyForm);

      await loadCourseContent();
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao salvar aula"
      );
    } finally {
      setSaving(false);
    }
  }

function handleDeleteAula(aula: AulaType) {
  setDeleteTarget({
    type: "aula",
    id: aula.id,
    name: aula.titulo,
  });
}
    function handleNewModulo() {
  setEditingModuloId(null);

  setModuleForm({
    titulo: "",
    ordem: course?.modulos.length
      ? String(course.modulos.length + 1)
      : "1",
  });
}

function handleEditModulo(modulo: ModuloType) {
  setEditingModuloId(modulo.id);

  setModuleForm({
    titulo: modulo.titulo,
    ordem: String(modulo.ordem),
  });
}

function handleCancelModuloEdit() {
  setEditingModuloId(null);

  setModuleForm({
    titulo: "",
    ordem: "",
  });
}

async function handleSaveModulo() {
  if (!courseId) {
    toast.error("Curso não encontrado");
    return;
  }

  if (!moduleForm.titulo.trim()) {
    toast.error("O título do módulo é obrigatório");
    return;
  }

  try {
    setSavingModulo(true);

    const payload = {
      titulo: moduleForm.titulo,
      ordem: moduleForm.ordem ? Number(moduleForm.ordem) : 0,
    };

    if (editingModuloId) {
      await api.put(`/modules/${editingModuloId}`, payload);
      toast.success("Módulo atualizado com sucesso");
    } else {
      await api.post(`/courses/${courseId}/modules`, payload);
      toast.success("Módulo criado com sucesso");
    }

    setEditingModuloId(null);

    setModuleForm({
      titulo: "",
      ordem: "",
    });

    await loadCourseContent();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao salvar módulo"
    );
  } finally {
    setSavingModulo(false);
  }
}

function handleDeleteModulo(modulo: ModuloType) {
  setDeleteTarget({
    type: "modulo",
    id: modulo.id,
    name: modulo.titulo,
    aulasCount: modulo.aulas.length,
  });
}


    async function confirmDelete() {
  if (!deleteTarget) {
    return;
  }

  try {
    if (deleteTarget.type === "aula") {
      setDeletingAulaId(deleteTarget.id);

      await api.delete(`/aulas/${deleteTarget.id}`);

      toast.success("Aula excluída com sucesso");
    }

    if (deleteTarget.type === "modulo") {
      setDeletingModuloId(deleteTarget.id);

      await api.delete(`/modules/${deleteTarget.id}`);

      toast.success("Módulo excluído com sucesso");

      if (editingModuloId === deleteTarget.id) {
        handleCancelModuloEdit();
      }
    }

    setDeleteTarget(null);

    await loadCourseContent();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao excluir"
    );
  } finally {
    setDeletingAulaId(null);
    setDeletingModuloId(null);
  }
}

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
        Carregando aulas...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
        Curso não encontrado.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto space-y-6">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/dashboard?tab=courses")}
              className="inline-flex items-center gap-2 text-blue-500 dark:text-blue-400 font-semibold mb-4"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              Gerenciar Aulas
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
              Curso: {course.titulo}
            </p>
          </div>

          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl px-6 py-4 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total de aulas
            </p>

            <strong className="text-3xl text-[#080E2F] dark:text-white">
              {course.total_aulas}
            </strong>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
          {/* Lista de módulos e aulas */}
          {/* Lista de módulos e aulas */}
<section className="space-y-5">
  {/* Gerenciar módulos */}
  <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
          Gerenciar Módulos
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Crie, edite ou organize os módulos deste curso.
        </p>
      </div>

      <button
        type="button"
        onClick={handleNewModulo}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={20} />
        Novo Módulo
      </button>
    </div>

    {(moduleForm.titulo || moduleForm.ordem || editingModuloId) && (
      <div className="mt-5 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-[#080E2F] dark:text-white mb-4">
          {editingModuloId ? "Editar módulo" : "Novo módulo"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3">
          <input
            type="text"
            value={moduleForm.titulo}
            onChange={(e) =>
              setModuleForm((prev) => ({
                ...prev,
                titulo: e.target.value,
              }))
            }
            placeholder="Título do módulo"
            className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
          />

          <input
            type="number"
            value={moduleForm.ordem}
            onChange={(e) =>
              setModuleForm((prev) => ({
                ...prev,
                ordem: e.target.value,
              }))
            }
            placeholder="Ordem"
            className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="button"
            onClick={handleSaveModulo}
            disabled={savingModulo}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={20} />

            {savingModulo
              ? "Salvando..."
              : editingModuloId
              ? "Salvar alterações"
              : "Criar módulo"}
          </button>

          <button
            type="button"
            onClick={handleCancelModuloEdit}
            className="border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            <X size={20} />
            Cancelar
          </button>
        </div>
      </div>
    )}
  </div>

  {course.modulos.length === 0 ? (
    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
      <BookOpen
        size={56}
        className="mx-auto text-blue-500 dark:text-blue-400"
      />

      <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mt-4">
        Nenhum módulo cadastrado
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Cadastre módulos antes de adicionar aulas.
      </p>
    </div>
  ) : (
    course.modulos.map((modulo) => (
      <div
        key={modulo.id}
        className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-sm dark:shadow-blue-500/30"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                {modulo.ordem}. {modulo.titulo}
              </h2>

              <span className="rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 px-3 py-1 text-xs font-bold">
                {modulo.aulas.length} aula(s)
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Ordem do módulo: {modulo.ordem}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleNewAula(modulo.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={18} />
              Aula
            </button>

            <button
              type="button"
              onClick={() => handleEditModulo(modulo)}
              className="bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-2xl px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-all"
            >
              <Edit size={18} />
              Editar
            </button>

            <button
              type="button"
              onClick={() => handleDeleteModulo(modulo)}
              disabled={deletingModuloId === modulo.id}
              className="bg-red-500/10 text-red-500 rounded-2xl px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
              {deletingModuloId === modulo.id
                ? "Excluindo..."
                : "Excluir"}
            </button>
          </div>
        </div>

        {modulo.aulas.length === 0 ? (
          <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-gray-500 dark:text-gray-400">
            Este módulo ainda não possui aulas.
          </div>
        ) : (
          <div className="space-y-3">
            {modulo.aulas.map((aula) => (
              <div
                key={aula.id}
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-[#080E2F] dark:text-white">
                        {aula.ordem}. {aula.titulo}
                      </h3>

                      <span
                        className={`
                          rounded-full px-3 py-1 text-xs font-bold
                          ${
                            aula.status === "publicada"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }
                        `}
                      >
                        {aula.status}
                      </span>
                    </div>

                    {aula.descricao && (
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {aula.descricao}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <Clock3 size={17} />
                        {aula.duracao || 0} min
                      </span>

                      {aula.video_url && (
                        <span className="flex items-center gap-2">
                          <Video size={17} />
                          Vídeo
                        </span>
                      )}

                      {aula.pdf_url && (
                        <span className="flex items-center gap-2">
                          <FileText size={17} />
                          PDF
                        </span>
                      )}

                      {aula.conteudo && (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={17} />
                          Conteúdo textual
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditAula(aula)}
                      className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-all"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      type="button"
                     onClick={() => handleDeleteAula(aula)}
                      disabled={deletingAulaId === aula.id}
                      className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ))
  )}
</section>
          {/* Formulário */}
          <aside className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 h-fit shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  {editingAulaId ? "Editar Aula" : "Nova Aula"}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Preencha os dados da aula
                </p>
              </div>

              {editingAulaId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#0d2238] text-gray-500 dark:text-gray-300 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  Módulo
                </label>

                <select
                  value={form.moduloId}
                  onChange={(e) =>
                    updateForm("moduloId", e.target.value)
                  }
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                >
                  <option value="">Selecione um módulo</option>

                  {course.modulos.map((modulo) => (
                    <option key={modulo.id} value={modulo.id}>
                      {modulo.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  Título da aula
                </label>

                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) =>
                    updateForm("titulo", e.target.value)
                  }
                  placeholder="Ex: Introdução ao dispositivo"
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  Descrição
                </label>

                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    updateForm("descricao", e.target.value)
                  }
                  placeholder="Descrição breve da aula"
                  rows={3}
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  Conteúdo textual
                </label>

                <textarea
                  value={form.conteudo}
                  onChange={(e) =>
                    updateForm("conteudo", e.target.value)
                  }
                  placeholder="Conteúdo da aula"
                  rows={5}
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                    Duração
                  </label>

                  <input
                    type="number"
                    value={form.duracao}
                    onChange={(e) =>
                      updateForm("duracao", e.target.value)
                    }
                    placeholder="Minutos"
                    className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                    Ordem
                  </label>

                  <input
                    type="number"
                    value={form.ordem}
                    onChange={(e) =>
                      updateForm("ordem", e.target.value)
                    }
                    placeholder="1"
                    className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  URL do vídeo
                </label>

                <input
                  type="text"
                  value={form.video_url}
                  onChange={(e) =>
                    updateForm("video_url", e.target.value)
                  }
                  placeholder="https://..."
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  URL do PDF
                </label>

                <input
                  type="text"
                  value={form.pdf_url}
                  onChange={(e) =>
                    updateForm("pdf_url", e.target.value)
                  }
                  placeholder="https://..."
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value as "rascunho" | "publicada"
                    )
                  }
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 shadow-md shadow-slate-300/40 dark:shadow-sm dark:shadow-blue-500/30"
                >
                  <option value="publicada">Publicada</option>
                  <option value="rascunho">Rascunho</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl dark:shadow-sm dark:shadow-blue-500/40"
              >
                <Save size={22} />

                {saving
                  ? "Salvando..."
                  : editingAulaId
                  ? "Salvar alterações"
                  : "Criar aula"}
              </button>
            </form>
          </aside>
        </div>
      </div>
      
      {deleteTarget && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
        <AlertTriangle size={36} />
      </div>

      <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white text-center mt-5">
        Confirmar exclusão
      </h2>

      <p className="text-gray-500 dark:text-gray-400 text-center mt-3 leading-relaxed">
        Tem certeza que deseja excluir{" "}
        {deleteTarget.type === "aula" ? "a aula" : "o módulo"}{" "}
        <strong className="text-[#080E2F] dark:text-white">
          “{deleteTarget.name}”
        </strong>
        ?
      </p>

      {deleteTarget.type === "modulo" && deleteTarget.aulasCount > 0 && (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-500 text-sm font-medium">
          Este módulo possui {deleteTarget.aulasCount} aula(s). Ao excluir o módulo, essas aulas também serão removidas.
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setDeleteTarget(null)}
          className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={confirmDelete}
          disabled={
            (deleteTarget.type === "aula" &&
              deletingAulaId === deleteTarget.id) ||
            (deleteTarget.type === "modulo" &&
              deletingModuloId === deleteTarget.id)
          }
          className="flex-1 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {(deleteTarget.type === "aula" &&
            deletingAulaId === deleteTarget.id) ||
          (deleteTarget.type === "modulo" &&
            deletingModuloId === deleteTarget.id)
            ? "Excluindo..."
            : "Excluir"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}