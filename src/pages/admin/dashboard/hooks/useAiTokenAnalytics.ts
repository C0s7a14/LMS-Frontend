import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAiTokenAnalytics,
} from "../../../../services/aiUsageAnalyticsService";

import type {
  AiTokenAnalyticsType,
} from "../../../../types/aiUsageAnalytics.types";


export function useAiTokenAnalytics(
  initialDays = 30
) {
  const [days, setDays] = useState(
    initialDays
  );

  const [data, setData] =
    useState<AiTokenAnalyticsType | null>(
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
          await getAiTokenAnalytics(
            days
          );

        setData(result);
      } catch (error) {
        console.error(
          "Erro ao carregar analytics de tokens:",
          error
        );

        setError(
          "Não foi possível carregar os dados de uso da IA."
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