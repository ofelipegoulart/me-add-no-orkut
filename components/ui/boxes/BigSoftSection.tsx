import Link from "next/link";

export function BigSoftSection({
  title,
  icon = false,
  seeAllHref,
  seeAllLabel = "ver todos »",
  children,
}: {
  title?: React.ReactNode;
  icon?: boolean;
  seeAllHref?: string;
  seeAllLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="orkut-col-section mt-1 bg-white border border-orkut-border px-2 py-1">
      {title && (
        <h2 className="orkut-tahoma text-sm leading-5.25 font-bold text-black py-1.75 pb-1.25">
          {icon && (
            <img
              src="/icons/arr_expanded.gif"
              alt=""
              width={11}
              height={11}
              className="inline-block mr-1 align-middle"
            />
          )}
          {title}
        </h2>
      )}
      {children}
      {seeAllHref && (
        <div className="pb-1 text-right">
          <Link href={seeAllHref} className="text-orkut-link text-[11px] underline">
            {seeAllLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
