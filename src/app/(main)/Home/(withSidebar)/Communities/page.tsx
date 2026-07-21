import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { COMMUNITIES } from "@/data/mock-data";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { CommunitiesBoard } from "@/components/pages/ProfilePage/Communities/CommunitiesBoard";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import type { CommunitySummary, ProfileOverviewResponse } from "@/lib/profile-types";

export default async function HomeCommunitiesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session!.user.userId;

  let overview: ProfileOverviewResponse | null = null;
  if (session.user?.jwt) {
    try {
      overview = await getProfileOverviewServer(session.user.jwt, { userId });
    } catch {
      // Fallback para os dados mockados se a API falhar.
    }
  }

  const communities: CommunitySummary[] =
    overview?.communities ??
    COMMUNITIES.map((c) => ({ id: c.seed, name: c.name, memberCount: c.count }));

  return (
    <BigSharpShell title="Minhas comunidades" breadcrumbLabel="Minhas comunidades" homeHref="/Home" full>
      <CommunitiesBoard communities={communities} />
    </BigSharpShell>
  );
}
