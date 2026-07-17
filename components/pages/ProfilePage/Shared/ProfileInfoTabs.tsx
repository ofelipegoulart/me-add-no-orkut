"use client";

import { useMemo, useState } from "react";

import { sanitizeProfileHtml } from "@/lib/sanitize-html";

export type ProfileTab = "geral" | "social" | "contato" | "profissional" | "pessoal";

export type ProfileRow = {
  label: string;
  value: string;
  /** Renders `value` as sanitized HTML instead of plain text. Only set this for fields meant as rich-text bios. */
  allowHtml?: boolean;
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
    "text-[14px] font-bold tracking-tight no-underline outline-none",
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
  const visibleTabs = TABS.filter((tab) => rowsByTab[tab.key].length > 0);
  const [activeTab, setActiveTab] = useState<ProfileTab | null>(visibleTabs[0]?.key ?? null);

  if (!visibleTabs.length) {
    return null;
  }

  const currentTab = visibleTabs.some((tab) => tab.key === activeTab)
    ? (activeTab as ProfileTab)
    : visibleTabs[0].key;
  const rows = rowsByTab[currentTab];

  return (
    <>
      <div className="mb-0 border-b border-[#ccc] p-0">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={getTabClassName(currentTab === tab.key)}
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
          {rows.map((row, i) => (
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
              <td className="px-1.5 py-0.5 text-left text-[12px] leading-[17px] text-black wrap-break-word">
                {row.allowHtml ? <SanitizedHtml value={row.value} /> : row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function SanitizedHtml({ value }: { value: string }) {
  const html = useMemo(() => sanitizeProfileHtml(value), [value]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
