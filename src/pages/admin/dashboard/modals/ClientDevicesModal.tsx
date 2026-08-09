import {
  Cpu,
  Loader2,
  Plus,
  Unlink,
  X,
} from "lucide-react";

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
        (clientDevice) =>
          clientDevice.id === device.id,
      ),
  );

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar painel"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/30
          backdrop-blur-[2px]
          cursor-default
        "
      />

      {/* Drawer */}
      <aside
        className="
          absolute
          right-0
          top-0
          h-full
          w-full
          sm:w-[520px]
          lg:w-[580px]
          bg-white
          dark:bg-[#091a2c]
          border-l
          border-gray-200
          dark:border-white/10
          shadow-2xl
          overflow-y-auto
        "
      >
        {/* Header */}
        <div
          className="
            sticky
            top-0
            z-10
            bg-white/95
            dark:bg-[#091a2c]/95
            backdrop-blur-xl
            border-b
            border-gray-200
            dark:border-white/10
            px-5
            sm:px-7
            py-5
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Cpu size={23} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                    Gerenciar Dispositivos
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Dispositivos vinculados ao cliente
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={linking}
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-gray-500
                hover:text-red-500
                hover:bg-red-500/10
                transition-all
                disabled:opacity-60
                shrink-0
              "
              aria-label="Fechar painel"
            >
              <X size={23} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Cliente */}
          <section
            className="
              rounded-3xl
              border
              border-gray-200
              dark:border-white/10
              bg-gray-50
              dark:bg-[#0d2238]
              p-5
            "
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Cliente
            </p>

            <h3 className="text-lg font-bold text-[#080E2F] dark:text-white mt-2">
              {client.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-all">
              {client.email}
            </p>

            <div className="flex items-center gap-2 mt-4">
              <span
                className="
                  rounded-full
                  bg-orange-500/10
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-orange-600
                  dark:text-orange-400
                "
              >
                Cliente
              </span>

              <span
                className="
                  rounded-full
                  bg-blue-500/10
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-blue-600
                  dark:text-blue-400
                "
              >
                {clientDevices.length}{" "}
                {clientDevices.length === 1
                  ? "dispositivo"
                  : "dispositivos"}
              </span>
            </div>
          </section>

          {/* Dispositivos vinculados */}
          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-[#080E2F] dark:text-white">
                  Dispositivos vinculados
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Equipamentos que este cliente pode acessar.
                </p>
              </div>
            </div>

            {loading ? (
              <div
                className="
                  rounded-3xl
                  border
                  border-gray-200
                  dark:border-white/10
                  py-10
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-gray-500
                  dark:text-gray-400
                "
              >
                <Loader2
                  size={28}
                  className="animate-spin text-blue-500 mb-3"
                />

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
                      className="
                        rounded-3xl
                        border
                        border-gray-200
                        dark:border-white/10
                        p-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        hover:border-blue-500/30
                        transition-all
                      "
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gray-100
                            dark:bg-[#0d2238]
                            overflow-hidden
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          {device.imagem_url ? (
                            <img
                              src={device.imagem_url}
                              alt={device.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Cpu
                              size={25}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-[#080E2F] dark:text-white truncate">
                            {device.nome}
                          </h4>

                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {device.modelo ||
                              device.tipo ||
                              "Modelo não informado"}
                          </p>

                          {device.tipo &&
                            device.modelo && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {device.tipo}
                              </p>
                            )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onUnlink(device.id)
                        }
                        disabled={
                          isUnlinking || linking
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-red-500/10
                          text-red-500
                          flex
                          items-center
                          justify-center
                          hover:bg-red-500/20
                          transition-all
                          disabled:opacity-60
                          disabled:cursor-not-allowed
                          shrink-0
                        "
                        title="Remover vínculo"
                      >
                        {isUnlinking ? (
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                        ) : (
                          <Unlink size={19} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="
                  rounded-3xl
                  border
                  border-dashed
                  border-gray-300
                  dark:border-white/15
                  py-10
                  px-5
                  text-center
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-3
                  "
                >
                  <Cpu size={27} />
                </div>

                <h4 className="font-bold text-[#080E2F] dark:text-white">
                  Nenhum dispositivo vinculado
                </h4>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Vincule um dispositivo para liberar o acesso técnico deste cliente.
                </p>
              </div>
            )}
          </section>

          {/* Vincular */}
          <section
            className="
              rounded-3xl
              border
              border-blue-500/20
              bg-blue-500/[0.03]
              p-5
            "
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                  flex
                  items-center
                  justify-center
                "
              >
                <Plus size={20} />
              </div>

              <div>
                <h3 className="font-bold text-[#080E2F] dark:text-white">
                  Vincular dispositivo
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selecione um dispositivo disponível.
                </p>
              </div>
            </div>

            <select
              value={selectedDeviceId}
              onChange={(event) =>
                onSelectDevice(event.target.value)
              }
              disabled={
                linking ||
                availableDevices.length === 0
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#0d2238]
                px-4
                py-3.5
                text-[#080E2F]
                dark:text-white
                outline-none
                focus:border-blue-500
                disabled:opacity-60
              "
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
                  {device.modelo
                    ? ` - ${device.modelo}`
                    : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onLink}
              disabled={
                linking ||
                !selectedDeviceId ||
                availableDevices.length === 0
              }
              className="
                w-full
                mt-3
                rounded-2xl
                bg-blue-600
                px-5
                py-3.5
                font-semibold
                text-white
                flex
                items-center
                justify-center
                gap-2
                hover:bg-blue-700
                transition-all
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {linking ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Vinculando...
                </>
              ) : (
                <>
                  <Plus size={19} />
                  Vincular dispositivo
                </>
              )}
            </button>

            {availableDevices.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Todos os dispositivos disponíveis já estão vinculados a este cliente.
              </p>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}