import type { ReactNode } from "react";
import { OrkutHeader } from "@/src/components/orkut-header";

type Props = {
  params: Promise<{ username: string }>;
};

function displayNameFromUsername(username: string) {
  try {
    return decodeURIComponent(username)
      .replace(/\+/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  } catch {
    return username;
  }
}

function emailLocalFromUsername(username: string) {
  try {
    const raw = decodeURIComponent(username).toLowerCase().replace(/\+/g, "");
    const slug = raw.replace(/[^a-z0-9._-]/g, "").slice(0, 32);
    return slug || "usuario";
  } catch {
    return "usuario";
  }
}

const PROFILE_ROWS: { label: string; value: ReactNode }[] = [
  { label: "relacionamento:", value: "solteiro(a)" },
  { label: "aniversário:", value: "15 de julho" },
  { label: "idade:", value: "20" },
  { label: "cidade natal:", value: <a className="text-[#003399] underline">tangara da serra</a> },
  {
    label: "quem sou eu:",
    value:
      "Sou estudante, curto música, cinema e passar tempo com os amigos. No orkut pra trocar ideia, conhecer gente nova e participar das comunidades que curto.",
  },
  { label: "fumo:", value: "não" },
  { label: "bebo:", value: "socialmente" },
  { label: "moro:", value: "com os pais" },
  { label: "página web:", value: <a className="text-[#003399] underline">http://</a> },
];

const FRIENDS: { name: string; count: number; seed: string }[] = [
  { name: "Priscilaaa", count: 485, seed: "a" },
  { name: "Júlia", count: 120, seed: "b" },
  { name: "Rafa", count: 88, seed: "c" },
  { name: "Lucas", count: 64, seed: "d" },
  { name: "Marina", count: 52, seed: "e" },
  { name: "Pedro", count: 41, seed: "f" },
  { name: "Ana", count: 33, seed: "g" },
  { name: "Bruno", count: 29, seed: "h" },
  { name: "Camila", count: 22, seed: "i" },
];

const COMMUNITIES: { name: string; seed: string }[] = [
  { name: "As Ninas de...", seed: "1" },
  { name: "Só faço...", seed: "2" },
  { name: "Anime-Sai", seed: "3" },
  { name: "Rock BR", seed: "4" },
  { name: "Cinema", seed: "5" },
  { name: "Dev Web", seed: "6" },
  { name: "Futebol", seed: "7" },
  { name: "Música MPB", seed: "8" },
  { name: "Games", seed: "9" },
];

const ORKUT_MENU_ICONS = {
  perfil: "/icons/p_profile.gif",
  recados: "/icons/p_scrap.gif",
  fotos: "/icons/p_camera.gif",
  videos: "/icons/p_video.gif",
  depoimentos: "/icons/p_pen.png",
  fans: "/icons/p_fan.png",
} as const;

function OrkutMenuIcon({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      className="mr-1 inline-block align-middle"
      style={{ verticalAlign: "middle" }}
    />
  );
}

function OrkutLeftSidebar({ displayName }: { displayName: string }) {
  const avatar = `https://picsum.photos/seed/profile-main/120/120`;
  return (
    <table className="w-full border-collapse text-[12px]" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td className="pb-2 text-center">
            <img
              src={avatar}
              alt=""
              width={120}
              height={120}
              className="mx-auto border border-[#bcd2e8]"
            />
          </td>
        </tr>
        <tr>
          <td className="pb-1 text-center">
            <a href="#" className="font-bold text-[#003399] hover:underline">
              {displayName}
            </a>
          </td>
        </tr>
        <tr>
          <td className="pb-1 text-center text-[11px] text-gray-700">masculino, solteiro(a)</td>
        </tr>
        <tr>
          <td className="pb-2 text-center text-[11px] text-gray-700">tangara da serra, Brasil</td>
        </tr>
        <tr>
          <td className="pb-2 text-center text-[11px]">
            <a href="#" className="text-[#003399] hover:underline">
              + amigo
            </a>
            <span className="mx-2 text-gray-300">|</span>
            <a href="#" className="text-[#003399] hover:underline">
              mais »
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <table className="w-full border-collapse overflow-hidden rounded border border-[#bcd2e8]" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td className="bg-[#d4e8f7] text-[11px] font-bold text-[#336699]">atalhos</td>
                </tr>
                {[
                  [ORKUT_MENU_ICONS.perfil, "perfil"],
                  [ORKUT_MENU_ICONS.recados, "recados"],
                  [ORKUT_MENU_ICONS.fotos, "fotos"],
                  [ORKUT_MENU_ICONS.videos, "vídeos"],
                  [ORKUT_MENU_ICONS.depoimentos, "depoimentos"],
                ].map(([iconSrc, label]) => (
                  <tr key={label} className="bg-white">
                    <td className="border-t border-[#e8eef4]">
                      <a href="#" className="text-[#003399] hover:underline">
                        <OrkutMenuIcon src={iconSrc} />
                        {label}
                      </a>
                    </td>
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

function OrkutMainColumn({ displayName }: { displayName: string }) {
  return (
    <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td className="pb-2">
            <h1 className="text-xl font-bold text-[#003399]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
              {displayName}
            </h1>
          </td>
        </tr>
        <tr>
          <td className="pb-2">
            <table className="border-collapse text-[12px]" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td className="pr-4 align-middle">
                    <OrkutMenuIcon src={ORKUT_MENU_ICONS.recados} />
                    <a className="text-[#003399] hover:underline" href="#">
                      recados
                    </a>{" "}
                    <span className="font-bold">(114)</span>
                  </td>
                  <td className="pr-4 align-middle">
                    <OrkutMenuIcon src={ORKUT_MENU_ICONS.fotos} />
                    <a className="text-[#003399] hover:underline" href="#">
                      fotos
                    </a>{" "}
                    <span className="font-bold">(0)</span>
                  </td>
                  <td className="pr-4 align-middle">
                    <OrkutMenuIcon src={ORKUT_MENU_ICONS.videos} />
                    <a className="text-[#003399] hover:underline" href="#">
                      vídeos
                    </a>{" "}
                    <span className="font-bold">(5)</span>
                  </td>
                  <td className="align-middle">
                    <OrkutMenuIcon src={ORKUT_MENU_ICONS.fans} />
                    <a className="text-[#003399] hover:underline" href="#">
                      fãs
                    </a>{" "}
                    <span className="font-bold">(15)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td className="pb-2">
            <table className="border-collapse text-[11px]" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td className="pr-6 align-middle">
                    <span className="text-gray-600">confiável</span>
                    <span className="ml-1 inline-flex items-center gap-px align-middle">
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#e8f5e9]" />
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#e8f5e9]" />
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#e8f5e9]" />
                    </span>
                  </td>
                  <td className="pr-6 align-middle">
                    <span className="text-gray-600">legal</span>
                    <span className="ml-1 inline-flex items-center gap-px align-middle">
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#e3f2fd]" />
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#e3f2fd]" />
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#e3f2fd]" />
                    </span>
                  </td>
                  <td className="align-middle">
                    <span className="text-gray-600">sexy</span>
                    <span className="ml-1 inline-flex items-center gap-px align-middle">
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#fce4ec]" />
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#fce4ec]" />
                      <span className="inline-block h-4 w-4 rounded-sm border border-[#bcd2e8] bg-[#fce4ec]" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td className="pb-0">
            <div className="inline-block rounded-t border border-b-0 border-[#bcd2e8] bg-[#e8f2fa] px-3 py-0.5 text-[11px] font-bold text-[#336699]">
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

function OrkutRightSidebar() {
  return (
    <table className="w-full border-collapse text-[11px]" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td className="pb-2">
            <a href="#" className="text-[13px] font-bold text-[#003399] hover:underline">
              amigos (51)
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <table className="w-full border-collapse text-center" cellPadding={0} cellSpacing={0}>
              <tbody>
                {[0, 1, 2].map((row) => (
                  <tr key={row}>
                    {FRIENDS.slice(row * 3, row * 3 + 3).map((f) => (
                      <td key={f.name} className="align-top" style={{ width: "33%" }}>
                        <img
                          src={`https://picsum.photos/seed/${f.seed}/48/48`}
                          alt=""
                          width={48}
                          height={48}
                          className="mx-auto border border-[#bcd2e8]"
                        />
                        <div className="mt-1 leading-tight">
                          <a href="#" className="text-[#003399] hover:underline">
                            {f.name}
                          </a>{" "}
                          <span className="text-gray-600">({f.count})</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-right">
              <a href="#" className="text-[#003399] hover:underline">
                ver todos
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td className="h-4" />
        </tr>
        <tr>
          <td className="pb-2 pt-2">
            <a href="#" className="text-[13px] font-bold text-[#003399] hover:underline">
              comunidades (313)
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <table className="w-full border-collapse text-center" cellPadding={0} cellSpacing={0}>
              <tbody>
                {[0, 1, 2].map((row) => (
                  <tr key={row}>
                    {COMMUNITIES.slice(row * 3, row * 3 + 3).map((c) => (
                      <td key={c.name} className="align-top" style={{ width: "33%" }}>
                        <img
                          src={`https://picsum.photos/seed/comm-${c.seed}/48/48`}
                          alt=""
                          width={48}
                          height={48}
                          className="mx-auto border border-[#bcd2e8]"
                        />
                        <div className="mt-1 leading-tight">
                          <a href="#" className="text-[#003399] hover:underline">
                            {c.name}
                          </a>
                        </div>
                      </td>
                    ))}
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

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const displayName = displayNameFromUsername(username);
  const email = `${emailLocalFromUsername(username)}@gmail.com`;

  return (
    <div
      className="min-h-screen w-full bg-[#d4e0ef] text-[13px]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <OrkutHeader email={email} />

      <div className="orkut-shell">
        <div className="orkut-three-col">
          <div className="orkut-col-left rounded-sm border border-[#bcd2e8] bg-white p-2 shadow-sm">
            <OrkutLeftSidebar displayName={displayName} />
          </div>
          <div className="orkut-col-main rounded-sm border border-[#bcd2e8] bg-white px-3 py-2 shadow-sm">
            <OrkutMainColumn displayName={displayName} />
          </div>
          <div className="orkut-col-right rounded-sm border border-[#bcd2e8] bg-white p-2 shadow-sm">
            <OrkutRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
