import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/Sidebar/container-bar";
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
      <div className="orkut-col-left border border-orkut-border bg-white shadow-sm">
        <OrkutLeftSidebar displayName={displayName} isOwnProfile userId={userId} avatarUrl={avatarUrl} infoLines={infoLines} showAddPhoto />
      </div>
      {children}
    </EditProfileProvider>
  );
}
