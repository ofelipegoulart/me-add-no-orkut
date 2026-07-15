import Link from "next/link";

// Item da navegação da coluna esquerda (ícone + rótulo + divisória).
// No original só "participar" (join) é negrito; fórum/eventos são normais.
// As divisórias isolam "participar"; fórum e eventos ficam agrupados (sem linha entre eles).
export function NavItem({
  icon,
  label,
  href = "#",
  bold = false,
  divider = true,
  onClick,
}: {
  icon: string;
  label: string;
  href?: string;
  bold?: boolean;
  divider?: boolean;
  onClick?: () => void;
}) {
  const linkClassName = bold ? "text-orkut-link font-bold" : "text-orkut-link";

  return (
    <>
      <div className="flow-root">
        <span className="float-left w-5 pt-0.5 pl-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" width={14} height={14} />
        </span>
        <div className="ml-6 pt-0.75 pb-0.5 text-[11px] leading-3.5">
          {onClick ? (
            <button
              type="button"
              onClick={onClick}
              className={`${linkClassName} cursor-pointer border-0 bg-transparent p-0 text-left`}
            >
              {label}
            </button>
          ) : (
            <Link href={href} className={linkClassName}>{label}</Link>
          )}
        </div>
      </div>
      {divider && <div className="orkut-divider my-1.5" />}
    </>
  );
}
