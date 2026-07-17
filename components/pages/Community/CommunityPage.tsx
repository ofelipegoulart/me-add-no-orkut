"use client";

import { useState } from "react";
import { CommunityForumBox } from "@/components/pages/Community/CommunityForumBox";
import { CommunityFooter } from "@/components/pages/Community/CommunityFooter";
import { CommunityInfoCard } from "@/components/pages/Community/CommunityInfoCard";
import { CommunityJoinConfirmCard } from "@/components/pages/Community/CommunityJoinConfirmCard";
import { CommunityJoinRequestSentCard } from "@/components/pages/Community/CommunityJoinRequestSentCard";
import { CommunityLeftColumn } from "@/components/pages/Community/CommunityLeftColumn";
import { CommunityModerationNotice } from "@/components/pages/Community/CommunityModerationNotice";
import { CommunityPollBox } from "@/components/pages/Community/CommunityPollBox";
import { CommunityPollListWidget } from "@/components/pages/Community/CommunityPollListWidget";
import { CommunityRightColumn } from "@/components/pages/Community/CommunityRightColumn";
import { roleFromRelation } from "@/components/pages/Community/types";
import type { CommunityRole } from "@/components/pages/Community/types";
import { joinCommunity } from "@/lib/profile-service";
import type { CommunityDashboard } from "@/lib/profile-types";
import { adaptActivePollToPoll } from "@/lib/poll-types";
import type { PollSummary } from "@/lib/poll-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export default function CommunityPage({
  dashboard,
  polls,
}: {
  dashboard: CommunityDashboard;
  polls: PollSummary[];
}) {
  const c = dashboard.community;
  const topics = dashboard.topics ?? [];
  const members = dashboard.featuredMembers ?? [];

  const [role, setRole] = useState<CommunityRole>(() => roleFromRelation(c.viewerRelation));
  const [joinFlow, setJoinFlow] = useState<"idle" | "confirm" | "pending">("idle");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState(
    () => c.type === "MODERATED" && c.viewerRelation === "PENDING",
  );

  const icon = c.icon || NOPHOTO;
  const category = c.categoryLabel || c.category || "—";

  // dashboard.activePoll vem preenchido de verdade pelo backend (a enquete
  // mais recente por createdAt) — null só quando a comunidade não tem
  // nenhuma enquete ainda, e o box simplesmente não renderiza.
  const featuredPoll = dashboard.activePoll ? adaptActivePollToPoll(dashboard.activePoll, c.id) : null;

  async function handleConfirmJoin() {
    setJoining(true);
    setJoinError(null);
    try {
      const { status } = await joinCommunity({ communityId: c.id });
      if (status === "APPROVED") {
        setRole("member");
        setJoinFlow("idle");
      } else {
        setJoinFlow("pending");
        setPendingApproval(true);
      }
    } catch {
      setJoinError("Não foi possível participar da comunidade. Tente novamente.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      {pendingApproval && <CommunityModerationNotice />}

      <CommunityRightColumn
        role={role}
        membersCount={c.membersCount}
        members={members}
        membersHref={`/Community/${c.id}/membros`}
        hideMemberBoxes={joinFlow !== "idle"}
      />

      <CommunityLeftColumn
        role={role}
        icon={icon}
        name={c.name}
        membersCount={c.membersCount}
        editHref={`/CommunityEdit?mode=edit&id=${c.id}`}
        membersHref={`/Community/${c.id}/membros`}
        pollHref={`/Community/${c.id}/Poll`}
        onJoinClick={() => setJoinFlow("confirm")}
      />

      {/* ══════════ Coluna principal (margin: 0 292 0 153) ══════════ */}
      <div style={{ margin: "0 292px 0 153px" }}>
        {joinFlow === "confirm" ? (
          <CommunityJoinConfirmCard
            pending={joining}
            error={joinError}
            onConfirm={handleConfirmJoin}
            onCancel={() => setJoinFlow("idle")}
          />
        ) : joinFlow === "pending" ? (
          <CommunityJoinRequestSentCard onBack={() => setJoinFlow("idle")} />
        ) : (
          <>
            <CommunityInfoCard community={c} category={category} />
            <CommunityForumBox topics={topics} role={role} />
            <CommunityPollBox poll={featuredPoll} />
            <CommunityPollListWidget communityId={c.id} polls={polls} />
          </>
        )}
      </div>

      <CommunityFooter />
    </div>
  );
}
