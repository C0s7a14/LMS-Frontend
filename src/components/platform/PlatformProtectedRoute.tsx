import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  usePlatformAuth,
} from "../../contexts/PlatformAuthContext";

export default function PlatformProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = usePlatformAuth();

  /**
   * Enquanto /platform/auth/me
   * está validando uma sessão salva,
   * não redirecionamos ainda.
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <span className="text-sm font-medium text-slate-500">
            Carregando...
          </span>
        </div>
      </div>
    );
  }

  /**
   * Sem sessão Platform válida,
   * volta exclusivamente para
   * o login do SuperAdmin.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/platform/login"
        replace
      />
    );
  }

  return <Outlet />;
}