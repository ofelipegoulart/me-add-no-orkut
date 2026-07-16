import { OrkutMainColumn } from "@/components/pages/ProfilePage/main-column";
import { BigAccentShell } from "@/components/ui/boxes/BigAccentShell";
import { BigSoftSection } from "@/components/ui/boxes/BigSoftSection";
import { UpdatesSection } from "@/components/pages/ProfilePage/MyProfile/UpdatesSection";
import { PendingTestimonials } from "@/components/pages/ProfilePage/Shared/PendingTestimonials";
import { PendingCommunityMembersNotice } from "@/components/pages/ProfilePage/Shared/PendingCommunityMembersNotice";
import { TestimonialsSection } from "@/components/pages/ProfilePage/Shared/TestimonialsSection";
import { RecentMediaSection } from "@/components/pages/ProfilePage/Shared/RecentMediaSection";
import { ReceivedTestimonialsPreview } from "@/components/pages/ProfilePage/Shared/ReceivedTestimonialsPreview";
import { FriendRequestsCard } from "@/components/pages/Social/friend-requests-card";
import { mediaCountsFromOverview } from "@/lib/profile-media";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse, FriendRequest } from "@/lib/profile-types";

export default function MyProfilePage({
  displayName,
  userId,
  profileRowsByTab,
  overview = null,
  gender,
  isHome = false,
  friendRequests = [],
  pendingCommunityId = null,
}: {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview?: ProfileOverviewResponse | null;
  gender?: string | null;
  isHome?: boolean;
  friendRequests?: FriendRequest[];
  pendingCommunityId?: string | null;
}) {
  const { photos, videos } = mediaCountsFromOverview(overview);

  return (
    <>
      <BigAccentShell>
        <OrkutMainColumn
          displayName={displayName}
          userId={userId}
          isOwnProfile={true}
          profileRowsByTab={profileRowsByTab}
          overview={overview}
          isHome={isHome}
        />
      </BigAccentShell>
      {isHome ? (
        <>
          {pendingCommunityId && (
            <PendingCommunityMembersNotice communityId={pendingCommunityId} />
          )}
          <FriendRequestsCard initialRequests={friendRequests} />
          <BigSoftSection>
            <UpdatesSection />
          </BigSoftSection>
          <PendingTestimonials userId={userId} />
          <TestimonialsSection userId={userId} canWrite={false} />
        </>
      ) : (
        <>
          {/* Seções abaixo da tabela de informações (Requisito 1) */}
          <RecentMediaSection
            title="minhas fotos recentes"
            count={photos}
            seeAllHref={`/Profile/${userId}/AlbumList`}
            seeAllLabel="ver todas as fotos »"
            emptyLabel="nenhuma foto adicionada ainda."
          />
          <RecentMediaSection
            title="meus vídeos recentes"
            count={videos}
            emptyLabel="nenhum vídeo adicionado ainda."
          />
          <PendingTestimonials userId={userId} />
          <ReceivedTestimonialsPreview
            userId={userId}
            isOwner
            gender={gender}
          />
        </>
      )}
    </>
  );
}
