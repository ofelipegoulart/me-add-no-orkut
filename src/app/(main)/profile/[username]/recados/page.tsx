import { FRIENDS, COMMUNITIES, MOCK_RECADOS } from "@/data/mock-data";
import OrkutCommunities from "@/components/Social/orkut-communities";
import OrkutFriends from "@/components/Social/orkut-friends";

export default async function RecadosPage({ params }: any) {
  const { username } = await params;

  return (
    <div className="min-h-screen w-full bg-[#d4e0ef]">
      <div className="orkut-col-main border border-[#bcd2e8] bg-white shadow-sm">
        <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="flex flex-row pb-2 px-2 pt-2">
                <h1
                  className="font-normal text-black py-[7px] pb-[5px]"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "22px", lineHeight: "28px", fontWeight: "normal" }}
                >
                  Minha página de recados ({MOCK_RECADOS.length})
                </h1>
                <div className="text-[12px] ml-auto">
                  <span className="text-[#5a5a5a]">todos podem enviar recados  • </span><a href="#" className="text-[#02679c] underline">alterar configurações</a>
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex flex-row gap-1">
                <a href="#">Início</a>
                {" > "}
                <span className="text-[#5a5a5a]">Minha página de recados</span>
              </td>
            </tr>
            <tr>
              <td className="pb-3 px-2">
                {/* Post Scrap Container */}
                <div className="border-[#ccc] shadow-xl/10 bg-white rounded-xl mb-3 mt-2">
                  <div className="border border-[#bcd2e8] p-3 rounded-xl">
                    <textarea
                      placeholder="digite o texto ou cole HTML (HTML apenas para amigos)"
                      className="w-full h-20 p-2 border border-[#bcd2e8] font-[Tahoma,Verdana,Arial,sans-serif] text-[12px]"
                    />
                    <hr className="mb-2 border-0 border-t border-[#d4e0ef]" />
                    <div className="flex flex-wrap gap-2 mb-0.5 align-middle">
                      <button className="px-3 bg-white text-[#2A73A0]  text-[12px] font-bold border border-[#cccccc] rounded cursor-pointer">
                        enviar recado
                      </button>
                      <button className="px-3 bg-white text-[#2A73A0]  text-[12px] font-bold border border-[#cccccc] rounded cursor-pointer">
                        visualizar
                      </button>
                      <button className="px-3 bg-white text-[#2A73A0]  text-[12px] font-bold border border-[#cccccc] rounded cursor-pointer">
                        adicionar foto
                      </button>
                      <span className="text-[#02679c] underline">dicas de recado</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-b border-[#d4e0ef]">
                  <div className="flex justify-between items-center text-[#5a5a5a] text-[12px]">
                    <div className="flex gap-2">
                      <button className="px-3 bg-white text-[#2A73A0] text-[12px] font-bold border border-[#cccccc] rounded cursor-pointer">
                        excluir recados selecionados
                      </button>
                      <button className="px-3 bg-white text-[#2A73A0] text-[12px] font-bold border border-[#cccccc] rounded cursor-pointer">
                        denunciar spam
                      </button>
                    </div>
                  </div>
                  <div className="text-[#5a5a5a] text-[12px]">
                    <select className="text-[11px] border border-[#bcd2e8] px-1 py-0.5">
                      <option>Ver 10 recados</option>
                      <option>Ver 20 recados</option>
                      <option>Ver 50 recados</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex justify-end items-center text-[#5a5a5a] text-[12px] py-2 border-b border-[#d4e0ef]">
                <div className="flex gap-2">
                  <span>primeira</span>
                  <span className="text-[#ccc]">{"<"} anterior</span>
                  <span className="text-[#02679c] underline">próxima {">"}</span>
                  <span className="text-[#02679c] underline">última</span>
                </div>
              </td>
            </tr>

            {/* Recados list */}
            <tr>
              <td className="px-2 pb-3">
                <div className="space-y-2">
                  {MOCK_RECADOS.map((recado) => (
                    <div key={recado.id} className="border-l-4 border-[#e8a500] bg-[#fef8e8] p-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <input type="checkbox" className="mt-1" />
                        </div>
                        <div className="flex gap-3 flex-grow">
                          <div className="flex-shrink-0">
                            <img
                              src={`https://picsum.photos/seed/${recado.authorSeed}/48/48`}
                              alt=""
                              width={48}
                              height={48}
                              className="border border-[#bcd2e8]"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <a href="#" className="text-[#02679c] font-bold text-[13px]">
                                  {recado.author}:
                                </a>
                              </div>
                              <div className="text-[#999] text-[11px]">
                                {recado.timestamp}
                              </div>
                            </div>
                            <div className="text-[#333] text-[12px] leading-[16px] mt-1">
                              {recado.content}
                            </div>
                            <div className="mt-2 flex gap-4 text-[#02679c] text-[11px]">
                              <a href="#" className="underline">
                                reply
                              </a>
                              <a href="#" className="underline">
                                View this conversation
                              </a>
                              <a href="#" className="text-red-600 underline">
                                delete
                              </a>
                            </div>
                          </div>
                        </div>
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
        <div className="border border-[#bcd2e8] bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutCommunities communities={COMMUNITIES} username={username} />
        </div>
      </div>
    </div>
  );
}
