import OrkutMenuIcon from "@/components/LeftSideBar/menu-icon";
import { CoolIndicator } from "@/utils/cool-indicator";
import { SexyIndicator } from "@/utils/sexy-indicator";
import { TrustableIndicator } from "@/utils/trustable-indicator";
import { PROFILE_ROWS, ORKUT_MENU_ICONS } from "@/data/mock-data";

export function OrkutMainColumn({ displayName }: { displayName: string }) {
  return (
    <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td className="pb-2">
            {/* Profile name heading — Arial, traço fino, sem negrito, como no Orkut 2009 */}
            <h1
              className="font-normal text-black py-1.75 pb-1.25"
              style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "22px", lineHeight: "28px", fontWeight: "normal" }}
            >
              {displayName}
            </h1>
          </td>
        </tr>
        <tr>
          <td className="pb-2">
            <div className="border-t border-[#d4e0ef]"></div>
            {/* recados / fotos / vídeos / fãs / confiável / legal / sexy */}
            <table className="border-collapse" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr className="align-top">
                  {/* recados */}
                  <td className="pr-3 align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">
                      <a href="#" className="text-[#5a5a5a] no-underline">recados</a>
                    </div>
                    <div className="leading-4">
                      <OrkutMenuIcon src={ORKUT_MENU_ICONS.recados} />
                      <span className="text-[11px]">114</span>
                    </div>
                  </td>
                  {/* fotos */}
                  <td className="pr-3 align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">
                      <a href="#" className="text-[#5a5a5a] no-underline">fotos</a>
                    </div>
                    <div className="leading-4">
                      <OrkutMenuIcon src={ORKUT_MENU_ICONS.fotos} />
                      <span className="text-[11px]">0</span>
                    </div>
                  </td>
                  {/* vídeos */}
                  <td className="pr-3 align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">
                      <a href="#" className="text-[#5a5a5a] no-underline">vídeos</a>
                    </div>
                    <div className="leading-4">
                      <OrkutMenuIcon src={ORKUT_MENU_ICONS.videos} />
                      <span className="text-[11px]">5</span>
                    </div>
                  </td>
                  {/* fãs */}
                  <td className="pr-3 align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">
                      <a href="#" className="text-[#5a5a5a] no-underline">fãs</a>
                    </div>
                    <div className="leading-4">
                      <OrkutMenuIcon src={ORKUT_MENU_ICONS.fans} />
                      <span className="text-[11px]">15</span>
                    </div>
                  </td>
                  {/* confiável */}
                  <td className="pr-3 align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">confiável</div>
                    <div className="leading-4">
                      <TrustableIndicator trustablePercentage={3 / 6} />
                    </div>
                  </td>
                  {/* legal */}
                  <td className="pr-3 align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">legal</div>
                    <div className="leading-4">
                      <CoolIndicator coolPercentage={2 / 6} />
                    </div>
                  </td>
                  {/* sexy */}
                  <td className="align-top">
                    <div className="text-[#5a5a5a] text-[11px] leading-3.5">sexy</div>
                    <div className="leading-4">
                      <SexyIndicator sexyPercentage={5 / 6} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-[#d4e0ef]"></div>
          </td>
        </tr>
        <tr>
          <td className="pb-0">
            {/* "social" tab */}
            <div className="inline-block bg-[#6b8cba] px-3 py-0.5 font-bold text-[12px] border border-[#5a7aaa] border-b-0 rounded-t" style={{ color: "#fff" }}>
              social
            </div>
          </td>
        </tr>
        <tr>
          <td className="orkut-social-table-wrap pt-0">
            <table
              className="orkut-social-fields w-full border border-[#bcd2e8]"
              cellPadding={0}
              cellSpacing={0}
            >
              <colgroup>
                <col className="orkut-social-col-label" />
                <col />
              </colgroup>
              <tbody>
                {PROFILE_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]"}
                  >
                    <td className="orkut-social-label">{row.label}</td>
                    <td className="orkut-social-value">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}