import { Cpu, X } from "lucide-react";

import type {
  DeviceType,
  UserType,
} from "../types/adminDashboard.types";

interface ClientDevicesModalProps {
  client: UserType | null;
  devices: DeviceType[];
  clientDevices: DeviceType[];
  selectedDeviceId: string;
  loading: boolean;
  linking: boolean;
  unlinkingDeviceId: number | null;
  onClose: () => void;
  onSelectDevice: (deviceId: string) => void;
  onLink: () => void;
  onUnlink: (deviceId: number) => void;
}

export default function ClientDevicesModal({
  client,
  devices,
  clientDevices,
  selectedDeviceId,
  loading,
  linking,
  unlinkingDeviceId,
  onClose,
  onSelectDevice,
  onLink,
  onUnlink,
}: ClientDevicesModalProps) {
  if (!client) {
    return null;
  }

  const availableDevices = devices.filter(
    (device) =>
      !clientDevices.some(
        (clientDevice) => clientDevice.id === device.id,
      ),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              Dispositivos do Cliente
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gerencie os dispositivos vinculados a{" "}
              <strong>{client.name}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={linking}
            className="text-gray-500 hover:text-red-500 transition-all disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={26} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 p-4">
          <h3 className="font-bold text-[#080E2F] dark:text-white mb-3">
            Vincular novo dispositivo
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDeviceId}
              onChange={(event) =>
                onSelectDevice(event.target.value)
              }
              disabled={linking}
              className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 disabled:opacity-60"
            >
              <option value="">
                Selecione um dispositivo
              </option>

              {availableDevices.map((device) => (
                <option
                  key={device.id}
                  value={device.id}
                >
                  {device.nome}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onLink}
              disabled={linking || !selectedDeviceId}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {linking ? "Vinculando..." : "Vincular"}
            </button>
          </div>

          {availableDevices.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Todos os dispositivos cadastrados já estão
              vinculados a este cliente.
            </p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-[#080E2F] dark:text-white mb-4">
            Dispositivos vinculados
          </h3>

          {loading ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Carregando dispositivos...
            </div>
          ) : clientDevices.length > 0 ? (
            <div className="space-y-3">
              {clientDevices.map((device) => {
                const isUnlinking =
                  unlinkingDeviceId === device.id;

                return (
                  <div
                    key={device.id}
                    className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0d2238] overflow-hidden flex items-center justify-center shrink-0">
                        {device.imagem_url ? (
                          <img
                            src={device.imagem_url}
                            alt={device.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Cpu className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-[#080E2F] dark:text-white truncate">
                          {device.nome}
                        </h4>

                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {device.tipo || "Sem categoria"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUnlink(device.id)}
                      disabled={isUnlinking || linking}
                      className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isUnlinking
                        ? "Removendo..."
                        : "Remover"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-2xl">
              Nenhum dispositivo vinculado a este cliente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}