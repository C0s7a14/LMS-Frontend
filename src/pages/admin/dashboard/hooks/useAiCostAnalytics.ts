import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAiCostAnalytics,
} from "../../../../services/aiUsageAnalyticsService";

import type {
  AiCostAnalyticsType,
} from "../../../../types/aiUsageAnalytics.types";


export function useAiCostAnalytics(
  initialDays = 30
) {
  const [days, setDays] = useState(
    initialDays
  );

  const [data, setData] =
    useState<AiCostAnalyticsType | null>(
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
          await getAiCostAnalytics(
            days
          );

        setData(result);
      } catch (error) {
        console.error(
          "Erro ao carregar analytics de custos:",
          error
        );

        setError(
          "Não foi possível carregar os dados de custo da IA."
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