// ============================================
// Textos de depoimentos sensíveis a "dono do perfil" e gênero.
// Quando o perfil é do próprio usuário logado usamos a 1ª pessoa
// ("meus depoimentos"); em perfis de terceiros, a 3ª pessoa conforme o
// gênero cadastrado ("depoimentos dele/dela/dessa pessoa").
// Reaproveitado pela seção da coluna do meio (Requisito 1) e pela página
// de Testimonials (Requisito 2).
// ============================================

export type Gender = string | null | undefined;

// O backend guarda o gênero como texto livre em português ("masculino",
// "feminino", ...). Normalizamos por prefixo para tolerar variações de caixa
// e acentuação simples.
function normalizeGender(gender: Gender): "male" | "female" | "neutral" {
  const value = (gender ?? "").trim().toLowerCase();
  if (value.startsWith("masculin")) return "male";
  if (value.startsWith("feminin")) return "female";
  return "neutral";
}

// Título da seção "meus depoimentos" (minúsculo, como na coluna do meio).
export function testimonialsTitle(isOwner: boolean, gender?: Gender): string {
  if (isOwner) return "meus depoimentos";
  switch (normalizeGender(gender)) {
    case "male":
      return "depoimentos dele";
    case "female":
      return "depoimentos dela";
    default:
      return "depoimentos dessa pessoa";
  }
}

// Versão capitalizada usada em títulos/abas de página (Requisito 2).
export function receivedTestimonialsLabel(
  isOwner: boolean,
  gender?: Gender,
): string {
  if (isOwner) return "Meus depoimentos";
  switch (normalizeGender(gender)) {
    case "male":
      return "Depoimentos dele";
    case "female":
      return "Depoimentos dela";
    default:
      return "Depoimentos dessa pessoa";
  }
}

// Aba/label dos depoimentos que a pessoa escreveu para outras.
export function writtenTestimonialsLabel(
  isOwner: boolean,
  gender?: Gender,
): string {
  if (isOwner) return "Depoimentos que escrevi";
  switch (normalizeGender(gender)) {
    case "male":
      return "Depoimentos que escreveu";
    case "female":
      return "Depoimentos que escreveu";
    default:
      return "Depoimentos que escreveu";
  }
}

// Formata a data do depoimento como dd/mm/aa (padrão dos prints do Orkut).
export function formatTestimonialDate(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
