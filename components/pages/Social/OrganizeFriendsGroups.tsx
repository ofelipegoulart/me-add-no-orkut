"use client";

import { useState } from "react";

export function OrganizeFriendsGroups({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [groupsOpen, setGroupsOpen] = useState(defaultOpen);
  const [groups, setGroups] = useState({
    escola: false,
    familia: false,
    melhores: false,
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => setGroupsOpen((v) => !v)}
        className="flex items-center gap-1 text-[14px] font-normal text-orkut-link-dark cursor-pointer bg-transparent border-0 p-0 tracking-tight"
        aria-expanded={groupsOpen}
      >
        <img
          src={groupsOpen ? "/icons/arr_expanded.gif" : "/icons/arr_collapsed.gif"}
          alt=""
          width={11}
          height={11}
          className="inline-block align-middle"
        />
        organize seus amigos
      </button>
      {groupsOpen && (
        <div className="mt-2 ml-4 flex flex-col gap-1">
          <label className="flex items-center gap-2 text-[12px] font-normal text-black cursor-pointer font-[Arial,Helvetica,sans-serif] tracking-normal">
            <input
              type="checkbox"
              checked={groups.escola}
              onChange={(e) => setGroups((g) => ({ ...g, escola: e.target.checked }))}
            />
            escola
          </label>
          <label className="flex items-center gap-2 text-[12px] font-normal text-black cursor-pointer font-[Arial,Helvetica,sans-serif] tracking-normal">
            <input
              type="checkbox"
              checked={groups.familia}
              onChange={(e) => setGroups((g) => ({ ...g, familia: e.target.checked }))}
            />
            família
          </label>
          <label className="flex items-center gap-2 text-[12px] font-normal text-black cursor-pointer font-[Arial,Helvetica,sans-serif] tracking-normal">
            <input
              type="checkbox"
              checked={groups.melhores}
              onChange={(e) => setGroups((g) => ({ ...g, melhores: e.target.checked }))}
            />
            melhores amigos(as)
          </label>
          <a
            href="#"
            className="text-orkut-link-dark underline text-[12px] font-normal mt-1 tracking-tight"
          >
            gerenciar grupos
          </a>
        </div>
      )}
    </div>
  );
}
