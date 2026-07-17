import { PROFILE_ROWS } from "@/data/mock-data";
import { buildProfileRows } from "@/lib/profile-mappers";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";

const EMPTY_PROFILE_ROWS: ProfileRowsByTab = {
  geral: [],
  social: [],
  contato: [],
  profissional: [],
  pessoal: [],
};

const FALLBACK_PROFILE_ROWS: ProfileRowsByTab = {
  geral: [
    { label: "relacionamento:", value: "solteiro(a)" },
    { label: "aniversário:", value: "15 de julho" },
    { label: "idade:", value: "20" },
    { label: "cidade natal:", value: "tangara da serra" },
  ],
  social: PROFILE_ROWS.slice(4).map((row) => ({
    label: row.label,
    value: typeof row.value === "string" ? row.value : "http://",
  })),
  contato: [],
  profissional: [],
  pessoal: [],
};

async function fetchProfileSection(jwt: string, section: string, userId?: string) {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${process.env.API_URL}/api/profile/${section}${query}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function loadProfileRows(jwt?: string, userId?: string): Promise<ProfileRowsByTab> {
  if (!jwt) {
    return FALLBACK_PROFILE_ROWS;
  }

  try {
    const [general, social, contact, professional, personal] = await Promise.all([
      fetchProfileSection(jwt, "general", userId),
      fetchProfileSection(jwt, "social", userId),
      fetchProfileSection(jwt, "contact", userId),
      fetchProfileSection(jwt, "professional", userId),
      fetchProfileSection(jwt, "personal", userId),
    ]);

    const profileRowsByTab = buildProfileRows(general, social, contact, professional, personal);
    const hasProfileRows = Object.values(profileRowsByTab).some((rows) => rows.length > 0);

    return hasProfileRows ? profileRowsByTab : FALLBACK_PROFILE_ROWS;
  } catch {
    return FALLBACK_PROFILE_ROWS;
  }
}
