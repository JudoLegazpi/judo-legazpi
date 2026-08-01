import {
  FileText,
  ShieldCheck,
  UserCheck,
  BookOpen,
  ClipboardList,
  Download,
  FileCheck,
  Users,
  Scale,
  HeartHandshake,
  Info,
  Lock,
  type LucideIcon,
} from "lucide-react";

/** Iconos vectoriales disponibles para los botones de LOPIVI (editables desde administración). */
export const LOPIVI_ICONS: Record<string, LucideIcon> = {
  FileText,
  ShieldCheck,
  UserCheck,
  BookOpen,
  ClipboardList,
  Download,
  FileCheck,
  Users,
  Scale,
  HeartHandshake,
  Info,
  Lock,
};

export const LOPIVI_ICON_NAMES = Object.keys(LOPIVI_ICONS);

export function lopiviIcon(name: string | null | undefined): LucideIcon {
  return LOPIVI_ICONS[name ?? ""] ?? FileText;
}
