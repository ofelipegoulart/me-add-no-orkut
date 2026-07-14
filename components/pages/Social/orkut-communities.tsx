import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { ThumbCardGrid } from "@/components/ui/thumb-card-grid";

type communities = { name: string; seed: string }[]
export default function OrkutCommunities({ communities, userId }: { communities: communities; userId: string }) {
  return (
    <div>
      <div className="orkut-tahoma text-sm leading-5.25 mt-1.25 mb-1.5 font-bold">
        <span className="text-black">minhas comunidades </span>
        <Link href={`/profile/${userId}/comunidades`} className="text-orkut-link-blue font-bold">({communities.length})</Link>
      </div>

      {communities.length === 0 ? (
        <div>
          <div className="border-t border-orkut-border" />
          <div className="flex justify-end py-1.5">
            <a href="#" className="text-orkut-link-blue text-[11px] underline">
              gerenciar
            </a>
          </div>
          <div className="pb-2">
            <OrkutActionButton className="orkut-tahoma text-[11px] px-3">
              adicionar comunidades
            </OrkutActionButton>
          </div>
        </div>
      ) : (
        <ThumbCardGrid
          items={communities.map((c) => ({
            key: c.name,
            href: `/comunidade/${c.seed}`,
            src: `https://picsum.photos/seed/comm-${c.seed}/48/48`,
            name: c.name,
          }))}
        />
      )}
    </div>
  );
}
