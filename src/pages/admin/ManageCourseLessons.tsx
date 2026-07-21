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
  Brain,
Loader2,
Sparkles,
UploadCloud,
Wand2,
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

  interface GeneratedAulaType {
  titulo: string;
  descricao?: string;
  conteudo?: string;
  duracao?: number;
  ordem?: number;
}

interface GeneratedModuloType {
  titulo: string;
  ordem?: number;
  aulas: GeneratedAulaType[];
}

interface GeneratedCourseType {
  titulo?: string;
  descricao?: string;
  modulos: GeneratedModuloType[];
}

type AdminQuizTipo = "aula" | "modulo" | "prova_final";
type AdminQuizStatus = "rascunho" | "publicado";

interface AdminQuizType {
  id: number;
  curso_id: number;
  modulo_id: number | null;
  aula_id: number | null;
  titulo: string;
  tipo: AdminQuizTipo;
  nota_minima: number | string;
  max_tentativas: number | string;
  questoes_por_tentativa?: number | string;
  sorteio_ativo?: boolean | number;
  status: AdminQuizStatus;
  criado_em: string;
  total_questoes: number | string;
}

interface QuizOptionFormType {
  texto_opcao: string;
  correta: boolean;
}

interface QuizQuestionFormType {
  pergunta: string;
  explicacao: string;
  ordem: string;
  opcoes: QuizOptionFormType[];
}

interface QuizFormType {
  titulo: string;
  tipo: AdminQuizTipo;
  modulo_id: number | "";
  aula_id: number | "";
  nota_minima: string;
  max_tentativas: string;
  questoes_por_tentativa: string;
  sorteio_ativo: boolean;
  status: AdminQuizStatus;
  questoes: QuizQuestionFormType[];
}

function createEmptyQuizQuestion(ordem = 1): QuizQuestionFormType {
  return {
    pergunta: "",
    explicacao: "",
    ordem: String(ordem),
    opcoes: [
      {
        texto_opcao: "",
        correta: true,
      },
      {
        texto_opcao: "",
        correta: false,
      },
      {
        texto_opcao: "",
        correta: false,
      },
      {
        texto_opcao: "",
        correta: false,
      },
    ],
  };
}

const emptyQuizForm: QuizFormType = {
  titulo: "",
  tipo: "modulo",
  modulo_id: "",
  aula_id: "",
  nota_minima: "70",
  max_tentativas: "3",
  questoes_por_tentativa: "5",
  sorteio_ativo: true,
  status: "rascunho",
  questoes: [createEmptyQuizQuestion(1)],
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

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPdf, setAiPdf] = useState<File | null>(null);
  const [generatedCourse, setGeneratedCourse] =
    useState<GeneratedCourseType | null>(null);

  const [generatingWithAi, setGeneratingWithAi] = useState(false);
  const [applyingGeneratedCourse, setApplyingGeneratedCourse] =
    useState(false);


  const [quizzes, setQuizzes] = useState<AdminQuizType[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<AdminQuizType | null>(null);
  const [quizForm, setQuizForm] = useState<QuizFormType>(emptyQuizForm);
  const [loadingQuizDetails, setLoadingQuizDetails] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null);


  const [replaceExistingContent, setReplaceExistingContent] =
    useState(false);

  function handleCloseAiModal() {
  if (generatingWithAi || applyingGeneratedCourse) {
    return;
  }

  setAiModalOpen(false);
  setAiPdf(null);
  setGeneratedCourse(null);
  setReplaceExistingContent(false);
}

async function handleGenerateCourseWithAi() {
  if (!courseId) {
    toast.error("Curso não encontrado");
    return;
  }

  if (!aiPdf) {
    toast.error("Selecione um PDF primeiro");
    return;
  }

  if (aiPdf.type !== "application/pdf") {
    toast.error("Envie apenas arquivos PDF");
    return;
  }

  try {
    setGeneratingWithAi(true);
    setGeneratedCourse(null);

    const formData = new FormData();

    formData.append("pdf", aiPdf);

    const response = await api.post(
      `/courses/${courseId}/ai/generate-from-pdf`,
      formData,
      {
        timeout: 300000,
      }
    );

    setGeneratedCourse(response.data.generated_course);

    toast.success("Estrutura gerada com IA");
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao gerar aulas com IA"
    );
  } finally {
    setGeneratingWithAi(false);
  }
}

