import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { ThumbCardGrid } from "@/components/ui/thumb-card-grid";

const NOPHOTO = "/avatar/i_nophoto128.gif";

type communities = { name: string; seed: string; icon?: string; count: number }[]
export default function OrkutCommunities({ communities, userId, title = "minhas comunidades" }: { communities: communities; userId: string; title?: string }) {
  return (
    <div>
      <div className="orkut-tahoma text-sm leading-5.25 mt-1.25 mb-1.5 font-bold">
        <span className="text-black">{title} </span>
        <Link href={`/Profile/${userId}/comunidades`} className="text-orkut-link font-bold">({communities.length})</Link>
      </div>

      {communities.length === 0 ? (
        <div>
          <div className="border-t border-orkut-border" />
          <div className="flex justify-end py-1.5">
            <a href="#" className="text-orkut-link text-[11px] underline">
              gerenciar
            </a>
          </div>
          <div className="pb-2">
            <Link href="/Communities">
              <OrkutActionButton className="orkut-tahoma text-[11px] px-3">
                adicionar comunidades
              </OrkutActionButton>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <ThumbCardGrid
            items={communities.map((c) => ({
              key: c.name,
              href: `/Community/${c.seed}`,
              src: c.icon || NOPHOTO,
              name: c.name,
              count: c.count,
            }))}
          />
          <div className="border-t border-orkut-border pt-1 mt-0.5">
            <Link href={`/Profile/${userId}/comunidades`} className="underline">ver todos</Link>
          </div>
        </div>
      )}
    </div>
  );
}
