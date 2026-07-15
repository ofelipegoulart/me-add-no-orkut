import type { MembersTab } from "@/components/pages/Community/types";

const TABS: { value: MembersTab; label: string }[] = [
  { value: "members", label: "membros" },
  { value: "friends", label: "amigos na comunidade" },
  { value: "moderators", label: "moderadores" },
  { value: "owners", label: "co-proprietários" },
  { value: "pending", label: "membros pendentes" },
];

// Mesmo visual das abas de ProfileInfoTabs (branco inativo / azul #627AAD
// ativo) — é o padrão de aba usado no resto do projeto.
function tabClassName(isActive: boolean) {
  const base =
    "relative mb-[-1px] mr-0.5 inline-block cursor-pointer rounded-t-[5px] border border-[#9eb6d8] border-b-0 px-[5px] py-0.5 text-[14px] font-bold tracking-tight no-underline outline-none";
  return isActive
    ? `${base} z-1 border-[#627AAD] border-b-[#627AAD] bg-[#627AAD] text-white`
    : `${base} bg-white text-orkut-link-dark hover:bg-[#f0f4fa]`;
}

export function CommunityMembersTabs({
  active,
  showPending,
  onChange,
}: {
  active: MembersTab;
  showPending: boolean;
  onChange: (tab: MembersTab) => void;
}) {
  const tabs = TABS.filter((t) => t.value !== "pending" || showPending);

  return (
    <div className="mb-0 border-b border-[#ccc] pl-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={tabClassName(active === tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