async function handleApplyGeneratedCourse() {
  if (!courseId) {
    toast.error("Curso não encontrado");
    return;
  }

  if (!generatedCourse) {
    toast.error("Nenhuma estrutura gerada para aplicar");
    return;
  }

  try {
    setApplyingGeneratedCourse(true);

    await api.post(`/courses/${courseId}/ai/apply-generated-course`, {
      replaceExisting: replaceExistingContent,
      generated_course: generatedCourse,
    });

    toast.success("Curso gerado aplicado com sucesso");

    setAiModalOpen(false);
    setAiPdf(null);
    setGeneratedCourse(null);
    setReplaceExistingContent(false);

    await loadCourseContent();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao aplicar curso gerado"
    );
  } finally {
    setApplyingGeneratedCourse(false);
  }
}




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
  loadCourseQuizzes();
}, [courseId]);
  function updateForm(field: keyof AulaFormType, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

 function handleNewAula(moduloId: number) {
  setEditingAulaId(null);

  const modulo = course?.modulos.find((item) => item.id === moduloId);

  const nextOrder = modulo?.aulas.length
    ? modulo.aulas.length + 1
    : 1;

  setForm({
    ...emptyForm,
    moduloId,
    ordem: String(nextOrder),
  });
}

async function loadCourseQuizzes() {
  if (!courseId) {
    return;
  }

  try {
    setLoadingQuizzes(true);

    const response = await api.get<AdminQuizType[]>(
      `/courses/${courseId}/quizzes`
    );

    setQuizzes(response.data);
  } catch (error) {
    console.log(error);
    toast.error("Erro ao carregar avaliações do curso");
  } finally {
    setLoadingQuizzes(false);
  }
}

function normalizeBoolean(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function handleCloseQuizModal() {
  if (savingQuiz || loadingQuizDetails) {
    return;
  }

  setQuizModalOpen(false);
  setSelectedQuiz(null);
  setQuizForm(emptyQuizForm);
}

function openCreateFinalExamModal() {
  setSelectedQuiz(null);

  setQuizForm({
    ...emptyQuizForm,
    titulo: `Prova Final - ${course?.titulo || "Curso"}`,
    tipo: "prova_final",
    modulo_id: "",
    aula_id: "",
    status: "rascunho",
  });

  setQuizModalOpen(true);
}

function openCreateModuleQuizModal(modulo: ModuloType) {
  setSelectedQuiz(null);

  setQuizForm({
    ...emptyQuizForm,
    titulo: `Quiz do módulo - ${modulo.titulo}`,
    tipo: "modulo",
    modulo_id: modulo.id,
    aula_id: "",
    status: "rascunho",
  });

  setQuizModalOpen(true);
}

async function openEditQuizModal(quiz: AdminQuizType) {
  try {
    setSelectedQuiz(quiz);
    setQuizModalOpen(true);
    setLoadingQuizDetails(true);

    const response = await api.get(`/quizzes/${quiz.id}`);

    const quizDetails = response.data;

    setQuizForm({
      titulo: quizDetails.titulo || "",
      tipo: quizDetails.tipo || "modulo",
      modulo_id: quizDetails.modulo_id || "",
      aula_id: quizDetails.aula_id || "",
      nota_minima: String(quizDetails.nota_minima || 70),
      max_tentativas: String(quizDetails.max_tentativas || 3),
      questoes_por_tentativa: String(
        quizDetails.questoes_por_tentativa ||
          quizDetails.questoes?.length ||
          5
      ),
      sorteio_ativo: normalizeBoolean(quizDetails.sorteio_ativo),
      status: quizDetails.status || "rascunho",
      questoes:
        quizDetails.questoes?.length > 0
          ? quizDetails.questoes.map((questao: any, index: number) => ({
              pergunta: questao.pergunta || "",
              explicacao: questao.explicacao || "",
              ordem: String(questao.ordem || index + 1),
              opcoes:
                questao.opcoes?.length > 0
                  ? questao.opcoes.map((opcao: any) => ({
                      texto_opcao: opcao.texto_opcao || "",
                      correta: normalizeBoolean(opcao.correta),
                    }))
                  : createEmptyQuizQuestion(index + 1).opcoes,
            }))
          : [createEmptyQuizQuestion(1)],
    });
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao carregar quiz"
    );

    setQuizModalOpen(false);
    setSelectedQuiz(null);
  } finally {
    setLoadingQuizDetails(false);
  }
}

function updateQuizForm(field: keyof QuizFormType, value: any) {
  setQuizForm((prev) => ({
    ...prev,
    [field]: value,
  }));
}

function updateQuizQuestion(
  questionIndex: number,
  field: keyof QuizQuestionFormType,
  value: string
) {
  setQuizForm((prev) => ({
    ...prev,
    questoes: prev.questoes.map((questao, index) =>
      index === questionIndex
        ? {
            ...questao,
            [field]: value,
          }
        : questao
    ),
  }));
}

function updateQuizOption(
  questionIndex: number,
  optionIndex: number,
  value: string
) {
  setQuizForm((prev) => ({
    ...prev,
    questoes: prev.questoes.map((questao, qIndex) =>
      qIndex === questionIndex
        ? {
            ...questao,
            opcoes: questao.opcoes.map((opcao, oIndex) =>
              oIndex === optionIndex
                ? {
                    ...opcao,
                    texto_opcao: value,
                  }
                : opcao
            ),
          }
        : questao
    ),
  }));
}

function markCorrectOption(questionIndex: number, optionIndex: number) {
  setQuizForm((prev) => ({
    ...prev,
    questoes: prev.questoes.map((questao, qIndex) =>
      qIndex === questionIndex
        ? {
            ...questao,
            opcoes: questao.opcoes.map((opcao, oIndex) => ({
              ...opcao,
              correta: oIndex === optionIndex,
            })),
          }
        : questao
    ),
  }));
}

function addQuizQuestion() {
  setQuizForm((prev) => ({
    ...prev,
    questoes: [
      ...prev.questoes,
      createEmptyQuizQuestion(prev.questoes.length + 1),
    ],
  }));
}

function removeQuizQuestion(questionIndex: number) {
  setQuizForm((prev) => {
    if (prev.questoes.length <= 1) {
      toast.error("O quiz precisa ter pelo menos uma questão.");
      return prev;
    }

    return {
      ...prev,
      questoes: prev.questoes
        .filter((_, index) => index !== questionIndex)
        .map((questao, index) => ({
          ...questao,
          ordem: String(index + 1),
        })),
    };
  });
}

async function handleSaveQuiz() {
  if (!courseId) {
    toast.error("Curso não encontrado.");
    return;
  }

  if (!quizForm.titulo.trim()) {
    toast.error("Informe o título do quiz.");
    return;
  }

  if (quizForm.tipo === "modulo" && !quizForm.modulo_id) {
    toast.error("Selecione o módulo do quiz.");
    return;
  }

  if (quizForm.questoes.length === 0) {
    toast.error("O quiz precisa ter pelo menos uma questão.");
    return;
  }

  for (const questao of quizForm.questoes) {
    if (!questao.pergunta.trim()) {
      toast.error("Todas as questões precisam ter pergunta.");
      return;
    }

    const filledOptions = questao.opcoes.filter((opcao) =>
      opcao.texto_opcao.trim()
    );

    if (filledOptions.length < 2) {
      toast.error("Cada questão precisa ter pelo menos duas alternativas.");
      return;
    }

    const correctOptions = questao.opcoes.filter(
      (opcao) => opcao.correta && opcao.texto_opcao.trim()
    );

    if (correctOptions.length !== 1) {
      toast.error("Cada questão precisa ter exatamente uma alternativa correta.");
      return;
    }
  }

  try {
    setSavingQuiz(true);

    const payload = {
      curso_id: Number(courseId),
      modulo_id:
        quizForm.tipo === "modulo" ? Number(quizForm.modulo_id) : null,
      aula_id: quizForm.tipo === "aula" ? Number(quizForm.aula_id) : null,
      titulo: quizForm.titulo,
      tipo: quizForm.tipo,
      nota_minima: Number(quizForm.nota_minima || 70),
      max_tentativas: Number(quizForm.max_tentativas || 3),
      questoes_por_tentativa: Number(
        quizForm.questoes_por_tentativa || quizForm.questoes.length
      ),
      sorteio_ativo: quizForm.sorteio_ativo,
      status: quizForm.status,
      questoes: quizForm.questoes.map((questao, index) => ({
        pergunta: questao.pergunta,
        explicacao: questao.explicacao,
        ordem: Number(questao.ordem || index + 1),
        opcoes: questao.opcoes
          .filter((opcao) => opcao.texto_opcao.trim())
          .map((opcao) => ({
            texto_opcao: opcao.texto_opcao,
            correta: opcao.correta,
          })),
      })),
    };

    if (selectedQuiz) {
      await api.put(`/quizzes/${selectedQuiz.id}`, payload);
      toast.success("Quiz atualizado com sucesso.");
    } else {
      await api.post("/quizzes", payload);
      toast.success("Quiz criado com sucesso.");
    }

    setQuizModalOpen(false);
    setSelectedQuiz(null);
    setQuizForm(emptyQuizForm);

    await loadCourseQuizzes();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao salvar quiz."
    );
  } finally {
    setSavingQuiz(false);
  }
}

