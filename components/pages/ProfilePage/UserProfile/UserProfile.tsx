import { ProfileCard } from "@/components/pages/ProfilePage/Shared/ProfileCard";
import { ProfileRowsSection } from "@/components/pages/ProfilePage/Shared/ProfileRowsSection";
import { ProfileShortcuts } from "@/components/pages/ProfilePage/Shared/ProfileShortcuts";
import { ProfileRatings } from "@/components/pages/ProfilePage/Shared/ProfileRatings";
import { AddFriendButton } from "@/components/pages/ProfilePage/Shared/AddFriendButton";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

type UserProfileProps = {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
  isFriend: boolean;
};

export function UserProfile({ displayName, userId, profileRowsByTab, overview, isFriend }: UserProfileProps) {
  return (
    <ProfileCard title={displayName}>
      <AddFriendButton targetUserId={userId} initialIsFriend={isFriend} />
      <ProfileShortcuts userId={userId} isMyProfile={false} overview={overview} />
      {/* Rating section for evaluating other users */}
      <ProfileRatings targetUserId={userId} />
      <ProfileRowsSection profileRowsByTab={profileRowsByTab} />
    </ProfileCard>
  );
}
