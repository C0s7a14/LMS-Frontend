import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import type {
  CoursePublicationStatus,
  CourseType,
} from "../types/adminDashboard.types";

interface UseAdminCoursesProps {
  refreshDashboard: () => Promise<void>;
}

interface EditCourseForm {
  titulo: string;
  descricao: string;
  thumbnail: string;
}

type EditCourseField = keyof EditCourseForm;

export default function useAdminCourses({
  refreshDashboard,
}: UseAdminCoursesProps) {
  const navigate = useNavigate();

  const [deleteCourseTarget, setDeleteCourseTarget] =
    useState<CourseType | null>(null);

  const [editingCourse, setEditingCourse] =
    useState<CourseType | null>(null);

  const [editCourseForm, setEditCourseForm] =
    useState<EditCourseForm>({
      titulo: "",
      descricao: "",
      thumbnail: "",
    });

  const [savingCourseEdit, setSavingCourseEdit] =
    useState(false);

  const [deletingCourseId, setDeletingCourseId] =
    useState<number | null>(null);

  const [
    updatingCourseStatusId,
    setUpdatingCourseStatusId,
  ] = useState<number | null>(null);

  function getAuthConfig() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Sessão expirada. Faça login novamente.",
      );

      navigate("/");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  function openEditCourseModal(course: CourseType) {
    setEditingCourse(course);

    setEditCourseForm({
      titulo: course.titulo || "",
      descricao: course.descricao || "",
      thumbnail: course.thumbnail || "",
    });
  }

  function closeEditCourseModal() {
    if (savingCourseEdit) {
      return;
    }

    setEditingCourse(null);
  }

  function handleEditCourseFormChange(
    field: EditCourseField,
    value: string,
  ) {
    setEditCourseForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  }

  function openDeleteCourseModal(course: CourseType) {
    setDeleteCourseTarget(course);
  }

  function closeDeleteCourseModal() {
    if (deletingCourseId !== null) {
      return;
    }

    setDeleteCourseTarget(null);
  }

  async function handleSaveCourseEdit() {
    try {
      if (!editingCourse) {
        return;
      }

      if (!editCourseForm.titulo.trim()) {
        toast.error("Informe o título do curso.");
        return;
      }

      setSavingCourseEdit(true);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

     await axios.put(
  `http://localhost:3333/courses/${editingCourse.id}`,
        {
          titulo: editCourseForm.titulo,
          descricao: editCourseForm.descricao,
          thumbnail: editCourseForm.thumbnail,
        },
        config,
      );

      toast.success(
        "Curso atualizado com sucesso.",
      );

      setEditingCourse(null);

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao atualizar curso",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao atualizar curso.",
      );
    } finally {
      setSavingCourseEdit(false);
    }
  }

  async function confirmDeleteCourse() {
    try {
      if (!deleteCourseTarget) {
        return;
      }

      setDeletingCourseId(
        deleteCourseTarget.id,
      );

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      await axios.delete(
        `http://localhost:3333/courses/${deleteCourseTarget.id}`,
        config,
      );

      toast.success(
        "Curso excluído com sucesso.",
      );

      setDeleteCourseTarget(null);

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao excluir curso",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao excluir curso.",
      );
    } finally {
      setDeletingCourseId(null);
    }
  }

  async function handleUpdateCourseStatus(
    course: CourseType,
    status: CoursePublicationStatus,
  ) {
    try {
      if (
        status === "publicado" &&
        Number(course.total_aulas ?? 0) === 0
      ) {
        toast.error(
          "Não é possível publicar um curso sem aulas.",
        );
        return;
      }

      setUpdatingCourseStatusId(course.id);

      const config = getAuthConfig();

      if (!config) {
        return;
      }

      await axios.patch(
        `http://localhost:3333/admin/courses/${course.id}/status`,
        {
          status,
        },
        config,
      );

      toast.success(
        "Status do curso atualizado com sucesso.",
      );

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao atualizar status do curso",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao atualizar status do curso.",
      );
    } finally {
      setUpdatingCourseStatusId(null);
    }
  }

  return {
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
  };
}