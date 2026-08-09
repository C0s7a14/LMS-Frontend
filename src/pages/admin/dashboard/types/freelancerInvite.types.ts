export type FreelancerInviteStatus =
  | "rascunho"
  | "enviado"
  | "visualizado"
  | "aceito"
  | "recusado"
  | "expirado";

export type FreelancerInviteType =
  | "freelancer"
  | "contratacao"
  | "parceria";


export interface FreelancerInviteTypeData {
  id: number;

  profissional_user_id: number | null;

  profissional_nome: string;
  profissional_email: string;

  oportunidade: string;

  tipo_convite: FreelancerInviteType;

  dispositivo_id: number | null;
  dispositivo_nome: string | null;
  dispositivo_modelo: string | null;

  curso_certificacao_id: number | null;
  certificacao_nome: string | null;

  mensagem: string | null;

  status: FreelancerInviteStatus;

  prazo_resposta_em: string | null;

  enviado_em: string | null;
  visualizado_em: string | null;
  respondido_em: string | null;

  criado_por: number | null;
  criado_por_nome: string | null;

  criado_em: string;
  atualizado_em: string;
}


export interface FreelancerInviteSummaryType {
  total: number | string;

  rascunhos: number | string;
  enviados: number | string;
  visualizados: number | string;

  aceitos: number | string;
  recusados: number | string;
  expirados: number | string;
}


export interface CreateFreelancerInvitePayload {
  profissionalUserId?: number | null;

  profissionalNome?: string;
  profissionalEmail?: string;

  oportunidade: string;

  tipoConvite?: FreelancerInviteType;

  dispositivoId?: number | null;

  cursoCertificacaoId?: number | null;

  mensagem?: string | null;

  prazoRespostaEm?: string | null;
}


export interface UpdateFreelancerInvitePayload {
  profissionalUserId?: number | null;

  profissionalNome?: string;
  profissionalEmail?: string;

  oportunidade: string;

  tipoConvite?: FreelancerInviteType;

  dispositivoId?: number | null;

  cursoCertificacaoId?: number | null;

  mensagem?: string | null;

  prazoRespostaEm?: string | null;
}


export interface FreelancerInviteFilters {
  status?: FreelancerInviteStatus;

  tipoConvite?: FreelancerInviteType;

  dispositivoId?: number;

  cursoCertificacaoId?: number;
}

export interface FreelancerProfessionalOption {
  id: number;
  name: string;
  email: string;

  cidade?: string | null;
  estado?: string | null;

  interesse_freelancer?: boolean | number | null;
}

export interface FreelancerDeviceOption {
  id: number;
  nome: string;

  modelo?: string | null;
  tipo?: string | null;
}

export interface FreelancerCourseOption {
  id: number;
  titulo: string;
  status?: string;
}

export interface FreelancerInviteOptionsType {
  professionals: FreelancerProfessionalOption[];
  devices: FreelancerDeviceOption[];
  courses: FreelancerCourseOption[];
}