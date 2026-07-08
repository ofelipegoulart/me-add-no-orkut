import Link from "next/link";

// Item de mídia (foto ou vídeo) exibido no grid de miniaturas. Enquanto não há
// endpoints de fotos/vídeos no backend, esta seção é puramente apresentacional:
// recebe `items` (por ora vazio) e `count`, ficando pronta para quando a API
// existir.
export interface MediaItem {
  id: string;
  thumbnailUrl: string;
  href?: string;
  title?: string;
}

type RecentMediaSectionProps = {
  title: string;
  count: number;
  items?: MediaItem[];
  seeAllHref?: string;
  seeAllLabel?: string;
  emptyLabel?: string;
};

// Limita a 5 miniaturas por linha, como no Orkut original.
const MAX_PER_ROW = 5;

export function RecentMediaSection({
  title,
  count,
  items = [],
  seeAllHref,
  seeAllLabel = "ver todas »",
  emptyLabel = "nada por aqui ainda.",
}: RecentMediaSectionProps) {
  const thumbs = items.slice(0, MAX_PER_ROW);

  return (
    <div className="orkut-col-section mt-1 bg-white border border-orkut-border px-2 py-1">
      <h2 className="orkut-tahoma text-sm leading-5.25 font-bold text-black py-1.75 pb-1.25">
        <img src="/icons/arr_expanded.gif" alt="" width={11} height={11} className="inline-block mr-1 align-middle" />
        {title} ({count})
      </h2>

      {thumbs.length > 0 ? (
        <div
          className="grid gap-1.5 pb-1"
          style={{ gridTemplateColumns: `repeat(${MAX_PER_ROW}, minmax(0, 1fr))` }}
        >
          {thumbs.map((item) => {
            const thumb = (
              <img
                src={item.thumbnailUrl}
                alt={item.title ?? ""}
                className="aspect-square w-full border border-orkut-border object-cover"
              />
            );
            return item.href ? (
              <Link key={item.id} href={item.href} className="block">
                {thumb}
              </Link>
            ) : (
              <span key={item.id} className="block">
                {thumb}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="py-2 text-[12px] text-[#5a5a5a]">{emptyLabel}</div>
      )}

      {seeAllHref && (
        <div className="pb-1 text-right">
          <Link
            href={seeAllHref}
            className="text-orkut-link-blue text-[11px] underline"
          >
            {seeAllLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
