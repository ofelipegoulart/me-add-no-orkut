"use client";

import { useState } from "react";

const TABS = [
  { key: "amigos", label: "Atualizações dos meus amigos" },
  { key: "minhas", label: "Minhas atualizações" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function UpdatesSection() {
  const [activeTab, setActiveTab] = useState<Tab>("amigos");

  return (
    <div>
      <div className="border-b border-orkut-border mt-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeTab === tab.key
                ? "orkut-edit-tab orkut-edit-tab-active"
                : "orkut-edit-tab"
            }
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-orkut-tab-inactive px-2 font-thin text-[#5a5a5a] text-[11.5px] mb-3">
        nenhuma atualização recente
      </div>
    </div>
  );
}
