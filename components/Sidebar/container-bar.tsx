import { ORKUT_MENU_ICONS } from "@/data/mock-data";
import OrkutMenuIcon from "./menu-icon";
import AvatarUpload from "./avatar-upload";

export default function OrkutLeftSidebar({
  displayName,
  isOwnProfile = false,
  userId,
  avatarUrl,
  showAddPhoto = false,
}: {
  displayName: string;
  isOwnProfile?: boolean;
  userId?: string;
  avatarUrl?: string;
  showAddPhoto?: boolean;
}) {
  const menuItems: [string, string][] = [
    [ORKUT_MENU_ICONS.perfil, "perfil"],
    [ORKUT_MENU_ICONS.recados, "recados"],
    [ORKUT_MENU_ICONS.fotos, "fotos"],
    [ORKUT_MENU_ICONS.videos, "vídeos"],
    [ORKUT_MENU_ICONS.depoimentos, "depoimentos"],
  ];

  const profileHref = userId ? `/profile/${userId}` : "#";

  return (
    <div>
      {/* ── Bloco 1: foto + nome + info ── */}
      <div className="pb-2 text-center">
        <AvatarUpload avatarUrl={avatarUrl} showAddPhoto={showAddPhoto} profileHref={profileHref} />
        <div className="mt-1 font-bold text-orkut-link-blue">
          <a href={profileHref}>{displayName}</a>
        </div>
        <div className="text-[11px] text-left" style={{color: "#5a5a5a"}}>masculino, solteiro(a)</div>
        <div className="text-[11px] text-left" style={{color: "#5a5a5a"}}>tangara da serra, Brasil</div>
      </div>

      {/* ── Divisória ── */}
      <div className="border-t border-orkut-border" />

      {/* ── Bloco 2: + amigo (somente para perfis que não são do usuário logado) ── */}
      {!isOwnProfile && (
        <>
          <div className="py-1 pl-1.5">
            <div>
              <a href="#" className="inline-flex items-center gap-1 text-orkut-link-blue text-[12px]">
                <OrkutMenuIcon src={ORKUT_MENU_ICONS.perfil} />
                + amigo
              </a>
            </div>
            <div className="mt-0.5">
              <a href="#" className="text-orkut-link-blue text-[12px] pl-5">mais »</a>
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
                ? label === "recados" ? `/profile/${userId}/recados`
                : label === "fotos" ? `/profile/${userId}/fotos`
                : label === "perfil" ? `/profile/${userId}`
                : "#"
                : "#";

              return (
                <tr
                  key={label}
                  className={isOwnProfile ? "bg-white hover:bg-[#f5f5f5]" : "bg-[#ddeeff] hover:bg-[#c8e0f5]"}
                >
                  <td className="px-1.5 py-0.75">
                    <div className="flex items-center justify-between">
                      <a
                        href={href}
                        className="inline-flex items-center gap-1.25 text-[#5a5a5a]! text-xs no-underline"
                      >
                        <OrkutMenuIcon src={iconSrc} />
                        {label}
                      </a>
                      {isOwnProfile && isPerfil && (
                        <a
                          href="/profile/EditSummary"
                          className="text-orkut-link-blue text-[11px]"
                        >
                          editar
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
