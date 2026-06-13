import { ORKUT_MENU_ICONS } from "@/data/mock-data";
import OrkutMenuIcon from "./menu-icon";

export default function OrkutLeftSidebar({ displayName }: { displayName: string }) {
  const avatar = `https://picsum.photos/seed/profile-main/120/120`;
  return (
    <div>
      {/* ── Bloco 1: foto + nome + info ── */}
      <div className="pb-2 text-center">
        <img
          src={avatar}
          alt=""
          width={120}
          height={120}
          className="mx-auto border border-[#bcd2e8]"
        />
        <div className="mt-1 font-bold">
          <a href="#">{displayName}</a>
        </div>
        <div className="text-[11px] text-left" style={{color: "#5a5a5a"}}>masculino, solteiro(a)</div>
        <div className="text-[11px] text-left" style={{color: "#5a5a5a"}}>tangara da serra, Brasil</div>
      </div>

      {/* ── Divisória ── */}
      <div className="border-t border-[#d4e0ef]" />

      {/* ── Bloco 2: + amigo (com ícone) e mais » um abaixo do outro ── */}
      <div className="py-1 pl-[6px]">
        <div>
          <a href="#" className="inline-flex items-center gap-1 text-[#02679c] text-[12px]">
            <OrkutMenuIcon src={ORKUT_MENU_ICONS.perfil} />
            + amigo
          </a>
        </div>
        <div className="mt-[2px]">
          <a href="#" className="text-[#02679c] text-[12px] pl-[20px]">mais »</a>
        </div>
      </div>

      {/* ── Divisória ── */}
      <div className="border-t border-[#d4e0ef]" />

      {/* ── Bloco 3: menu lateral (sem título "atalhos") ── */}
      <div className="pt-1">
        <table
          className="w-full border-collapse overflow-hidden border border-[#bcd2e8] rounded"
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            {[
              [ORKUT_MENU_ICONS.perfil, "perfil"],
              [ORKUT_MENU_ICONS.recados, "recados"],
              [ORKUT_MENU_ICONS.fotos, "fotos"],
              [ORKUT_MENU_ICONS.videos, "vídeos"],
              [ORKUT_MENU_ICONS.depoimentos, "depoimentos"],
            ].map(([iconSrc, label]) => (
              <tr key={label} className="bg-[#ddeeff] hover:bg-[#c8e0f5]">
                <td className="border-t border-[#bcd2e8] px-[6px] py-[3px]">
                  <a
                    href="#"
                    className="inline-flex items-center gap-[5px] !text-[#5a5a5a] text-[12px] font-[Tahoma,Verdana,Arial,sans-serif] no-underline"
                  >
                    <OrkutMenuIcon src={iconSrc} />
                    {label}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
