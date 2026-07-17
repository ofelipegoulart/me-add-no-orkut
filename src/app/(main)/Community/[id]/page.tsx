import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import { getPollsServer } from "@/lib/poll-service-server";
import CommunityPage from "@/components/pages/Community/CommunityPage";
import type { PollSummary } from "@/lib/poll-types";

// Página de uma comunidade. Carrega o dashboard real (ficha + fórum + membros)
// do backend e escolhe a visão pelo dono: quem criou vê a visão de dono. Uma
// falha (403 de conteúdo restrito / 404 inexistente) cai no notFound.
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
  try {
    dashboard = await getCommunityDashboardServer(session.user.jwt, id);
  } catch {
    notFound();
  }

  // Widget "enquetes" é secundário nesta página — uma falha aqui não deve
  // derrubar a página da comunidade inteira, só mostra a lista vazia.
  let polls: PollSummary[] = [];
  try {
    polls = (await getPollsServer(session.user.jwt, id)).results;
  } catch {
    polls = [];
  }

  return <CommunityPage dashboard={dashboard} polls={polls} />;
}
