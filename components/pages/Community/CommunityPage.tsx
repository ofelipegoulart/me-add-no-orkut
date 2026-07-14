import { CommunityForumBox } from "@/components/pages/Community/CommunityForumBox";
import { CommunityFooter } from "@/components/pages/Community/CommunityFooter";
import { CommunityInfoCard } from "@/components/pages/Community/CommunityInfoCard";
import { CommunityLeftColumn } from "@/components/pages/Community/CommunityLeftColumn";
import { CommunityRightColumn } from "@/components/pages/Community/CommunityRightColumn";
import type { CommunityRole } from "@/components/pages/Community/types";
import type { CommunityDashboard } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export default function CommunityPage({
  dashboard,
  viewerId,
}: {
  dashboard: CommunityDashboard;
  viewerId?: string;
}) {
  const c = dashboard.community;
  const topics = dashboard.topics ?? [];
  const members = dashboard.featuredMembers ?? [];

  const role: CommunityRole =
    viewerId && c.ownerId && viewerId === c.ownerId ? "owner" : "guest";

  const icon = c.icon || NOPHOTO;
  const category = c.categoryLabel || c.category || "—";

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <CommunityRightColumn role={role} membersCount={c.membersCount} members={members} />

      <CommunityLeftColumn
        role={role}
        icon={icon}
        name={c.name}
        membersCount={c.membersCount}
        editHref={`/CommunityEdit?mode=edit&id=${c.id}`}
      />

      {/* ══════════ Coluna principal (margin: 0 292 0 153) ══════════ */}
      <div style={{ margin: "0 292px 0 153px" }}>
        <CommunityInfoCard community={c} category={category} />
        <CommunityForumBox topics={topics} role={role} />
      </div>

      <CommunityFooter />
    </div>
  );
}
