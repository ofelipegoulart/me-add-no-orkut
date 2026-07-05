import Link from "next/link";

import OrkutMenuIcon from "@/components/Sidebar/menu-icon";
import { ORKUT_MENU_ICONS } from "@/data/mock-data";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

type ProfileShortcutsProps = {
  userId: string;
  isMyProfile: boolean;
  overview: ProfileOverviewResponse | null;
};

type ShortcutItem = {
  key: string;
  label: string;
  href: (userId: string) => string;
  icon: string;
};

const SHORTCUTS: ShortcutItem[] = [
  { key: "recados", label: "recados", href: (userId) => `/profile/${userId}/recados`, icon: ORKUT_MENU_ICONS.recados },
  { key: "fotos", label: "fotos", href: (userId) => `/profile/${userId}/fotos`, icon: ORKUT_MENU_ICONS.fotos },
  { key: "videos", label: "vídeos", href: () => "#", icon: ORKUT_MENU_ICONS.videos },
  { key: "fans", label: "fãs", href: () => "#", icon: ORKUT_MENU_ICONS.fans },
];

const rowClassName = "align-top";
const cellClassName = "pr-3 align-top";
const labelClassName = "text-[11px] leading-3.5 text-[#5a5a5a]";
const linkClassName = "text-[#5a5a5a] no-underline";
const countClassName = "text-[11px]";
const tableWrapperClassName = "border-collapse";
const sectionBorderClassName = "border-t border-orkut-border";

function ShortcutCell({ href, label, icon, count }: { href: string; label: string; icon: string; count: number }) {
  return (
    <td className={cellClassName}>
      <div className={labelClassName}>
        <Link href={href} className={linkClassName}>
          {label}
        </Link>
      </div>
      <div className="leading-4">
        <OrkutMenuIcon src={icon} />
        <span className={countClassName}>{count}</span>
      </div>
    </td>
  );
}

export function ProfileShortcuts({ userId, isMyProfile, overview }: ProfileShortcutsProps) {
  // Use counts from overview API or fallback to defaults
  const counts = overview?.counts
    ? {
        recados: overview.counts.scrapsCount || 0,
        fotos: 0, // TODO: Add photos count when available
        videos: 0, // TODO: Add videos count when available
        fans: overview.counts.testimonialsCount || 0,
      }
    : isMyProfile
    ? { recados: 0, fotos: 0, videos: 0, fans: 0 }
    : { recados: 114, fotos: 0, videos: 5, fans: 15 };

  return (
    <tr>
      <td className="pb-2">
        <div className={sectionBorderClassName}></div>
        <table className={tableWrapperClassName} cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr className={rowClassName}>
              {SHORTCUTS.map((shortcut) => (
                <ShortcutCell
                  key={shortcut.key}
                  href={shortcut.href(userId)}
                  label={shortcut.label}
                  icon={shortcut.icon}
                  count={counts[shortcut.key as keyof typeof counts]}
                />
              ))}
            </tr>
          </tbody>
        </table>
        <div className={sectionBorderClassName}></div>
      </td>
    </tr>
  );
}
