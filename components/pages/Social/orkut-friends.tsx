import { OrkutActionButton } from "@/components/buttons/orkut-action-button";

type friends = { id: string; name: string; count: number; seed: string }[]

export default function OrkutFriends({ friends, userId }: { friends: friends; userId: string }) {
    return (
        <div>
            <div>
                <div className="orkut-tahoma text-lg leading-5.25 mt-1.25 mb-1.5 font-bold">
                    <span className="text-black">meus amigos </span>
                    <a href={`/profile/${userId}/amigos`} className="text-orkut-link-blue font-bold">({friends.length})</a>
                </div>

                {friends.length === 0 ? (
                    <div>
                        <div className="bg-orkut-tab-inactive -mx-1.25 px-2 font-thin text-[#5a5a5a] text-[11.5px]">
                            você ainda não adicionou nenhum amigo
                        </div>
                        <div className="border-t border-orkut-border" />
                        <div className="flex justify-end items-center py-1.5 gap-x-0.5">
                            <a href="#" className="text-orkut-link-blue orkut-tahoma font-semibold text-sm underline">
                                encontrar amigos »
                            </a>
                            <a href="#" className="text-orkut-link-blue text-[11px] underline">
                                gerenciar
                            </a>
                        </div>
                        <div className="pb-2">
                            <OrkutActionButton className="orkut-tahoma text-[14px]">
                                adicionar amigos
                            </OrkutActionButton>
                        </div>
                    </div>
                ) : (
                    <div className="-mx-0.75">
                        <table
                            className="w-full text-center border-separate border-spacing-0.75"
                            cellPadding={0}
                            cellSpacing={0}
                        >
                            <tbody>
                                {[0, 1, 2].map((row) => (
                                    <tr key={row}>
                                        {friends.slice(row * 3, row * 3 + 3).map((f: any) => (
                                            <td
                                                key={f.id}
                                                className="align-top w-1/3 bg-orkut-tab-inactive px-3 py-4"
                                            >
                                                <a href={`/profile/${f.id}`}>
                                                    <img
                                                        src={`https://picsum.photos/seed/${f.seed}/48/48`}
                                                        alt=""
                                                        width={48}
                                                        height={48}
                                                        className="mx-auto border border-orkut-border"
                                                    />
                                                </a>
                                                <div className="orkut-uname mt-1">
                                                    <a href={`/profile/${f.id}`}>{f.name}</a>{" "}
                                                    <span className="text-[#8c8c8c]">({f.count})</span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="border-t border-orkut-border pt-1 mt-0.5">
                            <a href={`/profile/${userId}/amigos`} className="underline">ver todos</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
        );
}
