import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { AlbumEditPage } from "@/components/pages/Albums/AlbumEditPage";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function ProfileAlbumEditPage({
  params,
}: {
  params: Promise<{ id: string; albumId: string }>;
}) {
  const { id, albumId } = await params;
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.userId === id;

  const { name, avatarUrl, infoLines } = await loadSidebarProfile(
    session?.user?.jwt,
    id,
    isOwner,
  );
  const displayName = isOwner ? session?.user?.name ?? name ?? "Usuário" : name ?? "Usuário";

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <SidebarLeftBox>
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile={isOwner}
          userId={id}
          avatarUrl={avatarUrl}
          infoLines={infoLines}
        />
      </SidebarLeftBox>
      <AlbumEditPage
        albumId={albumId}
        homeHref="/Home"
        albumHref={`/Profile/${id}/AlbumList/${albumId}`}
      />
    </div>
  );
}
