import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { EditProfileProvider } from "@/components/pages/EditProfile/edit-profile-context";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function EditSummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const displayName = session?.user?.name ?? "";
  const userId = session?.user?.userId ?? "";

  const { avatarUrl, infoLines } = await loadSidebarProfile(
    session?.user?.jwt,
    userId,
    true,
  );

  return (
    <EditProfileProvider initialAvatar={avatarUrl}>
      <SidebarLeftBox>
        <OrkutLeftSidebar displayName={displayName} isOwnProfile userId={userId} avatarUrl={avatarUrl} infoLines={infoLines} showAddPhoto />
      </SidebarLeftBox>
      {children}
    </EditProfileProvider>
  );
}
