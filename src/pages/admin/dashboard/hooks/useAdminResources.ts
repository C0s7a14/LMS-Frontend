import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAdminResources,
} from "../../../../services/adminResourceService";

import type {
  AdminResourceType,
} from "../../../../types/adminResource.types";


export default function useAdminResources() {
  const [resources, setResources] =
    useState<AdminResourceType[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadResources =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getAdminResources();

        setResources(
          data.resources ?? [],
        );
      } catch (error) {
        console.log(
          "Erro ao carregar recursos:",
          error,
        );

        setError(
          "Não foi possível carregar os recursos da plataforma.",
        );

        setResources([]);
      } finally {
        setLoading(false);
      }
    }, []);


  useEffect(() => {
    void loadResources();
  }, [loadResources]);


  return {
    resources,
    loading,
    error,
    loadResources,
  };
}