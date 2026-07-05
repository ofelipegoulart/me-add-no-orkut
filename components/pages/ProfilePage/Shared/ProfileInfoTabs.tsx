"use client";

import { useState } from "react";

export type ProfileTab = "geral" | "social" | "contato" | "profissional" | "pessoal";

export type ProfileRow = {
  label: string;
  value: string;
};

export type ProfileRowsByTab = Record<ProfileTab, ProfileRow[]>;

const EMPTY_ROWS_BY_TAB: ProfileRowsByTab = {
  geral: [],
  social: [],
  contato: [],
  profissional: [],
  pessoal: [],
};

const TABS: { key: ProfileTab; label: string }[] = [
  { key: "geral", label: "geral" },
  { key: "social", label: "social" },
  { key: "contato", label: "contato" },
  { key: "profissional", label: "profissional" },
  { key: "pessoal", label: "pessoal" },
];

function getTabClassName(isActive: boolean) {
  const baseClassName = [
    "relative mb-[-1px] mr-0.5 inline-block cursor-pointer rounded-t-[5px]",
    "border border-[#9eb6d8] border-b-0 px-[5px] py-0.5",
    "text-[16px] font-bold tracking-[1.25px] no-underline outline-none",
  ].join(" ");

  if (isActive) {
    return [
      baseClassName,
      "z-1 border-[#627AAD] border-b-[#627AAD] bg-[#627AAD] text-white",
    ].join(" ");
  }

  return [
    baseClassName,
    "bg-white text-orkut-link-dark hover:bg-[#f0f4fa]",
  ].join(" ");
}

export function ProfileInfoTabs({ rowsByTab = EMPTY_ROWS_BY_TAB }: { rowsByTab?: ProfileRowsByTab }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("geral");
  const rows = rowsByTab[activeTab];

  return (
    <>
      <div className="mb-0 border-b border-[#ccc] p-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={getTabClassName(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <table
        className="w-full table-fixed border-collapse border border-orkut-border text-[12px] leading-[17px]"
        cellPadding={0}
        cellSpacing={0}
      >
        <colgroup>
          <col className="w-[148px]" />
          <col />
        </colgroup>
        <tbody>
          {rows.length ? (
            rows.map((row, i) => (
              <tr
                key={row.label}
                className={[
                  i % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]",
                  "border-b border-orkut-border last:border-b-0",
                ].join(" ")}
              >
                <td className="box-border whitespace-nowrap px-2 py-0.5 text-right text-[12px] leading-[17px] text-[#676767]">
                  {row.label}
                </td>
                <td className="px-1.5 py-0.5 text-left text-[12px] leading-[17px] text-black">
                  {row.value}
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-b border-orkut-border bg-[#E6F0FA] last:border-b-0">
              <td className="box-border whitespace-nowrap px-2 py-0.5 text-right text-[12px] leading-[17px] text-[#676767]">
                {" "}
              </td>
              <td className="px-1.5 py-0.5 text-left text-[12px] leading-[17px] text-[#676767]">
                nenhuma informação cadastrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
