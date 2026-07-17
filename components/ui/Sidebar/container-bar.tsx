import Link from "next/link";
import { ORKUT_MENU_ICONS } from "@/data/mock-data";
import OrkutMenuIcon from "./menu-icon";
import AvatarUpload from "./avatar-upload";

export default function OrkutLeftSidebar({
  displayName,
  isOwnProfile = false,
  isFriend = false,
  userId,
  avatarUrl,
  showAddPhoto = false,
  infoLines = ["masculino, solteiro(a)", "tangara da serra, Brasil"],
}: {
  displayName: string;
  isOwnProfile?: boolean;
  isFriend?: boolean;
  userId?: string;
  avatarUrl?: string;
  showAddPhoto?: boolean;
  infoLines?: string[];
}) {
  const menuItems: [string, string][] = [
    [ORKUT_MENU_ICONS.perfil, "perfil"],
    [ORKUT_MENU_ICONS.recados, "recados"],
    [ORKUT_MENU_ICONS.fotos, "fotos"],
    [ORKUT_MENU_ICONS.videos, "vídeos"],
    [ORKUT_MENU_ICONS.depoimentos, "depoimentos"],
  ];

  const profileHref = userId ? `/Profile/${userId}` : "#";

  return (
    <div>
      {/* ── Bloco 1: foto + nome + info ── */}
      <div className="pb-2 text-center">
        <AvatarUpload avatarUrl={avatarUrl} showAddPhoto={showAddPhoto} profileHref={profileHref} />
        <div className="mt-1 font-bold text-orkut-link">
          <a href={profileHref}>{displayName}</a>
        </div>
        {infoLines.length > 0 && (
          <div className="text-[11px] text-gray-400 text-left">{infoLines.join(", ")}</div>
        )}
      </div>

      {/* ── Divisória ── */}
      <div className="border-t border-orkut-border" />

      {/* ── Bloco 2: ação de relacionamento (só em perfis de terceiros) ──
          "+ amigo" e "criar depoimento" nunca coexistem: quem ainda não é amigo
          vê "+ amigo"; quem já é amigo vê "criar depoimento" no lugar. */}
      {!isOwnProfile && (
        <>
          <div className="py-1 pl-1.5">
            <div>
              {isFriend ? (
                <Link href={userId ? `/Profile/${userId}/MainTestimonialWrite` : "#"} className="inline-flex items-center gap-1 text-orkut-link text-[12px]">
                  <OrkutMenuIcon src={ORKUT_MENU_ICONS.depoimentos} />
                  criar depoimento
                </Link>
              ) : (
                <Link href={userId ? `/Profile/${userId}/FriendAdd` : "#"} className="inline-flex items-center gap-1 text-orkut-link text-[12px]">
                  <OrkutMenuIcon src={ORKUT_MENU_ICONS.perfil} />
                  + amigo
                </Link>
              )}
            </div>
            <div className="mt-1.5">
              <a href="#" className="text-orkut-link text-[12px] pl-5">denunciar abuso</a>
              <div className="pl-5 mt-0.5">
                <img src="/icons/p_flagprofile.gif" alt="" width={14} height={14} />
              </div>
            </div>
          </div>
          <div className="border-t border-orkut-border" />
        </>
      )}

      {/* ── Bloco 3: menu lateral ── */}
      <div className="pt-1">
        <table
          className="w-full border-collapse overflow-hidden border border-orkut-border rounded"
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            {menuItems.map(([iconSrc, label]) => {
              const isPerfil = label === "perfil";
              const href = userId
                ? label === "recados" ? (isOwnProfile ? "/Home/Scraps" : `/Profile/${userId}/Scraps`)
                : label === "fotos" ? `/Profile/${userId}/AlbumList`
                : label === "perfil" ? `/Profile/${userId}`
                : label === "depoimentos" ? (isOwnProfile ? "/Home/Testimonials" : `/Profile/${userId}/Testimonials`)
                : "#"
                : "#";

              return (
                <tr
                  key={label}
                  className="bg-white hover:bg-[#f5f5f5]"
                >
                  <td className="px-1.5 py-0.75">
                    <div className="flex items-center justify-between">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.25 text-[#5a5a5a]! text-xs no-underline"
                      >
                        <OrkutMenuIcon src={iconSrc} />
                        {label}
                      </Link>
                      {isOwnProfile && isPerfil && (
                        <Link
                          href="/Profile/EditSummary"
                          className="text-orkut-link text-[11px]"
                        >
                          editar
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {isOwnProfile && (
              <>
                <tr>
                  <td className="px-1.5">
                    <div className="orkut-divider" />
                  </td>
                </tr>
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td className="px-1.5 py-0.75">
                    <Link
                      href="/Home/Settings"
                      className="inline-flex items-center gap-1.25 text-[#5a5a5a]! text-xs no-underline"
                    >
                      <OrkutMenuIcon src={ORKUT_MENU_ICONS.configuracoes} />
                      configurações
                    </Link>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
