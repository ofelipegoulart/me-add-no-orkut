export type ProfileSection = "general" | "social" | "contact" | "professional" | "personal";

export const TAB_TO_SECTION: Record<string, ProfileSection> = {
  geral: "general",
  social: "social",
  contato: "contact",
  profissional: "professional",
  pessoal: "personal",
};

import type { ProfileRow, ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";

export function addRow(rows: ProfileRow[], source: Record<string, unknown> | null, key: string, label: string) {
  const value = source?.[key];
  if (Array.isArray(value)) {
    const text = value.filter(Boolean).join(", ");
    if (text) rows.push({ label, value: text });
    return;
  }
  if (value) rows.push({ label, value: String(value) });
}

export function buildProfileRows(
  general: Record<string, unknown> | null,
  social: Record<string, unknown> | null,
  contact: Record<string, unknown> | null,
  professional: Record<string, unknown> | null,
  personal: Record<string, unknown> | null,
): ProfileRowsByTab {
  const rowsByTab: ProfileRowsByTab = {
    geral: [],
    social: [],
    contato: [],
    profissional: [],
    pessoal: [],
  };
  const rows = rowsByTab.geral;

  if (general?.relationshipStatus) {
    rows.push({ label: "relacionamento:", value: String(general.relationshipStatus) });
  }

  if (general?.birthMonth && general?.birthDay) {
    rows.push({ label: "aniversário:", value: `${general.birthDay} de ${general.birthMonth}` });
  }

  if (general?.birthYear) {
    const age = new Date().getFullYear() - Number(general.birthYear);
    if (age > 0 && age < 150) {
      rows.push({ label: "idade:", value: String(age) });
    }
  }

  if (general?.city || general?.country) {
    const parts = [general?.city, general?.country].filter(Boolean).join(", ");
    rows.push({ label: "cidade natal:", value: parts });
  }

  addRow(rowsByTab.geral, general, "gender", "gênero:");
  addRow(rowsByTab.geral, general, "state", "estado:");
  addRow(rowsByTab.geral, general, "zipCode", "CEP:");
  addRow(rowsByTab.geral, general, "languages", "idiomas que falo:");
  addRow(rowsByTab.geral, general, "highSchool", "escola (ensino médio):");
  addRow(rowsByTab.geral, general, "college", "faculdade:");
  addRow(rowsByTab.geral, general, "company", "empresa / organização:");
  addRow(rowsByTab.geral, general, "interestedIn", "interessado(a) em:");
  addRow(rowsByTab.geral, general, "datingPreference", "gostaria de namorar:");

  if (social?.aboutMe) {
    rowsByTab.social.push({ label: "quem sou eu:", value: String(social.aboutMe), allowHtml: true });
  }
  addRow(rowsByTab.social, social, "children", "filhos:");
  addRow(rowsByTab.social, social, "ethnicity", "etnia:");
  addRow(rowsByTab.social, social, "religion", "religião:");
  addRow(rowsByTab.social, social, "politicalView", "visão política:");
  addRow(rowsByTab.social, social, "humor", "humor:");
  addRow(rowsByTab.social, social, "sexualOrientation", "orientação sexual:");
  addRow(rowsByTab.social, social, "style", "estilo:");
  if (social?.smoking) rowsByTab.social.push({ label: "fumo:", value: String(social.smoking) });
  if (social?.drinking) rowsByTab.social.push({ label: "bebo:", value: String(social.drinking) });
  addRow(rowsByTab.social, social, "pets", "animais de estimação:");
  if (social?.livingWith) rowsByTab.social.push({ label: "moro:", value: String(social.livingWith) });
  addRow(rowsByTab.social, social, "hometown", "cidade natal:");
  if (social?.website) rowsByTab.social.push({ label: "página web:", value: String(social.website) });
  addRow(rowsByTab.social, social, "passions", "paixões:");
  addRow(rowsByTab.social, social, "sports", "esportes:");
  addRow(rowsByTab.social, social, "activities", "atividades:");
  addRow(rowsByTab.social, social, "books", "livros:");
  addRow(rowsByTab.social, social, "music", "música:");
  addRow(rowsByTab.social, social, "tvShows", "programas de tv:");
  addRow(rowsByTab.social, social, "movies", "cinema:");
  addRow(rowsByTab.social, social, "cuisines", "cozinhas:");

  addRow(rowsByTab.contato, contact, "primaryEmail", "e-mail principal:");
  if (Array.isArray(contact?.secondaryEmails)) {
    const secondaryEmails = contact.secondaryEmails
      .map((item) => item && typeof item === "object" && "email" in item ? String(item.email) : "")
      .filter(Boolean)
      .join(", ");
    if (secondaryEmails) rowsByTab.contato.push({ label: "e-mails secundários:", value: secondaryEmails });
  }
  addRow(rowsByTab.contato, contact, "im1", "Nome de usuário IM (1):");
  addRow(rowsByTab.contato, contact, "im2", "Nome de usuário IM (2):");
  addRow(rowsByTab.contato, contact, "homePhone", "telefone residencial:");
  addRow(rowsByTab.contato, contact, "mobilePhone", "telefone celular:");
  addRow(rowsByTab.contato, contact, "address1", "endereço 1:");
  addRow(rowsByTab.contato, contact, "address2", "endereço 2:");
  addRow(rowsByTab.contato, contact, "addressCity", "cidade:");
  addRow(rowsByTab.contato, contact, "addressState", "estado:");
  addRow(rowsByTab.contato, contact, "addressZipCode", "CEP:");
  addRow(rowsByTab.contato, contact, "addressCountry", "país:");

  addRow(rowsByTab.profissional, professional, "education", "escolaridade:");
  addRow(rowsByTab.profissional, professional, "school", "escola:");
  addRow(rowsByTab.profissional, professional, "college", "faculdade:");
  addRow(rowsByTab.profissional, professional, "course", "curso:");
  addRow(rowsByTab.profissional, professional, "degree", "diploma:");
  addRow(rowsByTab.profissional, professional, "year", "ano:");
  addRow(rowsByTab.profissional, professional, "profession", "profissão:");
  addRow(rowsByTab.profissional, professional, "sector", "setor:");
  addRow(rowsByTab.profissional, professional, "company", "empresa:");
  addRow(rowsByTab.profissional, professional, "jobDescription", "descrição do trabalho:");
  addRow(rowsByTab.profissional, professional, "workPhone", "telefone do trabalho:");
  addRow(rowsByTab.profissional, professional, "professionalSkills", "habilidades profissionais:");
  addRow(rowsByTab.profissional, professional, "professionalInterests", "interesses profissionais:");

  addRow(rowsByTab.pessoal, personal, "eyeColor", "cor dos olhos:");
  addRow(rowsByTab.pessoal, personal, "hairColor", "cor do cabelo:");
  addRow(rowsByTab.pessoal, personal, "height", "altura:");
  addRow(rowsByTab.pessoal, personal, "bodyType", "tipo físico:");
  addRow(rowsByTab.pessoal, personal, "appearance", "aparência:");
  addRow(rowsByTab.pessoal, personal, "bodyArt", "arte no corpo:");
  addRow(rowsByTab.pessoal, personal, "perfectMatch", "par perfeito:");
  addRow(rowsByTab.pessoal, personal, "attractions", "o que me atrai:");
  addRow(rowsByTab.pessoal, personal, "cantStand", "o que não suporto:");
  addRow(rowsByTab.pessoal, personal, "idealFirstDate", "primeiro encontro ideal:");
  addRow(rowsByTab.pessoal, personal, "pastRelationshipsLessons", "com os relacionamentos anteriores aprendi:");
  addRow(rowsByTab.pessoal, personal, "whatStandsOut", "o que mais chama atenção em mim:");
  addRow(rowsByTab.pessoal, personal, "favoriteBodyPart", "do que mais gosto em mim:");
  addRow(rowsByTab.pessoal, personal, "fiveEssentials", "cinco coisas sem as quais não consigo viver:");
  addRow(rowsByTab.pessoal, personal, "inMyRoom", "no meu quarto você encontra:");

  return rowsByTab;
}
