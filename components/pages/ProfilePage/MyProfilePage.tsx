import { OrkutMainColumn } from "@/components/pages/ProfilePage/main-column";
import { UpdatesSection } from "@/components/pages/ProfilePage/MyProfile/UpdatesSection";
import { PendingTestimonials } from "@/components/pages/ProfilePage/Shared/PendingTestimonials";
import { TestimonialsSection } from "@/components/pages/ProfilePage/Shared/TestimonialsSection";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

export default function MyProfilePage({
  displayName,
  userId,
  profileRowsByTab,
  overview = null,
}: {
  displayName: string;
  userId: string;
  profileRowsByTab: ProfileRowsByTab;
  overview?: ProfileOverviewResponse | null;
}) {
  return (
    <>
      <div className="border border-orkut-border bg-white shadow-sm orkut-col-main-inner">
        <OrkutMainColumn
          displayName={displayName}
          userId={userId}
          isOwnProfile={true}
          profileRowsByTab={profileRowsByTab}
          overview={overview}
        />
      </div>
      <div className="orkut-col-section mt-1 bg-white border border-orkut-border px-2 py-1">
        <UpdatesSection />
      </div>
      <PendingTestimonials userId={userId} />
      <TestimonialsSection userId={userId} canWrite={false} />
    </>
  );
}
