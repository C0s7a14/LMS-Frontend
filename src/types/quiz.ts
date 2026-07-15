export type QuizType = "aula" | "modulo" | "prova_final";

export interface QuizOption {
  id: number;
  questao_id: number;
  texto_opcao: string;
  correta?: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  pergunta: string;
  explicacao?: string | null;
  ordem: number;
  criado_em?: string;
  opcoes: QuizOption[];
}

export interface Quiz {
  id: number;
  curso_id: number;
  modulo_id: number | null;
  aula_id: number | null;
  titulo: string;
  tipo: QuizType;
  nota_minima: string | number;
  max_tentativas: number;
  status: "rascunho" | "publicado";
  criado_em?: string;
  atualizado_em?: string;
  total_questoes?: number;
  questoes: QuizQuestion[];
}

export interface SubmitQuizAnswer {
  questao_id: number;
  opcao_id: number;
}

export interface SubmitQuizResult {
  message: string;
  tentativa: {
    id: number;
    quiz_id: number;
    usuario_id: number;
    nota: number;
    nota_minima: number;
    total_questoes: number;
    total_acertos: number;
    aprovado: boolean;
    tentativas_usadas: number;
    max_tentativas: number;
    certificado_emitido: boolean;
  };
}