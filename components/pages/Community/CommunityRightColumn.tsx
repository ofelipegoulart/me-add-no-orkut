import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { ThumbCardGrid } from "@/components/ui/thumb-card-grid";
import type { CommunityMemberSummary } from "@/lib/profile-types";
import type { CommunityRole } from "@/components/pages/Community/types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export function CommunityRightColumn({
  role,
  membersCount,
  members,
  membersHref,
  hideMemberBoxes = false,
}: {
  role: CommunityRole;
  membersCount: number;
  members: CommunityMemberSummary[];
  membersHref: string;
  hideMemberBoxes?: boolean;
}) {
  if (role !== "owner" || hideMemberBoxes) {
    return (
      <div className="float-right w-[284px]">
        <div className="text-center mt-2">
          <a href="#" className="inline-flex items-center gap-1 text-[11px] text-orkut-nav-inactive">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/i_tool.png" alt="" width={12} height={12} />
            denunciar comunidade
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="float-right w-[284px]">
      {/* Caixa "membros" — mesmo layout de grade do orkut-friends.tsx */}
      <div className="border border-orkut-border bg-white rounded-[6px] mb-2">
        <h2 className="orkut-section-heading" style={{ margin: "5px 0 6px 10px" }}>
          membros ({membersCount})
        </h2>
        {members.length === 0 ? (
          <div className="px-2 pb-2 text-[11px] text-[#7b7b7b]">ainda não há membros.</div>
        ) : (
          <div className="px-1.5">
            <ThumbCardGrid
              items={members.map((m) => ({
                key: m.id,
                href: `/Profile/${m.id}`,
                src: m.photoUrl || NOPHOTO,
                name: m.name,
              }))}
            />
          </div>
        )}
        <div className="px-2 pb-2 pt-1">
          <Link href={membersHref} className="text-[11px] font-bold text-orkut-link underline">ver membros</Link>
        </div>
      </div>

      {/* Caixa "comunidades relacionadas" */}
      <div className="border border-orkut-border bg-white rounded-[6px] mb-2">
        <h2 className="orkut-section-heading" style={{ margin: "5px 0 6px 10px" }}>
          comunidades relacionadas
        </h2>
        <div className="px-2 pb-2">
          <OrkutActionButton className="orkut-tahoma text-[14px]">
            adicionar comunidades
          </OrkutActionButton>
        </div>
      </div>
    </div>
  );
}
