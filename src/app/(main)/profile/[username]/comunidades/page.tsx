import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutFriends from "@/components/Social/orkut-friends";

export default async function ComunidadesPage({ params }: any) {
  const { username } = await params;

  return (
    <div className="min-h-screen w-full bg-[#d4e0ef]">
      <div className="orkut-col-main border border-[#bcd2e8] bg-white shadow-sm">
        <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="pb-2 px-2 pt-2">
                <h1
                  className="font-normal text-black py-[7px] pb-[5px]"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "22px", lineHeight: "28px", fontWeight: "normal" }}
                >
                  Comunidades ({COMMUNITIES.length})
                </h1>
              </td>
            </tr>
            <tr>
              <td className="flex flex-row gap-1 px-2 pb-3">
                <a href="#">Início</a>
                {" > "}
                <span className="text-[#5a5a5a]">Comunidades</span>
              </td>
            </tr>
            <tr>
              <td className="px-2 pb-4">
                <div className="grid grid-cols-3 gap-2">
                  {COMMUNITIES.map((c) => (
                    <div key={c.name} className="align-top bg-[#e8edf2] px-3 py-4 text-center">
                      <img
                        src={`https://picsum.photos/seed/comm-${c.seed}/48/48`}
                        alt=""
                        width={48}
                        height={48}
                        className="mx-auto border border-[#bcd2e8]"
                      />
                      <div className="orkut-uname mt-1">
                        <a href="#">{c.name}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="orkut-col-right">
        <div className="border border-[#bcd2e8] bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutFriends friends={FRIENDS} username={username} />
        </div>
      </div>
    </div>
  );
}
