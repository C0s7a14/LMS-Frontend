import { api } from "./api";

export interface GenerateCourseAssessmentsPayload {
  moduleQuestions?: number;
  finalExamQuestions?: number;
  status?: "rascunho" | "publicado";
  nota_minima?: number;
  max_tentativas?: number;
}

export async function generateCourseAssessments(
  courseId: number,
  payload: GenerateCourseAssessmentsPayload = {}
) {
  const response = await api.post(
    `/courses/${courseId}/ai/generate-assessments`,
    {
      moduleQuestions: payload.moduleQuestions ?? 5,
      finalExamQuestions: payload.finalExamQuestions ?? 10,
      status: payload.status ?? "publicado",
      nota_minima: payload.nota_minima ?? 70,
      max_tentativas: payload.max_tentativas ?? 3,
    }
  );

  return response.data;
}