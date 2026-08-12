import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAiAudioAnalytics,
} from "../../../../services/aiUsageAnalyticsService";

import type {
  AiAudioAnalyticsType,
} from "../../../../types/aiUsageAnalytics.types";


export function useAiAudioAnalytics(
  initialDays = 30
) {
  const [days, setDays] =
    useState(initialDays);

  const [data, setData] =
    useState<AiAudioAnalyticsType | null>(
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
          await getAiAudioAnalytics(
            days
          );

        setData(result);
      } catch (error) {
        console.error(
          "Erro ao carregar analytics de áudio:",
          error
        );

        setError(
          "Não foi possível carregar os dados de áudio."
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