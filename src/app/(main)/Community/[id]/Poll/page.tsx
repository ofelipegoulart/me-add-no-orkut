import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import { getPollsServer } from "@/lib/poll-service-server";
import CommunityPollListPage from "@/components/pages/Community/Poll/CommunityPollListPage";

// Página "Pesquisas" (lista de enquetes) de uma comunidade.
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.jwt) {
    redirect("/account");
  }

  let dashboard;
  let pollsPage;
  try {
    [dashboard, pollsPage] = await Promise.all([
      getCommunityDashboardServer(session.user.jwt, id),
      getPollsServer(session.user.jwt, id),
    ]);
  } catch {
    notFound();
  }

  return <CommunityPollListPage dashboard={dashboard} pollsPage={pollsPage} />;
}
