// ============================================
// Dados da barra lateral (foto + descrição) de um perfil.
// Reaproveitado pela Home, pela Pesquisa e pela página de perfil, para que a
// lateral reflita a conta correta (a logada ou a visitada).
// ============================================

import { getProfileOverviewServer } from "./profile-service-server";

// A resposta real do backend /api/profile/overview difere do tipo
// ProfileOverviewResponse usado noutras partes: o `user` traz só id/name/avatar,
// e os campos descritivos (gênero, estado civil, cidade, país) vivem em `general`.
// Tipamos aqui apenas o subconjunto que a lateral consome.
interface OverviewGeneral {
  gender?: string | null;
  relationshipStatus?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

interface OverviewShape {
  user?: { id: string; name: string; avatar?: string | null };
  general?: OverviewGeneral | null;
  friends?: { id: string }[] | null;
}

export interface SidebarProfile {
  name?: string;
  avatarUrl: string;
  infoLines?: string[]; // gênero, estado civil, cidade e país
  gender?: string | null; // usado para textos de depoimentos na 3ª pessoa
  isFriend?: boolean; // o usuário logado já é amigo do perfil visitado
}

export async function loadSidebarProfile(
  jwt: string | undefined,
  userId: string | undefined,
  isOwnProfile = false,
  viewerId?: string,
): Promise<SidebarProfile> {
  if (!jwt || !userId) return { avatarUrl: "" };

  let overview: OverviewShape | null = null;
  try {
    overview = (await getProfileOverviewServer(jwt, {
      userId,
    })) as unknown as OverviewShape;
  } catch {
    // Falha na API: a lateral usa seus valores padrão.
  }

  const user = overview?.user;
  const general = overview?.general;

  let avatarUrl = user?.avatar ?? "";
  // Fallback para o avatar do próprio usuário quando o overview não trouxe a foto.
  if (!avatarUrl && isOwnProfile) {
    try {
      const res = await fetch(`${process.env.API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        avatarUrl = data.avatar ?? "";
      }
    } catch {
      // Ignora: mantém o default.png.
    }
  }

  // País é obrigatório na descrição; quando a conta não preencheu, cai no padrão
  // do app ("Brasil"), igual ao cadastro/edição. Gênero e país sempre aparecem;
  // estado civil e cidade entram só se preenchidos.
  const country = general?.country?.trim() || "Brasil";
  const infoLines = overview
    ? [
        general?.gender,
        general?.relationshipStatus,
        general?.city,
        country,
      ].filter((line): line is string => Boolean(line))
    : undefined;

  // Amizade: o perfil visitado lista o usuário logado entre seus amigos.
  // Mesmo sinal usado no fluxo de "+ amigo" (FriendAdd/page.tsx).
  const isFriend =
    !isOwnProfile && !!viewerId
      ? Boolean(overview?.friends?.some((f) => f.id === viewerId))
      : false;

  return { name: user?.name, avatarUrl, infoLines, gender: general?.gender, isFriend };
}
