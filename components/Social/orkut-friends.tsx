type friends = { name: string; count: number; seed: string }[]

export default function OrkutFriends({ friends }: { friends: friends }) {
    return (
        <div>
            <div>
                <div className="font-[Tahoma,Verdana,Arial,sans-serif] text-[15px] leading-5.25 mt-1.25 mb-1.5 font-bold">
                    <span className="text-black">amigos </span>
                    <a href="#" className="text-[#02679c] font-bold">(51)</a>
                </div>

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
                                            key={f.name}
                                            className="align-top w-1/3 bg-[#e8edf2] px-3 py-4"
                                        >
                                            <img
                                                src={`https://picsum.photos/seed/${f.seed}/48/48`}
                                                alt=""
                                                width={48}
                                                height={48}
                                                className="mx-auto border border-[#bcd2e8]"
                                            />
                                            <div className="orkut-uname mt-1">
                                                <a href="#">{f.name}</a>{" "}
                                                <span className="text-[#8c8c8c]">({f.count})</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="border-t border-[#d4e0ef] pt-1 mt-0.5">
                        <a href="#" className="underline">ver todos</a>
                    </div>
                </div>
            </div>
        </div>
        );
}