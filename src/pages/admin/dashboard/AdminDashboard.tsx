import { useState } from "react";
import {useNavigate, useSearchParams,} from "react-router-dom";
import toast from "react-hot-toast";
import type { AdminTab } from "./types/adminDashboard.types";
import { isValidAdminTab } from "./constants/adminDashboard.constants";

// Componentes
import UserModal from "../../../components/modals/UserModal";
import DeviceModal from "../../../components/modals/DeviceModal";
import DashboardHeader from "./components/DashboardHeader";
import DashboardTabs from "./components/DashboardTabs";

// Tabs
import OverviewTab from "./tabs/OverviewTab";
import UsersTab from "./tabs/UsersTab";
import DevicesTab from "./tabs/DevicesTab";
import CertificatesTab from "./tabs/CertificatesTab";
import CoursesTab from "./tabs/CoursesTab";
import AITab from "./tabs/AITab";
import EnrollmentRequestsTab from "./tabs/EnrollmentRequestsTab";
import ReportsTab from "./tabs/ReportsTab";

// Modais da dashboard
import EditDeviceModal from "./modals/EditDeviceModal";
import DeleteDeviceModal from "./modals/DeleteDeviceModal";
import EditCourseModal from "./modals/EditCourseModal";
import DeleteCourseModal from "./modals/DeleteCourseModal";
import AiDocumentsModal from "./modals/AiDocumentsModal";
import AiPromptModal from "./modals/AiPromptModal";
import ClientDevicesModal from "./modals/ClientDevicesModal";

// hooks
import useAdminDashboard from "./hooks/useAdminDashboard";
import useAdminUsers from "./hooks/useAdminUsers";
import useAdminDevices from "./hooks/useAdminDevices";
import useAdminCourses from "./hooks/useAdminCourses";
import useEnrollmentRequests from "./hooks/useEnrollmentRequests";
import useAdminAI from "./hooks/useAdminAI";
import useAdminCertificates from "./hooks/useAdminCertificates";


