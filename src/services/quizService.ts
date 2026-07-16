import { api } from "./api";

import type {
  Quiz,
  SubmitQuizAnswer,
  SubmitQuizResult,
  StartQuizAttemptResponse,
} from "../types/quiz";

export async function getQuizById(quizId: number): Promise<Quiz> {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
}

export async function startQuizAttempt(
  quizId: number
): Promise<StartQuizAttemptResponse> {
  const response = await api.post(`/quizzes/${quizId}/start`);
  return response.data;
}

export async function submitQuiz(
  quizId: number,
  tentativaId: number,
  respostas: SubmitQuizAnswer[]
): Promise<SubmitQuizResult> {
  const response = await api.post(`/quizzes/${quizId}/submit`, {
    tentativa_id: tentativaId,
    respostas,
  });

  return response.data;
}

export async function getCourseQuizzes(courseId: number): Promise<Quiz[]> {
  const response = await api.get(`/courses/${courseId}/quizzes`);
  return response.data;
}