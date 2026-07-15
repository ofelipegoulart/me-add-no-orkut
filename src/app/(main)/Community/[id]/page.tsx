import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import CommunityPage from "@/components/pages/Community/CommunityPage";

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

  return <CommunityPage dashboard={dashboard} />;
}
