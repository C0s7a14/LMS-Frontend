import {
  Award,
  BarChart3,
  BookOpen,
  BotMessageSquare,
  Cpu,
  LayoutDashboard,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { AdminTab } from "../types/adminDashboard.types";

export interface AdminTabItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_TABS: AdminTabItem[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users,
  },
  {
    id: "devices",
    label: "Dispositivos",
    icon: Cpu,
  },
  {
    id: "courses",
    label: "Cursos",
    icon: BookOpen,
  },
  {
    id: "certificates",
    label: "Certificados",
    icon: Award,
  },
  {
    id: "ai",
    label: "IA técnica",
    icon: BotMessageSquare,
  },
  {
    id: "enrollments",
    label: "Matrículas",
    icon: UserPlus,
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: BarChart3,
  },
];

export function isValidAdminTab(
  tab: string | null,
): tab is AdminTab {
  return ADMIN_TABS.some((item) => item.id === tab);
}

export const DEFAULT_AI_PROMPT =
  "Você é um assistente técnico da Sirros. " +
  "Responda apenas dúvidas relacionadas aos dispositivos da Sirros. " +
  "Use somente as informações presentes nos documentos técnicos cadastrados pelo administrador. " +
  "Se a resposta não estiver nos documentos, informe que não encontrou essa informação na base técnica disponível. " +
  "Não invente dados técnicos, valores, configurações, códigos ou procedimentos. " +
  "Responda de forma clara, objetiva e segura.";