import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";

export default async function FotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-main border border-orkut-border bg-white shadow-sm">
        <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="pb-2 px-2 pt-2">
                <h1
                  className="orkut-edit-title text-black py-1.75 pb-1.25"
                >
                  Fotos
                </h1>
              </td>
            </tr>
            <tr>
              <td className="flex flex-row gap-1 px-2 pb-3">
                <a href="#">Início</a>
                {" > "}
                <span className="text-[#5a5a5a]">Fotos</span>
              </td>
            </tr>
            <tr>
              <td className="px-2 pb-4 text-[12px] text-[#5a5a5a]">
                Nenhuma foto adicionada ainda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="orkut-col-right">
        <div className="border border-orkut-border bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutFriends friends={FRIENDS} userId={id} title="amigos" />
        </div>
        <div className="border border-orkut-border bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutCommunities communities={COMMUNITIES} userId={id} title="comunidades" />
        </div>
      </div>
    </div>
  );
}
