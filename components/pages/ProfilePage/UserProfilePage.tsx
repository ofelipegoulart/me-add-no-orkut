import  { OrkutMainColumn } from "@/components/pages/ProfilePage/main-column";
import { RecentMediaSection } from "@/components/pages/ProfilePage/Shared/RecentMediaSection";
import { ReceivedTestimonialsPreview } from "@/components/pages/ProfilePage/Shared/ReceivedTestimonialsPreview";
import { mediaCountsFromOverview } from "@/lib/profile-media";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

export default function UserProfilePage({
  displayName,
  userId,
  profileRowsByTab,
  overview,
  gender,
}: {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
  gender?: string | null;
}) {
  const { photos, videos } = mediaCountsFromOverview(overview);

  return (
    <>
      <div className="border border-orkut-border bg-white shadow-sm orkut-col-main-inner">
        <OrkutMainColumn
          displayName={displayName}
          userId={userId}
          isOwnProfile={false}
          profileRowsByTab={profileRowsByTab}
          overview={overview}
        />
      </div>
      {/* Seções abaixo da tabela de informações (Requisito 1) */}
      <RecentMediaSection
        title="fotos recentes"
        count={photos}
        seeAllHref={`/profile/${userId}/fotos`}
        seeAllLabel="ver todas as fotos »"
        emptyLabel="nenhuma foto adicionada ainda."
      />
      <RecentMediaSection
        title="vídeos recentes"
        count={videos}
        emptyLabel="nenhum vídeo adicionado ainda."
      />
      <ReceivedTestimonialsPreview
        userId={userId}
        isOwner={false}
        gender={gender}
      />
    </>
  );
}
