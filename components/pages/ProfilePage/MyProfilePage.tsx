import { OrkutMainColumn } from "@/components/pages/ProfilePage/main-column";
import { UpdatesSection } from "@/components/pages/ProfilePage/MyProfile/UpdatesSection";
import { PendingTestimonials } from "@/components/pages/ProfilePage/Shared/PendingTestimonials";
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
}: {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview?: ProfileOverviewResponse | null;
  gender?: string | null;
  isHome?: boolean;
  friendRequests?: FriendRequest[];
}) {
  const { photos, videos } = mediaCountsFromOverview(overview);

  return (
    <>
      <div className="border border-orkut-border bg-white shadow-sm orkut-col-main-inner">
        <OrkutMainColumn
          displayName={displayName}
          userId={userId}
          isOwnProfile={true}
          profileRowsByTab={profileRowsByTab}
          overview={overview}
          isHome={isHome}
        />
      </div>
      {isHome ? (
        <>
          <FriendRequestsCard initialRequests={friendRequests} />
          <div className="orkut-col-section mt-1 bg-white border border-orkut-border px-2 py-1">
            <UpdatesSection />
          </div>
          <PendingTestimonials userId={userId} />
          <TestimonialsSection userId={userId} canWrite={false} />
        </>
      ) : (
        <>
          {/* Seções abaixo da tabela de informações (Requisito 1) */}
          <RecentMediaSection
            title="minhas fotos recentes"
            count={photos}
            seeAllHref={`/profile/${userId}/fotos`}
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
