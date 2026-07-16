import {
  BookOpen,
  CheckCircle2,
  Cpu,
  FileText,
  Loader2,
  RefreshCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { api } from "../../services/api";
import toast from "react-hot-toast";
import { generateCourseAssessments } from "../../services/aiAssessmentService";

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
}

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

export default function CreateCourse() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);

  const [thumbnail, setThumbnail] = useState("");
  const [baseTitle, setBaseTitle] = useState("");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState("");

  const [generatedCourse, setGeneratedCourse] =
    useState<GeneratedCourseType | null>(null);

  const [createdCourseId, setCreatedCourseId] =
    useState<number | null>(null);

  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [generateAssessments, setGenerateAssessments] = useState(true);
  const [generatingAssessments, setGeneratingAssessments] = useState(false);

  async function getDevices() {
    try {
      const response = await api.get<DeviceType[]>("/devices");

      setDevices(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar dispositivos");
    }
  }

  useEffect(() => {
    getDevices();
  }, []);

  const selectedDeviceObjects = devices.filter((device) =>
    selectedDevices.includes(device.id)
  );

  function toggleDevice(deviceId: number) {
    setGeneratedCourse(null);

    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(
        selectedDevices.filter((id) => id !== deviceId)
      );
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  }

  function handleSelectPdf() {
    fileInputRef.current?.click();
  }

  function handlePdfChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Envie apenas arquivos PDF");
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);
    setGeneratedCourse(null);
  }

  function getInitialCourseTitle() {
    if (baseTitle.trim()) {
      return baseTitle.trim();
    }

    if (selectedDeviceObjects.length > 0) {
      return `Treinamento ${selectedDeviceObjects[0].nome}`;
    }

    if (pdfName) {
      return pdfName.replace(/\.pdf$/i, "");
    }

    return "Curso gerado com IA";
  }

  async function createBaseCourseIfNeeded() {
    if (createdCourseId) {
      return createdCourseId;
    }

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?.id) {
      throw new Error("Usuário logado não encontrado");
    }

    const response = await api.post("/courses", {
      titulo: getInitialCourseTitle(),
      descricao: "Curso criado com IA a partir de manual técnico.",
      thumbnail,
      criado_por: user.id,
    });

    const courseId =
      response.data.courseId ||
      response.data.cursoId ||
      response.data.id;

    if (!courseId) {
      throw new Error("Curso criado, mas o ID não foi retornado");
    }

    setCreatedCourseId(courseId);

    return courseId;
  }

  async function handleGenerateCourseWithAi() {
    if (selectedDevices.length === 0) {
      toast.error("Selecione pelo menos um dispositivo relacionado");
      return;
    }

    if (!pdfFile) {
      toast.error("Selecione o PDF de treinamento");
      return;
    }

    try {
      setGenerating(true);

      const courseId = await createBaseCourseIfNeeded();

      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const response = await api.post(
        `/courses/${courseId}/ai/generate-from-pdf`,
        formData,
        {
          timeout: 300000,
        }
      );

      setGeneratedCourse(response.data.generated_course);

      toast.success("Curso gerado com IA");
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Erro ao gerar curso com IA"
      );
    } finally {
      setGenerating(false);
    }
  }

  
