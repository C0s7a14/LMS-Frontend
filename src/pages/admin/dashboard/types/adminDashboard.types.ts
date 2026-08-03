export type AdminTab =
  | "overview"
  | "users"
  | "devices"
  | "courses"
  | "certificates"
  | "ai"
  | "enrollments"
  | "reports";

export type MetricKey =
  | "users"
  | "courses"
  | "enrollments"
  | "devices"
  | "certificates"
  | "completion"
  | "satisfaction";

export type UserRole = "student" | "client" | "admin";

export type CoursePublicationStatus =
  | "rascunho"
  | "publicado"
  | "arquivado";

export interface UserType {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  criado_em?: string;
}

export interface AiKnowledgeSummary {
  totalPrompts: number;
  totalDocumentos: number;
  totalChunks: number;
  totalConversas: number;
}

export interface AiPromptType {
  id: number;
  nome: string;
  conteudo: string;
  dispositivo_id: number | null;
  dispositivo_nome?: string | null;
  ativo: boolean | number;
  criado_por?: number;
  criado_por_nome?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface AiPromptFormState {
  nome: string;
  conteudo: string;
  dispositivo_id: string;
  ativo: boolean;
}

export interface CourseType {
  id: number;
  titulo: string;
  descricao?: string;
  thumbnail?: string;
  criado_por?: number;
  criado_em?: string;
  criador?: string;

  status?: CoursePublicationStatus;
  curso_publicacao_status?: CoursePublicationStatus;

  dispositivo_nome?: string;
  total_aulas?: number;
}

export interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
}

export interface AiDeviceType extends DeviceType {
  total_documentos: number;
  documentos_processados: number;
  total_chunks: number;
}

export interface AdminDashboardResumo {
  totalUsuarios: number;
  totalAlunos: number;
  totalClientes: number;
  totalAdmins: number;

  totalCursos: number;
  cursosPublicados: number;
  cursosRascunho: number;
  cursosArquivados: number;

  totalDispositivos: number;
  certificadosEmitidos: number;
  revisoesPendentes: number;
}

export interface AdminDashboardCourse {
  id: number;
  titulo: string;
  descricao?: string;
  status: CoursePublicationStatus;
  criado_em?: string;
  criador?: string;
  dispositivo_nome?: string;
  total_aulas: number;
}

export interface AdminDashboardUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  criado_em?: string;
}

export interface AdminDashboardReview {
  curso_tentativa_id: number;
  usuario_id: number;
  aluno_nome: string;
  aluno_email: string;
  curso_id: number;
  curso_titulo: string;
  numero_tentativa: number;
  nota_final: string | number | null;
  status: string;
  atualizado_em?: string;
}

export interface AdminDashboardCertificate {
  id: number;
  usuario_id: number;
  aluno_nome: string;
  aluno_email: string;
  curso_id: number;
  curso_titulo: string;
  validation_code: string;
  emitido_em?: string;
}

export interface AdminDashboardData {
  resumo: AdminDashboardResumo;
  ultimosCursos: AdminDashboardCourse[];
  ultimosUsuarios: AdminDashboardUser[];
  revisoesPendentes: AdminDashboardReview[];
  ultimosCertificados: AdminDashboardCertificate[];
}

export interface AdminReportSummary {
  total_alunos: number;
  total_clientes: number;
  total_cursos: number;
  cursos_publicados: number;
  total_matriculas: number;
  certificados_emitidos: number;
}

export interface AdminReportCourse {
  curso_id: number;
  titulo: string;
  status: string;
  total_matriculas: number | string;
  certificados_emitidos: number | string;
  total_aulas: number | string;
  aulas_concluidas: number | string;
  progresso_medio: number | string;
}

export interface AdminReportQuiz {
  quiz_id: number;
  titulo: string;
  tipo: string;
  status: string;
  curso_titulo: string;
  total_tentativas: number | string;
  aprovados: number | string | null;
  reprovados: number | string | null;
  media_nota: number | string | null;
}

export interface AdminMonthlyCertificate {
  mes: string;
  total: number | string;
}

export interface AdminReportsData {
  summary: AdminReportSummary;
  courses: AdminReportCourse[];
  quizzes: AdminReportQuiz[];
  monthlyCertificates: AdminMonthlyCertificate[];
}

export interface EnrollmentRequestType {
  id: number;
  user_id: number;
  curso_id: number;

  status:
    | "pendente"
    | "aprovada"
    | "rejeitada"
    | "cancelada";

  mensagem?: string | null;
  motivo_resposta?: string | null;
  respondido_por?: number | null;
  respondido_em?: string | null;
  criado_em?: string;
  atualizado_em?: string;

  aluno_nome: string;
  aluno_email: string;

  curso_titulo: string;
  curso_descricao?: string | null;

  dispositivo_nome?: string | null;
  dispositivo_modelo?: string | null;
  dispositivo_imagem_url?: string | null;

  admin_nome?: string | null;
}