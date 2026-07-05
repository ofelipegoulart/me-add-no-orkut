import { FortuneOfTheDay } from "@/components/pages/ProfilePage/MyProfile/FortuneOfTheDay";
import { MyProfileStatus } from "@/components/pages/ProfilePage/MyProfile/MyProfileStatus";
import { ProfileCard } from "@/components/pages/ProfilePage/Shared/ProfileCard";
import { ProfileRowsSection } from "@/components/pages/ProfilePage/Shared/ProfileRowsSection";
import { ProfileShortcuts } from "@/components/pages/ProfilePage/Shared/ProfileShortcuts";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

type MyProfileProps = {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
};

export function MyProfile({ displayName, userId, profileRowsByTab, overview }: MyProfileProps) {
  return (
    <ProfileCard title={`Bem-vindo, ${displayName}`}>
      {/* Defina seu status */}
      <MyProfileStatus />
      {/* Recados, fotos, vídeos, ... */}
      <ProfileShortcuts userId={userId} isMyProfile overview={overview} />
      <tr>
        <td className="pb-2">
          <FortuneOfTheDay />
        </td>
      </tr>
    </ProfileCard>
  );
}