async function handlePublishCourse() {
  if (!createdCourseId) {
    toast.error("Gere o curso com IA antes de publicar");
    return;
  }

  if (!generatedCourse) {
    toast.error("Nenhum conteúdo gerado para publicar");
    return;
  }

  try {
    setPublishing(true);

    await api.post(
      `/courses/${createdCourseId}/ai/apply-generated-course`,
      {
        replaceExisting: true,
        generated_course: generatedCourse,
      }
    );

    if (selectedDevices.length > 0) {
      await Promise.all(
        selectedDevices.map((deviceId) =>
          api.post(
            `/devices/courses/${createdCourseId}/devices/${deviceId}`
          )
        )
      );
    }

    if (generateAssessments) {
      setGeneratingAssessments(true);

      await generateCourseAssessments(createdCourseId, {
        moduleQuestions: 5,
        finalExamQuestions: 10,
        status: "publicado",
        nota_minima: 70,
        max_tentativas: 3,
      });

      toast.success("Curso, quizzes e prova final gerados com sucesso!");
    } else {
      toast.success("Curso publicado com sucesso!");
    }

    resetPage();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Erro ao publicar curso ou gerar avaliações"
    );
  } finally {
    setPublishing(false);
    setGeneratingAssessments(false);
  }
}


  function resetPage() {
    setSelectedDevices([]);
    setThumbnail("");
    setBaseTitle("");
    setPdfFile(null);
    setPdfName("");
    setGeneratedCourse(null);
    setCreatedCourseId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function updateGeneratedCourseField(
    field: keyof GeneratedCourseType,
    value: string
  ) {
    if (!generatedCourse) {
      return;
    }

    setGeneratedCourse({
      ...generatedCourse,
      [field]: value,
    });
  }

  function updateGeneratedModulo(
    moduloIndex: number,
    field: keyof GeneratedModuloType,
    value: string
  ) {
    if (!generatedCourse) {
      return;
    }

    const updatedModules = [...generatedCourse.modulos];

    updatedModules[moduloIndex] = {
      ...updatedModules[moduloIndex],
      [field]: value,
    };

    setGeneratedCourse({
      ...generatedCourse,
      modulos: updatedModules,
    });
  }

  function updateGeneratedAula(
    moduloIndex: number,
    aulaIndex: number,
    field: keyof GeneratedAulaType,
    value: string
  ) {
    if (!generatedCourse) {
      return;
    }

    const updatedModules = [...generatedCourse.modulos];

    const updatedAulas = [...updatedModules[moduloIndex].aulas];

    updatedAulas[aulaIndex] = {
      ...updatedAulas[aulaIndex],
      [field]:
        field === "duracao" || field === "ordem"
          ? Number(value)
          : value,
    };

    updatedModules[moduloIndex] = {
      ...updatedModules[moduloIndex],
      aulas: updatedAulas,
    };

    setGeneratedCourse({
      ...generatedCourse,
      modulos: updatedModules,
    });
  }

  function removeGeneratedAula(
    moduloIndex: number,
    aulaIndex: number
  ) {
    if (!generatedCourse) {
      return;
    }

    const updatedModules = [...generatedCourse.modulos];

    updatedModules[moduloIndex] = {
      ...updatedModules[moduloIndex],
      aulas: updatedModules[moduloIndex].aulas.filter(
        (_, index) => index !== aulaIndex
      ),
    };

    setGeneratedCourse({
      ...generatedCourse,
      modulos: updatedModules,
    });
  }

  const totalGeneratedLessons =
    generatedCourse?.modulos.reduce(
      (total, modulo) => total + modulo.aulas.length,
      0
    ) || 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 font-semibold mb-4">
              <Sparkles size={18} />
              IA para criação de treinamentos
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-[#080E2F] dark:text-white">
              Criar curso com IA
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-3 text-base lg:text-lg max-w-3xl">
              Escolha o dispositivo, envie o PDF técnico e deixe a IA gerar
              automaticamente as informações do curso, módulos e aulas.
            </p>
          </div>

          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl px-6 py-5 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fluxo
            </p>

            <strong className="text-[#080E2F] dark:text-white">
              Dispositivo → PDF → IA → Publicar
            </strong>
          </div>
        </header>

        {/* Etapas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#091a2c] border border-blue-500/20 rounded-3xl p-5 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Cpu size={26} />
            </div>

            <h2 className="font-bold text-[#080E2F] dark:text-white">
              1. Dispositivo
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Escolha qual equipamento será treinado.
            </p>
          </div>

          <div className="bg-white dark:bg-[#091a2c] border border-purple-500/20 rounded-3xl p-5 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <FileText size={26} />
            </div>

            <h2 className="font-bold text-[#080E2F] dark:text-white">
              2. PDF técnico
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Envie o manual usado como base do curso.
            </p>
          </div>

          <div className="bg-white dark:bg-[#091a2c] border border-green-500/20 rounded-3xl p-5 shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
              <Wand2 size={26} />
            </div>

            <h2 className="font-bold text-[#080E2F] dark:text-white">
              3. Curso gerado
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Revise módulos e aulas antes de publicar.
            </p>
          </div>
        </section>

        {/* Dispositivos */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Cpu className="text-blue-500 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Dispositivo relacionado
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Selecione o dispositivo que condiz com o PDF de treinamento.
              </p>
            </div>
          </div>

          {devices.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-gray-500 dark:text-gray-400">
              Nenhum dispositivo cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {devices.map((device) => {
                const selected = selectedDevices.includes(device.id);

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => toggleDevice(device.id)}
                    disabled={publishing || generating || generatingAssessments}
                    className={`
                      text-left rounded-2xl border p-5 transition-all
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${
                        selected
                          ? "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10"
                          : "bg-gray-50 dark:bg-[#0d2238] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-500"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-lg">
                          {device.nome}
                        </p>

                        <span className="text-sm opacity-80">
                          {device.modelo || device.tipo || "Dispositivo"}
                        </span>
                      </div>

                      {selected && (
                        <CheckCircle2
                          size={24}
                          className="text-blue-500"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* PDF */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-center">
            <div className="flex items-center justify-center">
              <div className="w-44 h-44 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 flex items-center justify-center">
                <FileText
                  size={82}
                  className="text-blue-500 dark:text-blue-400"
                />
              </div>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                <FileText className="text-blue-500 dark:text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Adicionar PDF de treinamento
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Esse PDF será lido pela IA para gerar título, descrição,
                módulos e aulas automaticamente.
              </p>

              {pdfName && (
                <div className="mt-5 rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <FileText size={23} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-[#080E2F] dark:text-white truncate">
                        {pdfName}
                      </p>

                      {pdfFile && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfFile(null);
                      setPdfName("");
                      setGeneratedCourse(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={generating || publishing}
                    className="text-red-500 font-semibold hover:underline disabled:opacity-60"
                  >
                    Remover
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  type="button"
                  onClick={handleSelectPdf}
                  disabled={generating || publishing}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload size={20} />
                  Selecionar PDF
                </button>

                <button
                type="button"
                onClick={handleGenerateCourseWithAi}
                disabled={
                  generating ||
                  publishing ||
                  generatingAssessments ||
                  !pdfFile ||
                  selectedDevices.length === 0
                }
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 size={21} className="animate-spin" />
                    Gerando curso...
                  </>
                ) : (
                  <>
                    <Sparkles size={21} />
                    Gerar curso com IA
                  </>
                )}
              </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ajustes opcionais */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="text-purple-500 dark:text-purple-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Ajustes opcionais
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                A IA pode gerar o título e a descrição, mas você pode informar
                uma base se quiser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                Nome base do curso
              </label>

              <input
                type="text"
                value={baseTitle}
                onChange={(e) => setBaseTitle(e.target.value)}
                disabled={generating || publishing || !!generatedCourse}
                placeholder="Ex: Treinamento Sirros S1"
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                URL da thumbnail
              </label>

              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                disabled={generating || publishing || !!generatedCourse}
                placeholder="https://imagem.com/curso.png"
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all disabled:opacity-60"
              />
            </div>
          </div>
        </section>

        {/* Preview */}
        {generatedCourse && (
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-xl dark:shadow-sm dark:shadow-blue-500/30">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 text-sm font-semibold mb-4">
                  <CheckCircle2 size={18} />
                  Curso gerado pela IA
                </div>

                <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                  Revisar informações do curso
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Confira e ajuste antes de publicar.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4 min-w-[220px]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total gerado
                </p>

                <p className="text-2xl font-bold text-[#080E2F] dark:text-white mt-1">
                  {generatedCourse.modulos.length} módulos
                </p>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {totalGeneratedLessons} aulas
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                    Título gerado
                  </label>

                  <input
                    type="text"
                    value={generatedCourse.titulo || ""}
                    onChange={(e) =>
                      updateGeneratedCourseField(
                        "titulo",
                        e.target.value
                      )
                    }
                    className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                    Descrição gerada
                  </label>

                  <textarea
                    value={generatedCourse.descricao || ""}
                    onChange={(e) =>
                      updateGeneratedCourseField(
                        "descricao",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {generatedCourse.modulos.map((modulo, moduloIndex) => (
                  <div
                    key={`${modulo.titulo}-${moduloIndex}`}
                    className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2238] p-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-3">
                      <input
                        type="text"
                        value={modulo.titulo}
                        onChange={(e) =>
                          updateGeneratedModulo(
                            moduloIndex,
                            "titulo",
                            e.target.value
                          )
                        }
                        className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 font-bold"
                      />

                      <input
                        type="number"
                        value={modulo.ordem || moduloIndex + 1}
                        onChange={(e) =>
                          updateGeneratedModulo(
                            moduloIndex,
                            "ordem",
                            e.target.value
                          )
                        }
                        className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      {modulo.aulas.map((aula, aulaIndex) => (
                        <div
                          key={`${aula.titulo}-${aulaIndex}`}
                          className="rounded-2xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-4"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-bold text-[#080E2F] dark:text-white">
                              Aula {aulaIndex + 1}
                            </h3>

                            <button
                              type="button"
                              onClick={() =>
                                removeGeneratedAula(
                                  moduloIndex,
                                  aulaIndex
                                )
                              }
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <input
                              type="text"
                              value={aula.titulo}
                              onChange={(e) =>
                                updateGeneratedAula(
                                  moduloIndex,
                                  aulaIndex,
                                  "titulo",
                                  e.target.value
                                )
                              }
                              placeholder="Título da aula"
                              className="w-full bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            />

                            <textarea
                              value={aula.descricao || ""}
                              onChange={(e) =>
                                updateGeneratedAula(
                                  moduloIndex,
                                  aulaIndex,
                                  "descricao",
                                  e.target.value
                                )
                              }
                              placeholder="Descrição da aula"
                              rows={2}
                              className="w-full bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                            />

                            <textarea
                              value={aula.conteudo || ""}
                              onChange={(e) =>
                                updateGeneratedAula(
                                  moduloIndex,
                                  aulaIndex,
                                  "conteudo",
                                  e.target.value
                                )
                              }
                              placeholder="Conteúdo da aula"
                              rows={5}
                              className="w-full bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="number"
                                value={aula.duracao || 10}
                                onChange={(e) =>
                                  updateGeneratedAula(
                                    moduloIndex,
                                    aulaIndex,
                                    "duracao",
                                    e.target.value
                                  )
                                }
                                placeholder="Duração em minutos"
                                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                              />

                              <input
                                type="number"
                                value={aula.ordem || aulaIndex + 1}
                                onChange={(e) =>
                                  updateGeneratedAula(
                                    moduloIndex,
                                    aulaIndex,
                                    "ordem",
                                    e.target.value
                                  )
                                }
                                placeholder="Ordem"
                                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={generateAssessments}
                onChange={(event) => setGenerateAssessments(event.target.checked)}
                className="mt-1"
              />

              <div>
                <p className="font-bold text-indigo-950">
                  Gerar quizzes e prova final automaticamente
                </p>

                <p className="text-sm text-indigo-700 mt-1">
                  Após criar o curso, a IA irá gerar um quiz para cada módulo e uma prova final publicada.
                </p>
              </div>
            </label>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateCourseWithAi}
                  disabled={generating || publishing}
                  className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {generating ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Gerando novamente...
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={22} />
                      Gerar novamente
                    </>
                  )}
                </button>

                <button
                type="button"
                onClick={handlePublishCourse}
                disabled={publishing || generating || generatingAssessments}
                className="flex-1 rounded-2xl bg-blue-500 px-5 py-4 font-bold text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generatingAssessments ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Gerando quizzes e prova final...
                  </>
                ) : publishing ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Publicando curso...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Publicar curso
                  </>
                )}
              </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}