async function handleDeleteQuiz(quiz: AdminQuizType) {
  const confirmDelete = window.confirm(
    `Tem certeza que deseja excluir o quiz "${quiz.titulo}"?`
  );

  if (!confirmDelete) {
    return;
  }

  try {
    setDeletingQuizId(quiz.id);

    await api.delete(`/quizzes/${quiz.id}`);

    toast.success("Quiz excluído com sucesso.");

    await loadCourseQuizzes();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao excluir quiz."
    );
  } finally {
    setDeletingQuizId(null);
  }
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

  <div className="flex flex-col sm:flex-row gap-3">
    <button
      type="button"
      onClick={() => setAiModalOpen(true)}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-all shadow-xl dark:shadow-sm dark:shadow-blue-500/40"
    >
      <Sparkles size={22} />
      Gerar com IA
    </button>

    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl px-6 py-4 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total de aulas
      </p>

      <strong className="text-3xl text-[#080E2F] dark:text-white">
        {course.total_aulas}
      </strong>
    </div>
  </div>
</header>

    <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
    <div>
      <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
        Avaliações do curso
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Quizzes de módulo e prova final vinculados a este curso.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
  <button
    type="button"
    onClick={openCreateFinalExamModal}
    className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
  >
    <Plus size={18} />
    Nova prova final
  </button>

  <span className="w-fit rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 text-sm font-bold">
    {quizzes.length} avaliação(ões)
  </span>
