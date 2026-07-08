import { MyProfile } from "@/components/pages/ProfilePage/MyProfile/MyProfile";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import { UserProfile } from "@/components/pages/ProfilePage/UserProfile/UserProfile";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

type OrkutMainColumnProps = {
  displayName: string;
  userId: string;
  isOwnProfile: boolean;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
  isHome?: boolean;
};

export function OrkutMainColumn({
  displayName,
  userId,
  isOwnProfile,
  profileRowsByTab,
  overview,
  isHome = false,
}: OrkutMainColumnProps) {
  if (isOwnProfile) {
    return (
      <MyProfile
        displayName={displayName}
        userId={userId}
        profileRowsByTab={profileRowsByTab}
        overview={overview}
        isHome={isHome}
      />
    );
  }

  return (
    <UserProfile
      displayName={displayName}
      userId={userId}
      profileRowsByTab={profileRowsByTab}
      overview={overview}
    />
  );
}
