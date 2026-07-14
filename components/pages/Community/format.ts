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

// Junta cidade / estado / CEP / país no que estiver preenchido.
export function formatLocation(loc?: CommunityLocation | null) {
  if (!loc) return null;
  const parts = [loc.city, loc.state, loc.zipCode, loc.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}
