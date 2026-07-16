import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { AlbumsMeuAlbumPage } from "@/components/pages/Albums/AlbumsMeuAlbumPage";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function HomeAlbumAddPhotosPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;
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
      <AlbumsMeuAlbumPage
        albumId={albumId}
        homeHref="/Home"
        albumListHref="/Home/AlbumList"
        albumHref={`/Home/AlbumList/${albumId}`}
      />
    </div>
  );
}
