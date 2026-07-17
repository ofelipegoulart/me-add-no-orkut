import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import CommunityPollCreatePage from "@/components/pages/Community/Poll/CommunityPollCreatePage";

// Página "Nova pesquisa" (criação de enquete) de uma comunidade.
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

  return <CommunityPollCreatePage dashboard={dashboard} />;
}
