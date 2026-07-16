import { formatDateShort } from "@/components/pages/Community/format";
import { SmallSoftCard } from "@/components/ui/boxes/SmallSoftCard";
import type { CommunityRole } from "@/components/pages/Community/types";
import type { CommunityTopicBrief } from "@/lib/profile-types";

// Linhas do fórum (compartilhadas pelas duas visões). Sem tópicos, mostra um
// aviso; o autor não vem no resumo do dashboard, então exibimos só título,
// contagem de posts e a data da última mensagem.
function ForumRows({ topics, showTools }: { topics: CommunityTopicBrief[]; showTools: boolean }) {
  if (topics.length === 0) {
    return (
      <tbody>
        <tr className="bg-orkut-panel">
          <td className="px-2 py-1.5 text-[#8a8a8a]">Nenhum tópico ainda.</td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {topics.map((t, i) => (
        <tr key={t.id} className={i % 2 === 0 ? "bg-orkut-panel" : "bg-white"}>
          <td className="px-2 py-1 align-middle">
            <a href="#" className="text-orkut-link">{t.title}</a>
          </td>
          <td className="px-2 py-1 text-right text-[#8a8a8a] whitespace-nowrap">
            {t.totalPosts} {t.totalPosts === 1 ? "post" : "posts"}
            {formatDateShort(t.lastPostDate) && ` · ${formatDateShort(t.lastPostDate)}`}
          </td>
          {showTools && (
            <td className="px-1 py-1 whitespace-nowrap text-right opacity-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/i_tool.png" alt="gerenciar tópico" title="gerenciar tópico" width={14} height={14} className="inline-block mr-1" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/trash.png" alt="remover tópico" title="remover tópico" width={14} height={14} className="inline-block" />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}

export function CommunityForumBox({ topics, role }: { topics: CommunityTopicBrief[]; role: CommunityRole }) {
  return (
    <SmallSoftCard>
      <div className="pt-[7px] pl-3 pr-2 pb-[5px]">
        <h2 className="orkut-subtitle flex items-center gap-1.5">
          fórum
        </h2>
      </div>
      <table className="w-full border-collapse text-[11px]">
        <ForumRows topics={topics} showTools={role === "owner"} />
      </table>
      <div className="orkut-divider" />
      <div className="flow-root p-2">
        <a href="#" className="float-right mt-1 text-[10px] font-bold text-orkut-link underline whitespace-nowrap">ver todos os tópicos »</a>
        {role === "owner" ? (
          <a href="#" className="orkut-btn-pill">novo tópico</a>
        ) : (
          <span className="orkut-btn-pill text-[#aaa] cursor-not-allowed pointer-events-none">novo tópico</span>
        )}
      </div>
    </SmallSoftCard>
  );
}
