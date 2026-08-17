import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Cpu,
  FileText,
  Filter,
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AiDeviceType,
  DeviceType,
} from "../types/adminDashboard.types";

interface DevicesTabProps {
  devices: DeviceType[];
  aiDevices: AiDeviceType[];
  search: string;
  editDevice: (
    device: DeviceType,
  ) => void;
  deleteDevice: (
    device: DeviceType,
  ) => void;
  openDocumentsModal: (
    device: DeviceType,
  ) => void;
}

export default function DevicesTab({
  devices,
  aiDevices,
  search,
  editDevice,
  deleteDevice,
  openDocumentsModal,
}: DevicesTabProps) {

  const devicesWithDocuments =
  aiDevices.filter(
    (device) =>
      Number(
        device.total_documentos,
      ) > 0,
  ).length;

const totalTechnicalDocuments =
  aiDevices.reduce(
    (total, device) =>
      total +
      Number(
        device.total_documentos ||
          0,
      ),
    0,
  );

const totalCategories =
  new Set(
    devices
      .map((device) =>
        device.tipo
          ?.trim()
          .toLowerCase(),
      )
      .filter(Boolean),
  ).size;

const devicesWithProcessedBase =
  aiDevices.filter(
    (device) =>
      Number(
        device.documentos_processados,
      ) > 0,
  ).length;

const currentDate = new Date();

const devicesCreatedThisMonth =
  devices.filter((device) => {
    if (!device.criado_em) {
      return false;
    }

    const createdAt =
      new Date(
        device.criado_em,
      );

    return (
      createdAt.getFullYear() ===
        currentDate.getFullYear() &&
      createdAt.getMonth() ===
        currentDate.getMonth()
    );
  }).length;

  const term =
    search
      .toLowerCase()
      .trim();

  const filteredDevices =
    devices.filter((device) => {
      return (
        device.nome
          ?.toLowerCase()
          .includes(term) ||
        device.modelo
          ?.toLowerCase()
          .includes(term) ||
        device.tipo
          ?.toLowerCase()
          .includes(term) ||
        device.descricao
          ?.toLowerCase()
          .includes(term)
      );
    });

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
     {/* Métricas */}
<StatsGrid>
  <StatCard
    title="Total de Dispositivos"
    value={devices.length}
    subtitle="Cadastrados"
    icon={Cpu}
    color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
  />

  <StatCard
    title="Com Ficha Técnica"
    value={devicesWithDocuments}
    subtitle="Com documentos"
    icon={FileText}
    color="bg-green-500/15 text-green-600 dark:text-green-400"
  />

  <StatCard
    title="Documentos Técnicos"
    value={totalTechnicalDocuments}
    subtitle="Na base técnica"
    icon={BookOpen}
    color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
  />

  <StatCard
    title="Categorias"
    value={totalCategories}
    subtitle="Tipos cadastrados"
    icon={Filter}
    color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
  />

  <StatCard
    title="Base Processada"
    value={devicesWithProcessedBase}
    subtitle="Prontos para IA"
    icon={CheckCircle2}
    color="bg-green-500/15 text-green-600 dark:text-green-400"
  />

  <StatCard
    title="Cadastrados no mês"
    value={devicesCreatedThisMonth}
    subtitle="Este mês"
    icon={Calendar}
    color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
  />
</StatsGrid>

      <TableCard title="Lista de Dispositivos">
        {/* DESKTOP */}
        <div
          className="
            hidden
            xl:block

            min-w-[850px]
          "
        >
          {/* Cabeçalho */}
          <div
            className="
              grid
              grid-cols-[1.3fr_1fr_1fr_1.4fr_210px]

              gap-4

              pb-3

              border-b
              border-gray-200
              dark:border-white/10

              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            <span>
              Dispositivo
            </span>

            <span>
              Modelo
            </span>

            <span>
              Categoria
            </span>

            <span>
              Descrição
            </span>

            <span className="text-right">
              Ações
            </span>
          </div>

          {/* Linhas */}
          {filteredDevices.length >
          0 ? (
            filteredDevices.map(
              (device) => (
                <div
                  key={device.id}
                  className="
                    grid
                    grid-cols-[1.3fr_1fr_1fr_1.4fr_210px]

                    gap-4

                    items-center

                    py-4

                    border-b
                    border-gray-200
                    dark:border-white/10

                    last:border-b-0
                  "
                >
                  {/* Dispositivo */}
                  <div
                    className="
                      min-w-0

                      flex
                      items-center
                      gap-3
                    "
                  >
                    <DeviceImage
                      device={
                        device
                      }
                    />

                    <h3
                      className="
                        min-w-0

                        font-semibold

                        text-[#080E2F]
                        dark:text-white

                        truncate
                      "
                      title={
                        device.nome
                      }
                    >
                      {device.nome}
                    </h3>
                  </div>

                  {/* Modelo */}
                  <p
                    className="
                      min-w-0

                      text-gray-600
                      dark:text-gray-400

                      truncate
                    "
                    title={
                      device.modelo ||
                      undefined
                    }
                  >
                    {device.modelo ||
                      "—"}
                  </p>

                  {/* Categoria */}
                  <div className="min-w-0">
                    <span
                      className="
                        inline-flex

                        max-w-full

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        px-3
                        py-1.5

                        text-xs
                        font-semibold

                        text-[var(--company-primary)]

                        truncate
                      "
                    >
                      {device.tipo ||
                        "Sem categoria"}
                    </span>
                  </div>

                  {/* Descrição */}
                  <p
                    className="
                      min-w-0

                      text-sm
                      text-gray-600
                      dark:text-gray-400

                      truncate
                    "
                    title={
                      device.descricao ||
                      undefined
                    }
                  >
                    {device.descricao ||
                      "Sem descrição"}
                  </p>

                  {/* Ações */}
                  <div
                    className="
                      flex
                      items-center
                      justify-end

                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openDocumentsModal(
                          device,
                        )
                      }
                      className="
                        rounded-xl

                        bg-purple-500/10

                        px-3
                        py-2

                        text-xs
                        font-semibold

                        text-purple-600
                        dark:text-purple-400

                        hover:bg-purple-500/20

                        transition-all
                      "
                    >
                      PDFs
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editDevice(
                          device,
                        )
                      }
                      className="
                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        px-3
                        py-2

                        text-xs
                        font-semibold

                        text-[var(--company-primary)]

                        hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                        transition-all
                      "
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteDevice(
                          device,
                        )
                      }
                      className="
                        rounded-xl

                        bg-red-500/10

                        px-3
                        py-2

                        text-xs
                        font-semibold

                        text-red-500

                        hover:bg-red-500/20

                        transition-all
                      "
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ),
            )
          ) : (
            <DeviceEmptyState />
          )}
        </div>

        {/* MOBILE / TABLET / NOTEBOOK MENOR */}
        <div
          className="
            xl:hidden

            grid
            grid-cols-1
            md:grid-cols-2

            gap-3
            sm:gap-4
          "
        >
          {filteredDevices.length >
          0 ? (
            filteredDevices.map(
              (device) => (
                <div
                  key={device.id}
                  className="
                    w-full
                    min-w-0

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    p-4

                    bg-white
                    dark:bg-[#091a2c]

                    shadow-lg
                    dark:shadow-none
                  "
                >
                  {/* Cabeçalho */}
                  <div
                    className="
                      flex
                      items-center

                      min-w-0

                      gap-3
                    "
                  >
                    <DeviceImage
                      device={
                        device
                      }
                    />

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <h3
                        className="
                          font-bold

                          text-[#080E2F]
                          dark:text-white

                          leading-snug
                          break-words
                        "
                      >
                        {device.nome}
                      </h3>

                      <p
                        className="
                          mt-0.5

                          text-sm
                          text-gray-500
                          dark:text-gray-400

                          break-words
                        "
                      >
                        {device.modelo ||
                          "Modelo não informado"}
                      </p>
                    </div>
                  </div>

                  {/* Informações */}
                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2

                      gap-3

                      mt-4
                    "
                  >
                    <div
                      className="
                        min-w-0

                        rounded-xl

                        bg-gray-50
                        dark:bg-white/5

                        p-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Categoria
                      </p>

                      <p
                        className="
                          mt-1

                          text-sm
                          font-semibold

                          text-[var(--company-primary)]

                          break-words
                        "
                      >
                        {device.tipo ||
                          "Sem categoria"}
                      </p>
                    </div>

                    <div
                      className="
                        min-w-0

                        rounded-xl

                        bg-gray-50
                        dark:bg-white/5

                        p-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Modelo
                      </p>

                      <p
                        className="
                          mt-1

                          text-sm
                          font-semibold

                          text-[#080E2F]
                          dark:text-white

                          break-words
                        "
                      >
                        {device.modelo ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div
                    className="
                      mt-3

                      rounded-xl

                      bg-gray-50
                      dark:bg-white/5

                      p-3
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Descrição
                    </p>

                    <p
                      className="
                        mt-1

                        text-sm

                        text-gray-600
                        dark:text-gray-300

                        leading-relaxed
                        break-words
                      "
                    >
                      {device.descricao ||
                        "Sem descrição"}
                    </p>
                  </div>

                  {/* Ações */}
                  <div
                    className="
                      grid
                      grid-cols-3

                      gap-2

                      mt-4

                      pt-4

                      border-t
                      border-gray-200
                      dark:border-white/10
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openDocumentsModal(
                          device,
                        )
                      }
                      className="
                        min-w-0

                        rounded-xl

                        bg-purple-500/10

                        px-2
                        sm:px-3

                        py-2.5

                        text-xs
                        sm:text-sm

                        font-semibold

                        text-purple-600
                        dark:text-purple-400

                        hover:bg-purple-500/20

                        transition-all
                      "
                    >
                      PDFs
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editDevice(
                          device,
                        )
                      }
                      className="
                        min-w-0

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        px-2
                        sm:px-3

                        py-2.5

                        text-xs
                        sm:text-sm

                        font-semibold

                        text-[var(--company-primary)]

                        hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                        transition-all
                      "
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteDevice(
                          device,
                        )
                      }
                      className="
                        min-w-0

                        rounded-xl

                        bg-red-500/10

                        px-2
                        sm:px-3

                        py-2.5

                        text-xs
                        sm:text-sm

                        font-semibold

                        text-red-500

                        hover:bg-red-500/20

                        transition-all
                      "
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ),
            )
          ) : (
            <div className="md:col-span-2">
              <DeviceEmptyState />
            </div>
          )}
        </div>
      </TableCard>
    </div>
  );
}

function DeviceImage({
  device,
}: {
  device: DeviceType;
}) {
  return (
    <div
      className="
        w-12
        h-12

        sm:w-14
        sm:h-14

        rounded-xl

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
          size={24}
          className="
            text-[var(--company-primary)]
          "
        />
      )}
    </div>
  );
}

function DeviceEmptyState() {
  return (
    <div
      className="
        py-10
        sm:py-12

        text-center
      "
    >
      <div
        className="
          w-14
          h-14

          mx-auto
          mb-4

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center
        "
      >
        <Cpu size={26} />
      </div>

      <h3
        className="
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        Nenhum dispositivo encontrado
      </h3>

      <p
        className="
          mt-1

          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        Nenhum dispositivo corresponde à busca realizada.
      </p>
    </div>
  );
}