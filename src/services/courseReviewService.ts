import { api } from "./api";

export async function getCourseReviewStatus(courseId: number) {
  const response = await api.get(`/courses/${courseId}/review/status`);
  return response.data;
}

export async function completeCourseReview(courseId: number) {
  const response = await api.post(`/courses/${courseId}/review/complete`);
  return response.data;
}