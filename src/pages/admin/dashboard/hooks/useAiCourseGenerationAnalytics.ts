import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAiCourseGenerationAnalytics,
} from "../../../../services/aiUsageAnalyticsService";

import type {
  AiCourseGenerationAnalyticsType,
} from "../../../../types/aiUsageAnalytics.types";


export function useAiCourseGenerationAnalytics(
  initialDays = 30
) {
  const [days, setDays] =
    useState(initialDays);

  const [data, setData] =
    useState<AiCourseGenerationAnalyticsType | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadAnalytics = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAiCourseGenerationAnalytics(
            days
          );

        setData(result);
      } catch (error) {
        console.error(
          "Erro ao carregar analytics de cursos:",
          error
        );

        setError(
          "Não foi possível carregar os dados de cursos gerados."
        );
      } finally {
        setLoading(false);
      }
    },
    [days]
  );


  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);


  return {
    data,
    days,
    setDays,
    loading,
    error,
    loadAnalytics,
  };
}