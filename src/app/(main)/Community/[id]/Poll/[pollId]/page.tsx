import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import { getPollServer } from "@/lib/poll-service-server";
import CommunityPollDetailPage from "@/components/pages/Community/Poll/CommunityPollDetailPage";

// Página de detalhe de uma enquete (votar / ver resultados e comentários).
export default async function Page({
  params,
}: {
  params: Promise<{ id: string; pollId: string }>;
}) {
  const { id, pollId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.jwt) {
    redirect("/account");
  }

  let dashboard;
  let poll;
  try {
    [dashboard, poll] = await Promise.all([
      getCommunityDashboardServer(session.user.jwt, id),
      getPollServer(session.user.jwt, id, pollId),
    ]);
  } catch {
    notFound();
  }

  return <CommunityPollDetailPage dashboard={dashboard} poll={poll} />;
}
