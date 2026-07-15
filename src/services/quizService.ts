import { api } from "./api";

import type {
  Quiz,
  SubmitQuizAnswer,
  SubmitQuizResult,
} from "../types/quiz";

export async function getQuizById(quizId: number): Promise<Quiz> {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
}

export async function submitQuiz(
  quizId: number,
  respostas: SubmitQuizAnswer[]
): Promise<SubmitQuizResult> {
  const response = await api.post(`/quizzes/${quizId}/submit`, {
    respostas,
  });

  return response.data;
}

export async function getCourseQuizzes(courseId: number): Promise<Quiz[]> {
  const response = await api.get(`/courses/${courseId}/quizzes`);
  return response.data;
}