import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { ThumbCardGrid } from "@/components/ui/thumb-card-grid";

type friends = { id: string; name: string; count: number; seed: string }[]

export default function OrkutFriends({ friends, userId }: { friends: friends; userId: string }) {
    return (
        <div>
            <div>
                <div className="orkut-tahoma text-sm leading-5.25 mt-1.25 mb-1.5 font-bold">
                    <span className="text-black">meus amigos </span>
                    <Link href={`/profile/${userId}/amigos`} className="text-orkut-link-blue font-bold">({friends.length})</Link>
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
                    <div>
                        <ThumbCardGrid
                            items={friends.map((f) => ({
                                key: f.id,
                                href: `/profile/${f.id}`,
                                src: `https://picsum.photos/seed/${f.seed}/48/48`,
                                name: f.name,
                                count: f.count,
                            }))}
                        />
                        <div className="border-t border-orkut-border pt-1 mt-0.5">
                            <Link href={`/profile/${userId}/amigos`} className="underline">ver todos</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
        );
}
