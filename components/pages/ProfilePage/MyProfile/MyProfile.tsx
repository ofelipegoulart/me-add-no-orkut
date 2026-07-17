import { FortuneOfTheDay } from "@/components/pages/ProfilePage/MyProfile/FortuneOfTheDay";
import { MyProfileStatus } from "@/components/pages/ProfilePage/MyProfile/MyProfileStatus";
import { ProfileCard } from "@/components/pages/ProfilePage/Shared/ProfileCard";
import { ProfileRatings } from "@/components/pages/ProfilePage/Shared/ProfileRatings";
import { ProfileRowsSection } from "@/components/pages/ProfilePage/Shared/ProfileRowsSection";
import { ProfileShortcuts } from "@/components/pages/ProfilePage/Shared/ProfileShortcuts";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

type MyProfileProps = {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
  isHome?: boolean;
};

export function MyProfile({ displayName, userId, profileRowsByTab, overview, isHome = false }: MyProfileProps) {
  return (
    <ProfileCard title={isHome ? `Bem-vindo, ${displayName}` : displayName}>
      {/* Defina seu status */}
      <MyProfileStatus statusMessage={overview?.user.statusMessage} />
      {/* Recados, fotos, vídeos, ... */}
      <ProfileShortcuts
        userId={userId}
        overview={overview}
        ratings={
          isHome ? undefined : (
            <ProfileRatings targetUserId={userId} isOwnProfile />
          )
        }
      />
      {isHome ? (
        <tr>
          <td className="pb-2">
            <FortuneOfTheDay />
          </td>
        </tr>
      ) : (
        <ProfileRowsSection profileRowsByTab={profileRowsByTab} />
      )}
    </ProfileCard>
  );
}
