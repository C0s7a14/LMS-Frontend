import {
  Award,
  Cpu,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";

import type { FreelancerInviteTypeData } from "../types/freelancerInvite.types";
interface FreelancerInviteTableProps {
  invites: FreelancerInviteTypeData[];
  loading: boolean;

  deletingInviteId: number | null;
  sendingInviteId: number | null;

  onEdit: (
    invite: FreelancerInviteTypeData,
  ) => void;

  onDelete: (
    inviteId: number,
  ) => Promise<boolean>;

  onSend: (
    inviteId: number,
  ) => Promise<boolean>;
}

export default function FreelancerInviteTable({
  invites,
  loading,
  deletingInviteId,
  sendingInviteId,
  onEdit,
  onDelete,
  onSend,
}: FreelancerInviteTableProps) {
  function getStatusLabel(
    status: FreelancerInviteTypeData["status"],
  ) {
    switch (status) {
      case "rascunho":
        return "Rascunho";

      case "enviado":
        return "Enviado";

      case "visualizado":
        return "Visualizado";

      case "aceito":
        return "Aceito";

      case "recusado":
        return "Recusado";

      case "expirado":
        return "Expirado";

      default:
        return status;
    }
  }

  function getStatusClass(
    status: FreelancerInviteTypeData["status"],
  ) {
    switch (status) {
      case "rascunho":
        return `
          bg-gray-500/10
          text-gray-600
          dark:text-gray-300
        `;

      case "enviado":
        return `
          bg-blue-500/10
          text-blue-600
          dark:text-blue-400
        `;

      case "visualizado":
        return `
          bg-orange-500/10
          text-orange-600
          dark:text-orange-400
        `;

      case "aceito":
        return `
          bg-green-500/10
          text-green-600
          dark:text-green-400
        `;

      case "recusado":
        return `
          bg-red-500/10
          text-red-500
        `;

      case "expirado":
        return `
          bg-purple-500/10
          text-purple-600
          dark:text-purple-400
        `;

      default:
        return `
          bg-gray-500/10
          text-gray-600
        `;
    }
  }

  function getInviteTypeLabel(
    type: FreelancerInviteTypeData["tipo_convite"],
  ) {
    switch (type) {
      case "freelancer":
        return "Freelancer";

      case "contratacao":
        return "Contratação";

      case "parceria":
        return "Parceria";

      default:
        return type;
    }
  }

  function formatDate(
    date?: string | null,
  ) {
    if (!date) {
      return "—";
    }

    return new Date(
      date,
    ).toLocaleDateString("pt-BR");
  }

  if (loading) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-gray-200
          dark:border-white/10
          bg-white
          dark:bg-[#0d2238]
          p-8
          text-center
          text-gray-500
          dark:text-gray-400
        "
      >
        Carregando convites...
      </div>
    );
  }

  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-[#0d2238]
        p-5
        sm:p-6
      "
    >
      <div className="mb-5">
        <h2
          className="
            text-lg
            font-bold
            text-[#080E2F]
            dark:text-white
          "
        >
          Convites Freelancer
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Acompanhe os convites e oportunidades profissionais.
        </p>
      </div>

      {invites.length > 0 ? (
        <>
          {/* DESKTOP */}
          <div className="hidden lg:block w-full">
           <div
            className="
              grid
             grid-cols-[1.45fr_1.35fr_1.35fr_0.8fr_0.9fr_132px]
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
            <span>Profissional</span>
            <span>Oportunidade</span>
            <span>Qualificação</span>
            <span>Status</span>
            <span>Criação</span>
            <span className="text-right">
              Ações
            </span>

                      </div>

                      {invites.map((invite) => (
                      <div
            key={invite.id}
            className="
              grid
             grid-cols-[1.45fr_1.35fr_1.35fr_0.8fr_0.9fr_132px]
              gap-4
              items-center
              py-4
              border-b
              border-gray-200
              dark:border-white/10
              last:border-b-0
            "
          >
                {/* PROFISSIONAL */}
                <div className="min-w-0">
                  <p
                    className="
                      font-semibold
                      text-[#080E2F]
                      dark:text-white
                      truncate
                    "
                  >
                    {invite.profissional_nome}
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                      truncate
                    "
                  >
                    {invite.profissional_email}
                  </p>
                </div>

                {/* OPORTUNIDADE */}
                <div className="min-w-0">
                  <p
                    className="
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                      truncate
                    "
                  >
                    {invite.oportunidade}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    {getInviteTypeLabel(
                      invite.tipo_convite,
                    )}
                  </p>
                </div>

                {/* QUALIFICAÇÃO */}
                <div className="space-y-1.5">
                  {invite.certificacao_nome ? (
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-green-600
                        dark:text-green-400
                      "
                    >
                      <Award size={14} />

                      <span className="truncate">
                        {invite.certificacao_nome}
                      </span>
                    </div>
                  ) : null}

                  {invite.dispositivo_nome ? (
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      <Cpu size={14} />

                      <span className="truncate">
                        {invite.dispositivo_nome}
                      </span>
                    </div>
                  ) : null}

                  {!invite.certificacao_nome &&
                    !invite.dispositivo_nome && (
                      <span
                        className="
                          text-sm
                          text-gray-400
                          dark:text-gray-500
                        "
                      >
                        Não exigida
                      </span>
                    )}
                </div>

                {/* STATUS */}
                <span
                  className={`
                    inline-flex
                    w-fit
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    ${getStatusClass(
                      invite.status,
                    )}
                  `}
                >
                  {getStatusLabel(
                    invite.status,
                  )}
                </span>

                {/* DATA */}
                <span
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {formatDate(
                    invite.criado_em,
                  )}
                </span>

                {/* AÇÕES */}
                <div
                  className="
                    flex
                    justify-end
                    gap-2
                  "
                >
                  {invite.status ===
                  "rascunho" ? (
                    <>

                    <button
                    type="button"
                    disabled={
                      sendingInviteId === invite.id
                    }
                    onClick={() =>
                      void onSend(invite.id)
                    }
                    title="Enviar convite"
                    className="
                      rounded-xl
                      bg-green-500/10
                      p-2.5
                      text-green-600
                      dark:text-green-400
                      hover:bg-green-500/20
                      transition-all
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    <Send size={17} />
                  </button>
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(invite)
                        }
                        title="Editar rascunho"
                        className="
                          rounded-xl
                          bg-blue-500/10
                          p-2.5
                          text-blue-600
                          dark:text-blue-400
                          hover:bg-blue-500/20
                          transition-all
                        "
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingInviteId ===
                          invite.id
                        }
                        onClick={() =>
                          void onDelete(
                            invite.id,
                          )
                        }
                        title="Excluir rascunho"
                        className="
                          rounded-xl
                          bg-red-500/10
                          p-2.5
                          text-red-500
                          hover:bg-red-500/20
                          transition-all
                          disabled:opacity-50
                        "
                      >
                        <Trash2 size={17} />
                      </button>
                    </>
                  ) : (
                    <span
                      className="
                        text-sm
                        text-gray-400
                        dark:text-gray-500
                      "
                    >
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE / TABLET */}
          <div className="lg:hidden space-y-3">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-white/10
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div className="min-w-0">
                    <h3
                      className="
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                        truncate
                      "
                    >
                      {invite.profissional_nome}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                        truncate
                      "
                    >
                      {invite.profissional_email}
                    </p>
                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      ${getStatusClass(
                        invite.status,
                      )}
                    `}
                  >
                    {getStatusLabel(
                      invite.status,
                    )}
                  </span>
                </div>

                <div className="mt-4">
                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Oportunidade
                  </p>

                  <p
                    className="
                      mt-1
                      font-semibold
                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    {invite.oportunidade}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    {getInviteTypeLabel(
                      invite.tipo_convite,
                    )}
                  </p>
                </div>

                {(invite.certificacao_nome ||
                  invite.dispositivo_nome) && (
                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-2
                      mt-4
                    "
                  >
                    {invite.certificacao_nome && (
                      <div
                        className="
                          rounded-xl
                          bg-green-500/10
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-green-600
                            dark:text-green-400
                          "
                        >
                          <Award size={16} />

                          <span className="text-xs font-semibold">
                            Certificação
                          </span>
                        </div>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-medium
                            text-[#080E2F]
                            dark:text-white
                          "
                        >
                          {invite.certificacao_nome}
                        </p>
                      </div>
                    )}

                    {invite.dispositivo_nome && (
                      <div
                        className="
                          rounded-xl
                          bg-blue-500/10
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-blue-600
                            dark:text-blue-400
                          "
                        >
                          <Cpu size={16} />

                          <span className="text-xs font-semibold">
                            Dispositivo
                          </span>
                        </div>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-medium
                            text-[#080E2F]
                            dark:text-white
                          "
                        >
                          {invite.dispositivo_nome}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mt-4
                    pt-3
                    border-t
                    border-gray-200
                    dark:border-white/10
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Criado em
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatDate(
                        invite.criado_em,
                      )}
                    </p>
                  </div>

                  {invite.status ===
                    "rascunho" && (
                    <div className="flex gap-2">

                      <button
                        type="button"
                        disabled={
                          sendingInviteId === invite.id
                        }
                        onClick={() =>
                          void onSend(invite.id)
                        }
                        title="Enviar convite"
                        className="
                          rounded-xl
                          bg-green-500/10
                          p-2.5
                          text-green-600
                          dark:text-green-400
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        <Send size={18} />
                    </button>
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(invite)
                        }
                        className="
                          rounded-xl
                          bg-blue-500/10
                          p-2.5
                          text-blue-600
                          dark:text-blue-400
                        "
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingInviteId ===
                          invite.id
                        }
                        onClick={() =>
                          void onDelete(
                            invite.id,
                          )
                        }
                        className="
                          rounded-xl
                          bg-red-500/10
                          p-2.5
                          text-red-500
                          disabled:opacity-50
                        "
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-12 text-center">
          <div
            className="
              w-14
              h-14
              mx-auto
              rounded-2xl
              bg-purple-500/10
              text-purple-600
              dark:text-purple-400
              flex
              items-center
              justify-center
            "
          >
            <Award size={25} />
          </div>

          <h3
            className="
              mt-4
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Nenhum convite criado
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Os convites criados aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
}