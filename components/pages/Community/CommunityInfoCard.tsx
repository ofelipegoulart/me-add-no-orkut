import Link from "next/link";
import { InfoRow } from "@/components/pages/Community/InfoRow";
import { CommunityHeaderBlock } from "@/components/pages/Community/CommunityHeaderBlock";
import { BigAccentShell } from "@/components/ui/boxes/BigAccentShell";
import {
  formatDateLong,
  formatLocation,
  privacyLabel,
  typeLabel,
} from "@/components/pages/Community/format";
import type { CommunityInfo } from "@/lib/profile-types";

export function CommunityInfoCard({ community, category }: { community: CommunityInfo; category: string }) {
  const c = community;
  const location = formatLocation(c.location);

  return (
    <BigAccentShell className="overflow-hidden mb-2">
      <CommunityHeaderBlock
        title={c.name}
        breadcrumb={
          <>
            <Link href="/" className="text-orkut-link">Início</Link>
            {" › "}
            <Link href="/Communities" className="text-orkut-link">Comunidades</Link>
            {" › "}
            <a href="#" className="text-orkut-link">{category}</a>
            {" › "}
            <span>{c.name}</span>
          </>
        }
      />
      {/* Faixas da ficha, com gutter branco em volta (padding 7px/2px) */}
      <div className="px-[7px] pb-[2px]">
        {c.description && <InfoRow label="descrição:" alt>{c.description}</InfoRow>}
        <InfoRow label="idioma:" alt={false}><b className="font-bold">{c.language || "—"}</b></InfoRow>
        <InfoRow label="categoria:" alt><a href="#" className="text-orkut-link">{category}</a></InfoRow>
        <InfoRow label="dono:" alt={false}>
          {c.ownerId ? (
            <Link href={`/Profile/${c.ownerId}`} className="text-orkut-link">{c.ownerName || "—"}</Link>
          ) : (
            c.ownerName || "—"
          )}
        </InfoRow>
        <InfoRow label="tipo:" alt>{typeLabel(c.type)}</InfoRow>
        <InfoRow label="privacidade do conteúdo:" alt={false}>{privacyLabel(c.contentPrivacy)}</InfoRow>
        {location && <InfoRow label="localização:" alt>{location}</InfoRow>}
        <InfoRow label="criada em:" alt={false}>{formatDateLong(c.createdAt)}</InfoRow>
        <InfoRow label="membros:" alt>{c.membersCount}</InfoRow>
      </div>
    </BigAccentShell>
  );
}
