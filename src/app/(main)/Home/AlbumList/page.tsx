import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { AlbumListPage } from "@/components/pages/Albums/AlbumListPage";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function HomeAlbumListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session.user.userId;
  const displayName = session.user.name ?? "Usuário";

  const { avatarUrl, infoLines } = await loadSidebarProfile(
    session.user.jwt,
    userId,
    true,
  );

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <SidebarLeftBox>
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile
          userId={userId}
          avatarUrl={avatarUrl}
          infoLines={infoLines}
        />
      </SidebarLeftBox>
      <AlbumListPage homeHref="/Home" albumListHref="/Home/AlbumList" userId={userId} />
    </div>
  );
}