</div>
  </div>

  {loadingQuizzes ? (
    <div className="rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-5 text-gray-500 dark:text-gray-400">
      Carregando avaliações...
    </div>
  ) : quizzes.length === 0 ? (
    <div className="rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-5 text-gray-500 dark:text-gray-400">
      Nenhuma avaliação cadastrada para este curso.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#080E2F] dark:text-white">
                {quiz.titulo}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {quiz.tipo === "prova_final"
                  ? "Prova final"
                  : quiz.tipo === "modulo"
                  ? "Quiz de módulo"
                  : "Quiz de aula"}
              </p>
            </div>

            <span
              className={`
                rounded-full px-3 py-1 text-xs font-bold
                ${
                  quiz.status === "publicado"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                }
              `}
            >
              {quiz.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="rounded-xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-3">
              <p className="text-gray-500 dark:text-gray-400">Questões</p>
              <strong className="text-[#080E2F] dark:text-white">
                {quiz.total_questoes}
              </strong>
            </div>

            <div className="rounded-xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-3">
              <p className="text-gray-500 dark:text-gray-400">Nota mínima</p>
              <strong className="text-[#080E2F] dark:text-white">
                {quiz.nota_minima}%
              </strong>
            </div>

            <div className="rounded-xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-3">
              <p className="text-gray-500 dark:text-gray-400">Tentativas</p>
              <strong className="text-[#080E2F] dark:text-white">
                {quiz.max_tentativas}
              </strong>
            </div>

            <div className="rounded-xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-3">
              <p className="text-gray-500 dark:text-gray-400">Sorteio</p>
              <strong className="text-[#080E2F] dark:text-white">
                {Number(quiz.sorteio_ativo) === 1 ? "Sim" : "Não"}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              type="button"
              onClick={() => openEditQuizModal(quiz)}
              className="flex-1 rounded-2xl bg-blue-500/10 px-4 py-3 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Edit size={18} />
              Editar
            </button>

            <button
              type="button"
              onClick={() => handleDeleteQuiz(quiz)}
              disabled={deletingQuizId === quiz.id}
              className="flex-1 rounded-2xl bg-red-500/10 px-4 py-3 font-semibold text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
              {deletingQuizId === quiz.id ? "Excluindo..." : "Excluir"}
            </button>
          </div>
                    </div>
                ))}
              </div>
            )}
          </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
         
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
    onClick={() => openCreateModuleQuizModal(modulo)}
    className="bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-all"
  >
    <Brain size={18} />
    Quiz
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
    {deletingModuloId === modulo.id ? "Excluindo..." : "Excluir"}
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
      


      {quizModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
    <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 shadow-2xl">
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#091a2c]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-6 rounded-t-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              {selectedQuiz ? "Editar avaliação" : "Nova avaliação"}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Configure o quiz, as perguntas e as alternativas corretas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCloseQuizModal}
            disabled={savingQuiz || loadingQuizDetails}
            className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {loadingQuizDetails ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Carregando dados do quiz...
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <section className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2238] p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                  Título
                </label>

                <input
                  value={quizForm.titulo}
                  onChange={(event) =>
                    updateQuizForm("titulo", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                  placeholder="Ex: Quiz do módulo - Introdução"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                  Tipo
                </label>

                <select
                  value={quizForm.tipo}
                  onChange={(event) =>
                    updateQuizForm(
                      "tipo",
                      event.target.value as AdminQuizTipo
                    )
                  }
                  disabled={!!selectedQuiz}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 disabled:opacity-70"
                >
                  <option value="modulo">Quiz de módulo</option>
                  <option value="prova_final">Prova final</option>
                </select>
              </div>

              {quizForm.tipo === "modulo" && (
                <div>
                  <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                    Módulo
                  </label>

                  <select
                    value={quizForm.modulo_id}
                    onChange={(event) =>
                      updateQuizForm("modulo_id", Number(event.target.value))
                    }
                    disabled={!!selectedQuiz}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 disabled:opacity-70"
                  >
                    <option value="">Selecione um módulo</option>

                    {course.modulos.map((modulo) => (
                      <option key={modulo.id} value={modulo.id}>
                        {modulo.ordem}. {modulo.titulo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                  Nota mínima (%)
                </label>

                <input
                  type="number"
                  value={quizForm.nota_minima}
                  onChange={(event) =>
                    updateQuizForm("nota_minima", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                  Máximo de tentativas
                </label>

                <input
                  type="number"
                  value={quizForm.max_tentativas}
                  onChange={(event) =>
                    updateQuizForm("max_tentativas", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                  Questões por tentativa
                </label>

                <input
                  type="number"
                  value={quizForm.questoes_por_tentativa}
                  onChange={(event) =>
                    updateQuizForm(
                      "questoes_por_tentativa",
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                  Status
                </label>

                <select
                  value={quizForm.status}
                  onChange={(event) =>
                    updateQuizForm(
                      "status",
                      event.target.value as AdminQuizStatus
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>

              <label className="lg:col-span-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={quizForm.sorteio_ativo}
                  onChange={(event) =>
                    updateQuizForm("sorteio_ativo", event.target.checked)
                  }
                  className="w-5 h-5 accent-blue-600"
                />

                <div>
                  <p className="font-semibold text-[#080E2F] dark:text-white">
                    Sortear questões por tentativa
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quando ativo, o aluno recebe questões aleatórias da base do
                    quiz.
                  </p>
                </div>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  Questões
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  Cada questão precisa ter uma alternativa correta.
                </p>
              </div>

              <button
                type="button"
                onClick={addQuizQuestion}
                className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Nova questão
              </button>
            </div>

            {quizForm.questoes.map((questao, questionIndex) => (
              <div
                key={questionIndex}
                className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2238] p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className="font-bold text-[#080E2F] dark:text-white">
                    Questão {questionIndex + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() => removeQuizQuestion(questionIndex)}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Remover
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    value={questao.pergunta}
                    onChange={(event) =>
                      updateQuizQuestion(
                        questionIndex,
                        "pergunta",
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                    placeholder="Pergunta"
                  />

                  <textarea
                    value={questao.explicacao}
                    onChange={(event) =>
                      updateQuizQuestion(
                        questionIndex,
                        "explicacao",
                        event.target.value
                      )
                    }
                    rows={2}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 resize-none"
                    placeholder="Explicação da resposta correta"
                  />

                  <div className="space-y-3">
                    {questao.opcoes.map((opcao, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3 md:items-center"
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#080E2F] dark:text-white">
                          <input
                            type="radio"
                            checked={opcao.correta}
                            onChange={() =>
                              markCorrectOption(questionIndex, optionIndex)
                            }
                            className="w-5 h-5 accent-blue-600"
                          />
                          Correta
                        </label>

                        <input
                          value={opcao.texto_opcao}
                          onChange={(event) =>
                            updateQuizOption(
                              questionIndex,
                              optionIndex,
                              event.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                          placeholder={`Alternativa ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseQuizModal}
              disabled={savingQuiz}
              className="rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveQuiz}
              disabled={savingQuiz}
              className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {savingQuiz ? "Salvando..." : "Salvar avaliação"}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

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


{aiModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
    <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 shadow-2xl">
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#091a2c]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-6 rounded-t-3xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shrink-0">
              <Brain size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Gerar aulas com IA
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Envie um manual em PDF para a IA sugerir módulos e aulas em texto.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseAiModal}
            disabled={generatingWithAi || applyingGeneratedCourse}
            className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Upload */}
        <section className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2238] p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h3 className="text-xl font-bold text-[#080E2F] dark:text-white flex items-center gap-2">
                <UploadCloud size={24} className="text-blue-500" />
                Manual técnico em PDF
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Selecione o PDF do dispositivo. A IA vai gerar uma estrutura editável antes de salvar.
              </p>
            </div>

            <label className="cursor-pointer rounded-2xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 px-5 py-4 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2">
              <UploadCloud size={22} />
              Selecionar PDF

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  setAiPdf(file);
                  setGeneratedCourse(null);
                }}
              />
            </label>
          </div>

          {aiPdf && (
            <div className="mt-5 rounded-2xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[#080E2F] dark:text-white truncate">
                    {aiPdf.name}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(aiPdf.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAiPdf(null);
                  setGeneratedCourse(null);
                }}
                disabled={generatingWithAi}
                className="text-red-500 font-semibold hover:underline disabled:opacity-60"
              >
                Remover
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerateCourseWithAi}
            disabled={!aiPdf || generatingWithAi}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-4 font-bold text-white flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generatingWithAi ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Gerando estrutura com IA...
              </>
            ) : (
              <>
                <Wand2 size={24} />
                Gerar estrutura com IA
              </>
            )}
          </button>
        </section>

        {/* Preview */}
        {generatedCourse && (
          <section className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 text-sm font-semibold mb-4">
                  <CheckCircle2 size={18} />
                  Estrutura gerada
                </div>

                <h3 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                  {generatedCourse.titulo || "Curso gerado com IA"}
                </h3>

                {generatedCourse.descricao && (
                  <p className="text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    {generatedCourse.descricao}
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4 min-w-[220px]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total gerado
                </p>

                <p className="text-2xl font-bold text-[#080E2F] dark:text-white mt-1">
                  {generatedCourse.modulos.length} módulos
                </p>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {generatedCourse.modulos.reduce(
                    (total, modulo) => total + modulo.aulas.length,
                    0
                  )}{" "}
                  aulas
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {generatedCourse.modulos.map((modulo, moduloIndex) => (
                <div
                  key={`${modulo.titulo}-${moduloIndex}`}
                  className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2238] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-[#080E2F] dark:text-white">
                        {modulo.titulo}
                      </h4>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {modulo.aulas.length} aula(s)
                      </p>
                    </div>

                    <span className="rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 text-sm font-bold">
                      Ordem {modulo.ordem || moduloIndex + 1}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {modulo.aulas.map((aula, aulaIndex) => (
                      <div
                        key={`${aula.titulo}-${aulaIndex}`}
                        className="rounded-2xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <h5 className="font-bold text-[#080E2F] dark:text-white">
                              {aula.titulo}
                            </h5>

                            {aula.descricao && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {aula.descricao}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                            <Clock3 size={16} />
                            {aula.duracao || 10} min
                          </div>
                        </div>

                        {aula.conteudo && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-3">
                            {aula.conteudo}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={replaceExistingContent}
                  onChange={(e) =>
                    setReplaceExistingContent(e.target.checked)
                  }
                  className="mt-1 w-5 h-5 accent-blue-600"
                />

                <div>
                  <p className="font-bold text-[#080E2F] dark:text-white">
                    Substituir módulos e aulas atuais
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Se marcado, o sistema apagará o conteúdo atual do curso e salvará apenas a estrutura gerada pela IA.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setGeneratedCourse(null)}
                disabled={applyingGeneratedCourse}
                className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
              >
                Gerar novamente
              </button>

              <button
                type="button"
                onClick={handleApplyGeneratedCourse}
                disabled={applyingGeneratedCourse}
                className="flex-1 rounded-2xl bg-blue-500 px-5 py-4 font-bold text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {applyingGeneratedCourse ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Aplicar ao curso
                  </>
                )}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
)}
    </main>
  );
}