import type { CommunityLocation } from "@/lib/profile-types";

// PUBLIC/MODERATED e OPEN_TO_NON_MEMBERS/RESTRICTED viram os rótulos da ficha.
export function typeLabel(type: string) {
  return type === "MODERATED" ? "moderada" : "pública";
}

export function privacyLabel(privacy: string) {
  return privacy === "RESTRICTED"
    ? "oculta a não-membros"
    : "aberta a não-membros";
}

// "14 de julho de 2026" (ficha) e "14 jul" (última postagem do fórum).
export function formatDateLong(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
}

export function formatDateShort(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
      }).format(d);
}

// "05/03/09" — data curta em barras, usada nas listas de enquetes.
export function formatDateSlash(iso?: string | null) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

// "fechado" se já passou; senão "dd/mm/aa" (+ "(em X ano(s))" se faltar 1 ano ou mais).
export function formatPollCloseDate(iso?: string | null) {
  if (!iso) return "nunca";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const now = new Date();
  if (d.getTime() <= now.getTime()) return "fechado";
  const dateLabel = formatDateSlash(iso);
  const years = d.getFullYear() - now.getFullYear();
  if (years >= 1) return `${dateLabel} (em ${years} ${years === 1 ? "ano" : "anos"})`;
  return dateLabel;
}

// Junta cidade / estado / CEP / país no que estiver preenchido.
export function formatLocation(loc?: CommunityLocation | null) {
  if (!loc) return null;
  const parts = [loc.city, loc.state, loc.zipCode, loc.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}
