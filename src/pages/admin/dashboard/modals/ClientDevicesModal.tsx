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
    <div
      className="
        fixed
        inset-0
        z-[100]
      "
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar painel"
        onClick={onClose}
        className="
          absolute
          inset-0

          bg-black/40
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

          w-full
          sm:w-[520px]
          lg:w-[580px]

          max-w-full

          h-[100dvh]

          bg-white
          dark:bg-[#091a2c]

          border-l
          border-gray-200
          dark:border-white/10

          shadow-2xl

          overflow-y-auto
          overscroll-contain
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

            px-4
            sm:px-6
            lg:px-7

            py-4
            sm:py-5
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
              sm:gap-4
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    w-10
                    h-10

                    sm:w-11
                    sm:h-11

                    rounded-2xl

                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                    text-[var(--company-primary)]

                    flex
                    items-center
                    justify-center

                    shrink-0
                  "
                >
                  <Cpu size={23} />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      text-lg
                      sm:text-xl

                      font-bold

                      text-[#080E2F]
                      dark:text-white

                      leading-tight
                    "
                  >
                    Gerenciar Dispositivos
                  </h2>

                  <p
                    className="
                      text-xs
                      sm:text-sm

                      text-gray-500
                      dark:text-gray-400

                      mt-1
                    "
                  >
                    Dispositivos vinculados ao cliente
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={linking}
              aria-label="Fechar painel"
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
            >
              <X size={23} />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div
          className="
            p-4
            sm:p-6
            lg:p-7

            space-y-5
            sm:space-y-6
          "
        >
          {/* Cliente */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-50
              dark:bg-[#0d2238]

              p-4
              sm:p-5
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider

                text-gray-400
              "
            >
              Cliente
            </p>

            <h3
              className="
                text-base
                sm:text-lg

                font-bold

                text-[#080E2F]
                dark:text-white

                mt-2

                break-words
              "
            >
              {client.name}
            </h3>

            <p
              className="
                text-sm

                text-gray-500
                dark:text-gray-400

                mt-1

                break-all
              "
            >
              {client.email}
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2

                mt-4
              "
            >
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

                  bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                  px-3
                  py-1

                  text-xs
                  font-bold

                  text-[var(--company-primary)]
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
          <section className="min-w-0">
            <div className="mb-4">
              <h3
                className="
                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Dispositivos vinculados
              </h3>

              <p
                className="
                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  mt-1
                "
              >
                Equipamentos que este cliente pode acessar.
              </p>
            </div>

            {loading ? (
              <div
                className="
                  rounded-2xl
                  sm:rounded-3xl

                  border
                  border-gray-200
                  dark:border-white/10

                  py-10

                  flex
                  flex-col
                  items-center
                  justify-center

                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                <Loader2
                  size={28}
                  className="
                    animate-spin

                    text-[var(--company-primary)]

                    mb-3
                  "
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
                        min-w-0

                        rounded-2xl
                        sm:rounded-3xl

                        border
                        border-gray-200
                        dark:border-white/10

                        p-3
                        sm:p-4

                        flex
                        items-center
                        justify-between

                        gap-3
                        sm:gap-4

                        hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

                        transition-all
                      "
                    >
                      <div
                        className="
                          flex
                          items-center

                          gap-3
                          sm:gap-4

                          min-w-0
                          flex-1
                        "
                      >
                        <div
                          className="
                            w-12
                            h-12

                            sm:w-14
                            sm:h-14

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
                              className="
                                w-full
                                h-full
                                object-cover
                              "
                            />
                          ) : (
                            <Cpu
                              size={25}
                              className="
                                text-[var(--company-primary)]
                              "
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4
                            className="
                              font-bold

                              text-sm
                              sm:text-base

                              text-[#080E2F]
                              dark:text-white

                              leading-snug

                              break-words
                            "
                          >
                            {device.nome}
                          </h4>

                          <p
                            className="
                              text-xs
                              sm:text-sm

                              text-gray-500
                              dark:text-gray-400

                              mt-1

                              break-words
                            "
                          >
                            {device.modelo ||
                              device.tipo ||
                              "Modelo não informado"}
                          </p>

                          {device.tipo &&
                            device.modelo && (
                              <p
                                className="
                                  text-xs
                                  text-gray-400

                                  mt-1

                                  break-words
                                "
                              >
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
                        title="Remover vínculo"
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
                  rounded-2xl
                  sm:rounded-3xl

                  border
                  border-dashed
                  border-gray-300
                  dark:border-white/15

                  py-8
                  sm:py-10

                  px-4
                  sm:px-5

                  text-center
                "
              >
                <div
                  className="
                    w-14
                    h-14

                    rounded-2xl

                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                    text-[var(--company-primary)]

                    flex
                    items-center
                    justify-center

                    mx-auto
                    mb-3
                  "
                >
                  <Cpu size={27} />
                </div>

                <h4
                  className="
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Nenhum dispositivo vinculado
                </h4>

                <p
                  className="
                    max-w-sm

                    mx-auto

                    text-sm

                    text-gray-500
                    dark:text-gray-400

                    mt-1

                    leading-relaxed
                  "
                >
                  Vincule um dispositivo para liberar o acesso
                  técnico deste cliente.
                </p>
              </div>
            )}
          </section>

          {/* Vincular novo dispositivo */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

              bg-[color-mix(in_srgb,var(--company-primary)_3%,transparent)]

              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-3

                mb-4
              "
            >
              <div
                className="
                  w-10
                  h-10

                  rounded-xl

                  bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                  text-[var(--company-primary)]

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <Plus size={20} />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Vincular dispositivo
                </h3>

                <p
                  className="
                    text-xs
                    sm:text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
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

                text-sm
                sm:text-base

                text-[#080E2F]
                dark:text-white

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all

                disabled:opacity-60
                disabled:cursor-not-allowed
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

                bg-gradient-to-r
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                px-5
                py-3.5

                font-semibold
                text-white

                flex
                items-center
                justify-center
                gap-2

                shadow-lg

                transition-all
                duration-200

                hover:brightness-105

                active:scale-[0.99]

                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:active:scale-100
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
              <p
                className="
                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  mt-3

                  text-center

                  leading-relaxed
                "
              >
                Todos os dispositivos disponíveis já estão
                vinculados a este cliente.
              </p>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}