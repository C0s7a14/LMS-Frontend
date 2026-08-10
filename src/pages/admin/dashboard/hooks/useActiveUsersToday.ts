import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getActiveUsersToday,
} from "../../../../services/userActivityService";

import type {
  ActiveUserTodayType,
} from "../../../../types/userActivity.types";


export default function useActiveUsersToday() {
  const [activeUsers, setActiveUsers] =
    useState<ActiveUserTodayType[]>([]);

  const [activeUsersTotal, setActiveUsersTotal] =
    useState(0);

  const [loadingActiveUsers, setLoadingActiveUsers] =
    useState(true);


  const loadActiveUsers =
    useCallback(async () => {
      try {
        setLoadingActiveUsers(true);

        const data =
          await getActiveUsersToday();

        setActiveUsers(
          data.users ?? [],
        );

        setActiveUsersTotal(
          Number(data.total ?? 0),
        );
      } catch (error) {
        console.log(
          "Erro ao carregar usuários ativos:",
          error,
        );

        setActiveUsers([]);
        setActiveUsersTotal(0);
      } finally {
        setLoadingActiveUsers(false);
      }
    }, []);


  useEffect(() => {
    void loadActiveUsers();
  }, [loadActiveUsers]);


  return {
    activeUsers,
    activeUsersTotal,
    loadingActiveUsers,
    loadActiveUsers,
  };
}