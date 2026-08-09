export type PublicFreelancerInviteStatus =
  | "enviado"
  | "visualizado"
  | "aceito"
  | "recusado"
  | "expirado";

export type PublicFreelancerInviteDecision =
  | "aceito"
  | "recusado";

export interface PublicFreelancerInvite {
  id: number;

  profissional_nome: string;

  oportunidade: string;

  tipo_convite:
    | "freelancer"
    | "contratacao"
    | "parceria";

  dispositivo_id?: number | null;
  dispositivo_nome?: string | null;
  dispositivo_modelo?: string | null;

  curso_certificacao_id?: number | null;
  certificacao_nome?: string | null;

  mensagem?: string | null;

  status: PublicFreelancerInviteStatus;

  prazo_resposta_em?: string | null;

  enviado_em?: string | null;
  visualizado_em?: string | null;
  respondido_em?: string | null;

  criado_em: string;
}

export interface PublicFreelancerInviteResponse {
  message: string;
  invite: PublicFreelancerInvite;
}