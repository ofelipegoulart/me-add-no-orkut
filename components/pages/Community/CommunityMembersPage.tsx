"use client";

import { useState } from "react";
import Link from "next/link";
import { CommunityComingSoonTab } from "@/components/pages/Community/CommunityComingSoonTab";
import { CommunityFooter } from "@/components/pages/Community/CommunityFooter";
import { CommunityLeftColumn } from "@/components/pages/Community/CommunityLeftColumn";
import { CommunityMembersList } from "@/components/pages/Community/CommunityMembersList";
import { CommunityMembersTabs } from "@/components/pages/Community/CommunityMembersTabs";
import { CommunityPendingMembersTab } from "@/components/pages/Community/CommunityPendingMembersTab";
import { CommunityHeaderBlock } from "@/components/pages/Community/CommunityHeaderBlock";
import { BigAccentShell } from "@/components/ui/boxes/BigAccentShell";
import { roleFromRelation } from "@/components/pages/Community/types";
import type { MembersTab } from "@/components/pages/Community/types";
import type { CommunityDashboard } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export default function CommunityMembersPage({
  dashboard,
  initialTab = "members",
}: {
  dashboard: CommunityDashboard;
  initialTab?: MembersTab;
}) {
  const c = dashboard.community;
  const members = dashboard.featuredMembers ?? [];
  const role = roleFromRelation(c.viewerRelation);
  const showPending = role === "owner";
  const [tab, setTab] = useState<MembersTab>(initialTab === "pending" && !showPending ? "members" : initialTab);

  const icon = c.icon || NOPHOTO;
  const membersHref = `/Community/${c.id}/membros`;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <CommunityLeftColumn
        role={role}
        icon={icon}
        name={c.name}
        membersCount={c.membersCount}
        editHref={`/CommunityEdit?mode=edit&id=${c.id}`}
        membersHref={membersHref}
        pollHref={`/Community/${c.id}/Poll`}
      />

      <div style={{ marginLeft: 153 }}>
        <BigAccentShell className="overflow-hidden mb-2">
          <CommunityHeaderBlock
            title="Membros"
            breadcrumb={
              <>
                <Link href="/" className="text-orkut-link">Início</Link>
                {" › "}
                <Link href="/Communities" className="text-orkut-link">Comunidades</Link>
                {" › "}
                <Link href={`/Community/${c.id}`} className="text-orkut-link">{c.name}</Link>
                {" › "}
                <span>Membros</span>
              </>
            }
          />

          <CommunityMembersTabs active={tab} showPending={showPending} onChange={setTab} />

          {tab === "members" && (
            <CommunityMembersList members={members} membersCount={c.membersCount} />
          )}
          {tab === "friends" && (
            <CommunityComingSoonTab message="Ainda não é possível ver quais dos seus amigos participam desta comunidade." />
          )}
          {tab === "moderators" && (
            <CommunityComingSoonTab message="Este recurso ainda não está disponível." />
          )}
          {tab === "owners" && (
            <CommunityComingSoonTab message="Este recurso ainda não está disponível." />
          )}
          {tab === "pending" && showPending && (
            <CommunityPendingMembersTab communityId={c.id} />
          )}
        </BigAccentShell>
      </div>

      <CommunityFooter />
    </div>
  );
}
