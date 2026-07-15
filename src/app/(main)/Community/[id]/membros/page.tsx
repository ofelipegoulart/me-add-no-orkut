import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import CommunityMembersPage from "@/components/pages/Community/CommunityMembersPage";
import type { MembersTab } from "@/components/pages/Community/types";

const VALID_TABS: MembersTab[] = ["members", "friends", "moderators", "owners", "pending"];

// Página "Ver membros" de uma comunidade, com abas (membros / amigos na
// comunidade / moderadores / co-proprietários / membros pendentes). `?tab=`
// permite abrir direto numa aba (ex.: o aviso "membros pendentes" na Home).
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

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

  const initialTab = VALID_TABS.includes(tab as MembersTab) ? (tab as MembersTab) : "members";

  return <CommunityMembersPage dashboard={dashboard} initialTab={initialTab} />;
}
