import  { OrkutMainColumn } from "@/components/pages/ProfilePage/main-column";
import { TestimonialsSection } from "@/components/pages/ProfilePage/Shared/TestimonialsSection";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

export default function UserProfilePage({
  displayName,
  userId,
  profileRowsByTab,
  overview,
  isFriend,
}: {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview: ProfileOverviewResponse | null;
  isFriend: boolean;
}) {
  return (
    <>
      <div className="border border-orkut-border bg-white shadow-sm orkut-col-main-inner">
        <OrkutMainColumn
          displayName={displayName}
          userId={userId}
          isOwnProfile={false}
          profileRowsByTab={profileRowsByTab}
          overview={overview}
          isFriend={isFriend}
        />
      </div>
      <TestimonialsSection userId={userId} canWrite={true} />
    </>
  );
}
