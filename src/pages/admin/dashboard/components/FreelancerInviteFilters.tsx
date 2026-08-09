import {
  Filter,
  RotateCcw,
} from "lucide-react";

import type {
  FreelancerInviteFilters,
  FreelancerInviteOptionsType,
} from "../types/freelancerInvite.types";

interface FreelancerInviteFiltersProps {
  filters: FreelancerInviteFilters;

  options: FreelancerInviteOptionsType;

  onChange: (
    filters: FreelancerInviteFilters,
  ) => void;

  onClear: () => void;
}

export default function FreelancerInviteFilters({
  filters,
  options,
  onChange,
  onClear,
}: FreelancerInviteFiltersProps) {
  const hasFilters =
    Boolean(filters.status) ||
    Boolean(filters.tipoConvite) ||
    Boolean(filters.dispositivoId) ||
    Boolean(filters.cursoCertificacaoId);

  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-[#0d2238]
        p-4
        sm:p-5
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-end
        "
      >
        {/* STATUS */}
        <div className="min-w-0 flex-1">
          <label
            className="
              mb-2
              block
              text-xs
              font-semibold
              text-gray-500
              dark:text-gray-400
            "
          >
            Status
          </label>

          <select
            value={
              filters.status ?? ""
            }
            onChange={(event) =>
              onChange({
                ...filters,

                status:
                  event.target.value
                    ? event.target
                        .value as FreelancerInviteFilters["status"]
                    : undefined,
              })
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#0d2238]
              px-3
              py-2.5
              text-sm
              text-[#080E2F]
              dark:text-white
              outline-none
              focus:border-blue-500
            "
          >
            <option value="">
              Todos os status
            </option>

            <option value="rascunho">
              Rascunho
            </option>

            <option value="enviado">
              Enviado
            </option>

            <option value="visualizado">
              Visualizado
            </option>

            <option value="aceito">
              Aceito
            </option>

            <option value="recusado">
              Recusado
            </option>

            <option value="expirado">
              Expirado
            </option>
          </select>
        </div>


        {/* TIPO */}
        <div className="min-w-0 flex-1">
          <label
            className="
              mb-2
              block
              text-xs
              font-semibold
              text-gray-500
              dark:text-gray-400
            "
          >
            Tipo
          </label>

          <select
            value={
              filters.tipoConvite ?? ""
            }
            onChange={(event) =>
              onChange({
                ...filters,

                tipoConvite:
                  event.target.value
                    ? event.target
                        .value as FreelancerInviteFilters["tipoConvite"]
                    : undefined,
              })
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#0d2238]
              px-3
              py-2.5
              text-sm
              text-[#080E2F]
              dark:text-white
              outline-none
              focus:border-blue-500
            "
          >
            <option value="">
              Todos os tipos
            </option>

            <option value="freelancer">
              Freelancer
            </option>

            <option value="contratacao">
              Contratação
            </option>

            <option value="parceria">
              Parceria
            </option>
          </select>
        </div>


        {/* DISPOSITIVO */}
        <div className="min-w-0 flex-1">
          <label
            className="
              mb-2
              block
              text-xs
              font-semibold
              text-gray-500
              dark:text-gray-400
            "
          >
            Dispositivo
          </label>

          <select
            value={
              filters.dispositivoId ?? ""
            }
            onChange={(event) =>
              onChange({
                ...filters,

                dispositivoId:
                  event.target.value
                    ? Number(
                        event.target.value,
                      )
                    : undefined,
              })
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#0d2238]
              px-3
              py-2.5
              text-sm
              text-[#080E2F]
              dark:text-white
              outline-none
              focus:border-blue-500
            "
          >
            <option value="">
              Todos os dispositivos
            </option>

            {options.devices.map(
              (device) => (
                <option
                  key={device.id}
                  value={device.id}
                >
                  {device.nome}
                </option>
              ),
            )}
          </select>
        </div>


        {/* CERTIFICAÇÃO */}
        <div className="min-w-0 flex-1">
          <label
            className="
              mb-2
              block
              text-xs
              font-semibold
              text-gray-500
              dark:text-gray-400
            "
          >
            Certificação
          </label>

          <select
            value={
              filters.cursoCertificacaoId ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...filters,

                cursoCertificacaoId:
                  event.target.value
                    ? Number(
                        event.target.value,
                      )
                    : undefined,
              })
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#0d2238]
              px-3
              py-2.5
              text-sm
              text-[#080E2F]
              dark:text-white
              outline-none
              focus:border-blue-500
            "
          >
            <option value="">
              Todas as certificações
            </option>

            {options.courses.map(
              (course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.titulo}
                </option>
              ),
            )}
          </select>
        </div>


        {/* LIMPAR */}
        <button
          type="button"
          disabled={!hasFilters}
          onClick={onClear}
          className="
            inline-flex
            h-[42px]
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            dark:border-white/10
            px-4
            text-sm
            font-semibold
            text-gray-600
            dark:text-gray-300
            transition
            hover:bg-gray-50
            dark:hover:bg-white/5
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {hasFilters ? (
            <RotateCcw size={16} />
          ) : (
            <Filter size={16} />
          )}

          Limpar
        </button>
      </div>
    </div>
  );
}