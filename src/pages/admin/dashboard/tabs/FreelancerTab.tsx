import {
  useEffect,
  useState,
} from "react";

import {
  BriefcaseBusiness,
} from "lucide-react";

import FreelancerInviteForm from "../components/FreelancerInviteForm";
import FreelancerInvitePipeline from "../components/FreelancerInvitePipeline";
import FreelancerInviteTable from "../components/FreelancerInviteTable";

import useFreelancerInvites from "../hooks/useFreelancerInvites";
import FreelancerInviteFilters from "../components/FreelancerInviteFilters";

interface FreelancerTabProps {
  onSummaryChange?: (
    total: number,
  ) => void;
}


import type {
  FreelancerInviteFilters as FreelancerInviteFiltersType,
  FreelancerInviteTypeData,
} from "../types/freelancerInvite.types";


export default function FreelancerTab({
  onSummaryChange,
}: FreelancerTabProps) {
  const [
    editingInvite,
    setEditingInvite,
  ] =
    useState<FreelancerInviteTypeData | null>(
      null,
    );

const [
  filters,
  setFilters,
] =
  useState<FreelancerInviteFiltersType>(
    {},
  );

 const {
  invites,
  summary,
  options,

  loading,
  creating,

  updatingInviteId,
  deletingInviteId,
  sendingInviteId,

  loadFreelancerInvites,

  handleCreateFreelancerInvite,
  handleUpdateFreelancerInvite,
  handleDeleteFreelancerInvite,
  handleSendFreelancerInvite,
} = useFreelancerInvites();

 /* =========================================================
   CARREGAR CONVITES
========================================================= */

useEffect(() => {
  void loadFreelancerInvites(
    filters,
  );
}, [
  loadFreelancerInvites,
  filters,
]);


/* =========================================================
   ATUALIZAR TOTAL NO CARD DE USUÁRIOS
========================================================= */

useEffect(() => {
  if (!summary) {
    return;
  }

  onSummaryChange?.(
    Number(summary.total ?? 0),
  );
}, [
  summary,
  onSummaryChange,
]);

  /* =========================================================
     EDITAR
  ========================================================= */

  function handleEdit(
    invite: FreelancerInviteTypeData,
  ) {
    setEditingInvite(invite);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /* =========================================================
     EXCLUIR
  ========================================================= */

  async function handleDelete(
    inviteId: number,
  ) {
    const deleted =
      await handleDeleteFreelancerInvite(
        inviteId,
      );

    if (
      deleted &&
      editingInvite?.id === inviteId
    ) {
      setEditingInvite(null);
    }

    return deleted;
  }


  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-purple-500/10
                text-purple-600
                dark:text-purple-400
                flex
                items-center
                justify-center
              "
            >
              <BriefcaseBusiness
                size={21}
              />
            </div>

            <div>
              <h2
                className="
                  text-xl
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
                Gerencie oportunidades profissionais
                e acompanhe os convites enviados.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* PIPELINE */}
      <FreelancerInvitePipeline
        summary={summary}
      />

      {/* FILTROS */}
      <FreelancerInviteFilters
        filters={filters}
        options={options}
        onChange={setFilters}
        onClear={() =>
          setFilters({})
        }
      />

      {/* CONTEÚDO */}
      <div
      className="
        grid
        grid-cols-1
        2xl:grid-cols-[minmax(0,1fr)_380px]
        gap-5
        2xl:gap-6
        items-start
      "
    >
       <FreelancerInviteTable
  invites={invites}
  loading={loading}

  deletingInviteId={
    deletingInviteId
  }

  sendingInviteId={
    sendingInviteId
  }

  onEdit={handleEdit}
  onDelete={handleDelete}
  onSend={
    handleSendFreelancerInvite
  }
/>

        <FreelancerInviteForm
  professionals={
    options.professionals
  }

  devices={
    options.devices
  }

  courses={
    options.courses
  }

  editingInvite={
    editingInvite
  }

  creating={
    creating
  }

  updatingInviteId={
    updatingInviteId
  }

  onCreate={
    handleCreateFreelancerInvite
  }

  onUpdate={
    handleUpdateFreelancerInvite
  }

  onCancelEdit={() =>
    setEditingInvite(null)
  }
/>
      </div>
    </div>
  );
}