import { NavItem } from "@/components/pages/Community/NavItem";
import type { CommunityRole } from "@/components/pages/Community/types";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";

export function CommunityLeftColumn({
  role,
  icon,
  name,
  membersCount,
  editHref,
  membersHref,
  onJoinClick,
}: {
  role: CommunityRole;
  icon: string;
  name: string;
  membersCount: number;
  editHref: string;
  membersHref: string;
  onJoinClick?: () => void;
}) {
  return (
    <SidebarLeftBox>
      <div className="text-center mb-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt={name} width={130} className="mx-auto" />
      </div>
      <div className="text-[11px] leading-3.5 px-1.25 mb-0.75">
        <a href="#" className="text-orkut-link font-bold">{name}</a>
        <br />
        ({membersCount} {membersCount === 1 ? "membro" : "membros"})
      </div>
      <div className="orkut-divider my-1.5" />
      {role === "owner" ? (
        <>
          {/* Grupo 1: ações do dono */}
          <NavItem icon="/icons/i_friend.gif" label="convidar amigos" divider={false} />
          <NavItem icon="/icons/i_editcomm.gif" label="editar perfil" href={editHref} />
          {/* Grupo 2: recursos da comunidade */}
          <NavItem icon="/icons/c_forum.gif" label="fórum" divider={false} />
          <NavItem icon="/icons/i_poll.gif" label="enquetes" divider={false} />
          <NavItem icon="/icons/c_events.gif" label="eventos" divider={false} />
          <NavItem icon="/icons/i_friendgroup.png" label="membros" href={membersHref} divider={false} />
        </>
      ) : (
        <>
          {role === "member" ? (
            <NavItem icon="/icons/i_unjoin.gif" label="deixar comunidade" bold />
          ) : (
            <NavItem icon="/icons/c_join.png" label="entrar" bold onClick={onJoinClick} />
          )}
          <NavItem icon="/icons/c_forum.gif" label="fórum" divider={false} />
          <NavItem icon="/icons/c_events.gif" label="eventos" divider={false} />
          <NavItem icon="/icons/i_friendgroup.png" label="membros" href={membersHref} divider={false} />
        </>
      )}
    </SidebarLeftBox>
  );
}