export default function AdminDashboard() {

   const {
    dashboardData,
    adminReports,
    users,
    courses,
    devices,
    enrollmentRequests,
    aiSummary,
    aiDevices,
    aiPrompts,
    loading,
    loadDashboardData,
  } = useAdminDashboard();

      const {
      updatingUserRoleId,
      selectedClientUser,
      clientDevices,
      selectedClientDeviceId,
      loadingClientDevices,
      linkingClientDevice,
      unlinkingClientDeviceId,
      setSelectedClientDeviceId,
      handleUpdateUserRole,
      openClientDevicesModal,
      handleLinkDeviceToClient,
      handleUnlinkDeviceFromClient,
      closeClientDevicesModal,
    } = useAdminUsers({
      refreshDashboard: loadDashboardData,
    });

    const {
      editingDevice,
      deleteDeviceTarget,
      savingDeviceEdit,
      deletingDeviceId,
      editDeviceForm,
      openEditDeviceModal,
      closeEditDeviceModal,
      handleEditDeviceFormChange,
      openDeleteDeviceModal,
      closeDeleteDeviceModal,
      handleSaveDeviceEdit,
      confirmDeleteDevice,
    } = useAdminDevices({
      refreshDashboard: loadDashboardData,
    });

    const {
    deleteCourseTarget,
    editingCourse,
    editCourseForm,
    savingCourseEdit,
    deletingCourseId,
    updatingCourseStatusId,
    openEditCourseModal,
    closeEditCourseModal,
    handleEditCourseFormChange,
    openDeleteCourseModal,
    closeDeleteCourseModal,
    handleSaveCourseEdit,
    confirmDeleteCourse,
    handleUpdateCourseStatus,
  } = useAdminCourses({
    refreshDashboard: loadDashboardData,
  });

    const {
    updatingEnrollmentRequestId,
    handleApproveEnrollmentRequest,
    handleRejectEnrollmentRequest,
  } = useEnrollmentRequests({
    refreshDashboard: loadDashboardData,
  });

    const {
    selectedAiDevice,
    deviceDocuments,
    loadingDocuments,
    uploadingDocument,
    processingDocumentId,
    promptModalOpen,
    editingAiPrompt,
    aiPromptForm,
    savingAiPrompt,
    openAiDocumentsModal,
    closeAiDocumentsModal,
    handleUploadAiDocument,
    handleProcessAiDocument,
    handleDeleteAiDocument,
    openAiPromptModal,
    closeAiPromptModal,
    handleAiPromptTextChange,
    handleAiPromptActiveChange,
    handleSaveAiPrompt,
  } = useAdminAI({
    refreshDashboard: loadDashboardData,
  });

    const {
    handleDownloadCertificate,
    handleRevokeCertificate,
  } = useAdminCertificates({
    refreshDashboard: loadDashboardData,
  });

  const [searchParams, setSearchParams] =
    useSearchParams();

  const tabParam = searchParams.get("tab");

  const currentTab: AdminTab =
    isValidAdminTab(tabParam)
      ? tabParam
      : "overview";

  const [search, setSearch] = useState("");

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
 

  const navigate = useNavigate();


  function changeTab(tab: AdminTab) {
    setSearch("");
    setSearchParams({
      tab,
    });
  }

  function getHeaderInfo() {
    if (currentTab === "users") {
      return {
        title: "Gerenciar Usuários",
        subtitle: "Cadastre, acompanhe e administre os usuários da plataforma.",
        placeholder: "Buscar usuários...",
        button: "Novo Usuário",
      };
    }

    if (currentTab === "devices") {
      return {
        title: "Gerenciar Dispositivos",
        subtitle:
          "Liste os dispositivos cadastrados, consulte informações e vincule cursos relacionados.",
        placeholder: "Buscar dispositivos...",
        button: "Novo Dispositivo",
      };
    }

    if (currentTab === "courses") {
      return {
        title: "Gerenciar Cursos",
        subtitle:
          "Organize, publique e acompanhe os cursos disponíveis na plataforma.",
        placeholder: "Buscar cursos...",
        button: "Novo Curso",
      };
    }

    if (currentTab === "certificates") {
      return {
        title: "Gerenciar Certificados",
        subtitle:
          "Emita, valide e acompanhe os certificados gerados na plataforma.",
        placeholder: "Buscar certificados...",
        button: "Emitir Certificado",
      };
    }

     if (currentTab === "ai") {
      return {
        title: "IA Técnica",
        subtitle:
          "Configure a base de conhecimento do agente IA para responder dúvidas dos clientes sobre dispositivos Sirros.",
        placeholder: "Buscar prompts, documentos ou dispositivos...",
        button: "Novo Prompt",
      };
    }

        if (currentTab === "enrollments") {
      return {
        title: "Solicitações de Matrícula",
        subtitle:
          "Aprove ou rejeite pedidos de matrícula enviados pelos alunos.",
        placeholder: "Buscar por aluno, curso ou dispositivo...",
        button: "Atualizar lista",
      };
    }

    if (currentTab === "reports") {
      return {
        title: "Relatórios e Métricas",
        subtitle:
          "Analise dados estratégicos de usuários, cursos, dispositivos e certificados.",
        placeholder: "Buscar relatórios...",
        button: "Exportar Relatório",
      };
    }

    return {
      title: "Visão Geral Administrativa",
      subtitle:
        "Acompanhe rapidamente os principais indicadores da plataforma.",
      placeholder: "Buscar usuários, cursos, dispositivos...",
      button: "Novo Usuário",
    };
  }

  function handleMainAction() {
    if (currentTab === "overview" || currentTab === "users") {
      setUserModalOpen(true);
      return;
    }

    if (currentTab === "devices") {
      setDeviceModalOpen(true);
      return;
    }

    if (currentTab === "courses") {
      navigate("/create-courses");
      return;
    }

    if (currentTab === "certificates") {
      toast.error("Emissão de certificado manual será conectada depois.");
      return;
    }

    if (currentTab === "ai") {
      openAiPromptModal(null);
      return;
    }

  if (currentTab === "enrollments") {
    void loadDashboardData();
    return;
  }

    if (currentTab === "reports") {
      toast.error("Exportação de relatório será conectada depois.");
    }
  }

  const header = getHeaderInfo();

  const totalStudents = users.filter(
    (user) => user.role === "student"
  ).length;

  const totalClients = users.filter(
    (user) => user.role === "client"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;


  return (
    <div className="space-y-6 sm:space-y-8">
    <DashboardHeader
      title={header.title}
      subtitle={header.subtitle}
      placeholder={header.placeholder}
      actionLabel={header.button}
      search={search}
      currentTab={currentTab}
      onSearchChange={setSearch}
      onMainAction={handleMainAction}
    />

      <DashboardTabs
      currentTab={currentTab}
      onChange={changeTab}
    />


      {loading ? (
        <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 text-center text-gray-500 dark:text-gray-400 cursor-pointer">
          Carregando dashboard...
        </div>
      ) : (
        <>
          {currentTab === "overview" && (
            <OverviewTab
            dashboardData={dashboardData}
            users={users}
            courses={courses}
            devices={devices}
            totalStudents={totalStudents}
            changeTab={changeTab}
            openDeviceModal={() => setDeviceModalOpen(true)}
            createCourse={() => navigate("/create-courses")}
          />
          )}

          {currentTab === "users" && (
            <UsersTab
            users={users}
            search={search}
            totalStudents={totalStudents}
            totalClients={totalClients}
            totalAdmins={totalAdmins}
            updateUserRole={handleUpdateUserRole}
            updatingUserRoleId={updatingUserRoleId}
            openClientDevicesModal={openClientDevicesModal}
          />
          )}

          {currentTab === "devices" && (
            <DevicesTab
            devices={devices}
            search={search}
            editDevice={openEditDeviceModal}
            deleteDevice={openDeleteDeviceModal}
            openDocumentsModal={openAiDocumentsModal}
          />
          )}

          {currentTab === "courses" && (
          <CoursesTab
          courses={courses}
          search={search}
          dashboardData={dashboardData}
          devices={devices}
          createCourse={() => navigate("/create-courses")}
          manageCourseLessons={(courseId) =>
            navigate(`/admin/courses/${courseId}/aulas`)
          }
          deleteCourse={openDeleteCourseModal}
          updateCourseStatus={handleUpdateCourseStatus}
          updatingCourseStatusId={updatingCourseStatusId}
          editCourse={openEditCourseModal}
        />
          )}

          {currentTab === "certificates" && (
            <CertificatesTab 
              dashboardData={dashboardData} 
              onDownload={handleDownloadCertificate}
              onRevoke={handleRevokeCertificate}
            />
          )}

       {currentTab === "ai" && (
          <AITab
            devices={aiDevices}
            aiSummary={aiSummary}
            aiPrompts={aiPrompts}
            changeTab={changeTab}
            openDocumentsModal={openAiDocumentsModal}
            openPromptModal={openAiPromptModal}
          />
        )}

        {currentTab === "enrollments" && (
          <EnrollmentRequestsTab
            requests={enrollmentRequests}
            search={search}
            updatingRequestId={updatingEnrollmentRequestId}
            approveRequest={handleApproveEnrollmentRequest}
            rejectRequest={handleRejectEnrollmentRequest}
          />
        )}

          {currentTab === "reports" && (
            <ReportsTab
            reports={adminReports}
            devices={devices}
          />
          )}
        </>
      )}

        <EditDeviceModal
          device={editingDevice}
          form={editDeviceForm}
          saving={savingDeviceEdit}
          onClose={closeEditDeviceModal}
          onSave={handleSaveDeviceEdit}
          onChange={handleEditDeviceFormChange}
        />

        <DeleteDeviceModal
        device={deleteDeviceTarget}
        deleting={
          deletingDeviceId === deleteDeviceTarget?.id
        }
        onClose={closeDeleteDeviceModal}
        onConfirm={confirmDeleteDevice}
      />
      <EditCourseModal
          course={editingCourse}
          form={editCourseForm}
          saving={savingCourseEdit}
          onClose={closeEditCourseModal}
          onSave={handleSaveCourseEdit}
          onChange={handleEditCourseFormChange}
        />

        <DeleteCourseModal
          course={deleteCourseTarget}
          deleting={
            deletingCourseId === deleteCourseTarget?.id
          }
          onClose={closeDeleteCourseModal}
          onConfirm={confirmDeleteCourse}
        />

                <AiDocumentsModal
              device={selectedAiDevice}
              documents={deviceDocuments}
              loading={loadingDocuments}
              uploading={uploadingDocument}
              processingDocumentId={
                processingDocumentId
              }
              onClose={closeAiDocumentsModal}
              onUpload={handleUploadAiDocument}
              onProcess={handleProcessAiDocument}
              onDelete={handleDeleteAiDocument}
            />
              <AiPromptModal
            open={promptModalOpen}
            editingPrompt={editingAiPrompt}
            form={aiPromptForm}
            devices={devices}
            saving={savingAiPrompt}
            onClose={closeAiPromptModal}
            onSave={handleSaveAiPrompt}
            onTextChange={handleAiPromptTextChange}
            onActiveChange={
              handleAiPromptActiveChange
            }
          />


        <ClientDevicesModal
          client={selectedClientUser}
          devices={devices}
          clientDevices={clientDevices}
          selectedDeviceId={selectedClientDeviceId}
          loading={loadingClientDevices}
          linking={linkingClientDevice}
          unlinkingDeviceId={unlinkingClientDeviceId}
          onClose={closeClientDevicesModal}
          onSelectDevice={setSelectedClientDeviceId}
          onLink={handleLinkDeviceToClient}
          onUnlink={handleUnlinkDeviceFromClient}
        />

        <UserModal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          onSuccess={loadDashboardData}
        />

        <DeviceModal
          isOpen={deviceModalOpen}
          onClose={() => setDeviceModalOpen(false)}
          onSuccess={loadDashboardData}
        />
    </div>
  );
}