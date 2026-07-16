import  { OrkutMainColumn } from "@/components/pages/ProfilePage/main-column";
import { BigAccentShell } from "@/components/ui/boxes/BigAccentShell";
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
      <BigAccentShell>
        <OrkutMainColumn
          displayName={displayName}
          userId={userId}
          isOwnProfile={false}
          profileRowsByTab={profileRowsByTab}
          overview={overview}
        />
      </BigAccentShell>
      {/* Seções abaixo da tabela de informações (Requisito 1) */}
      <RecentMediaSection
        title="fotos recentes"
        count={photos}
        seeAllHref={`/Profile/${userId}/AlbumList`}
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
