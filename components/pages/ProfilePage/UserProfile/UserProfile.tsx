import { ProfileCard } from "@/components/pages/ProfilePage/Shared/ProfileCard";
import { ProfileRowsSection } from "@/components/pages/ProfilePage/Shared/ProfileRowsSection";
import { ProfileShortcuts } from "@/components/pages/ProfilePage/Shared/ProfileShortcuts";
import { ProfileRatings } from "@/components/pages/ProfilePage/Shared/ProfileRatings";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

type UserProfileProps = {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
};

export function UserProfile({ displayName, userId, profileRowsByTab, overview }: UserProfileProps) {
  return (
    <ProfileCard title={displayName}>
      {/* Atalhos (recados, fotos, vídeos, fãs) com as avaliações ao lado de "fãs" */}
      <ProfileShortcuts
        userId={userId}
        isMyProfile={false}
        overview={overview}
        ratings={<ProfileRatings targetUserId={userId} />}
      />
      <ProfileRowsSection profileRowsByTab={profileRowsByTab} />
    </ProfileCard>
  );
}
