import {
  BookOpen,
  Calendar,
  Cpu,
  FileText,
  Filter,
  Star,
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type { DeviceType } from "../types/adminDashboard.types";

interface DevicesTabProps {
  devices: DeviceType[];
  search: string;
  editDevice: (device: DeviceType) => void;
  deleteDevice: (device: DeviceType) => void;
  openDocumentsModal: (device: DeviceType) => void;
}

export default function DevicesTab({
  devices,
  search,
  editDevice,
  deleteDevice,
  openDocumentsModal,
}: DevicesTabProps) {
  const filteredDevices = devices.filter((device) => {
    const term = search.toLowerCase();

    return (
      device.nome?.toLowerCase().includes(term) ||
      device.modelo?.toLowerCase().includes(term) ||
      device.tipo?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
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
          value={devices.length}
          subtitle="Documentados"
          icon={FileText}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Cursos Vinculados"
          value="32"
          subtitle="Relacionados"
          icon={BookOpen}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Categorias"
          value="5"
          subtitle="Tipos"
          icon={Filter}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Mais acessado"
          value="S1"
          subtitle="Dispositivo"
          icon={Star}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Atualizados"
          value={devices.length}
          subtitle="Este mês"
          icon={Calendar}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />
      </StatsGrid>

      <TableCard title="Lista de Dispositivos">
        <div className="min-w-[850px]">
          <div className="grid grid-cols-[1.3fr_1fr_1fr_1.4fr_210px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
            <span>Dispositivo</span>
            <span>Modelo</span>
            <span>Categoria</span>
            <span>Descrição</span>
            <span className="text-right">Ações</span>
          </div>

          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="grid grid-cols-[1.3fr_1fr_1fr_1.4fr_210px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0d2238] overflow-hidden flex items-center justify-center shrink-0">
                  {device.imagem_url ? (
                    <img
                      src={device.imagem_url}
                      className="w-full h-full object-cover"
                      alt={device.nome}
                    />
                  ) : (
                    <Cpu className="text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                  {device.nome}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 truncate">
                {device.modelo || "-"}
              </p>

              <p className="text-blue-600 dark:text-blue-400 font-semibold truncate">
                {device.tipo || "Sem categoria"}
              </p>

              <p className="text-gray-600 dark:text-gray-400 truncate">
                {device.descricao || "Sem descrição"}
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openDocumentsModal(device)}
                  className="rounded-xl bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all"
                >
                  PDFs
                </button>

                <button
                  type="button"
                  onClick={() => editDevice(device)}
                  className="rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => deleteDevice(device)}
                  className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </TableCard>
    </div>
  );
}