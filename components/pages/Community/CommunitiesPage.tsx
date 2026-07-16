"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UniversalSearch } from "@/components/ui/Search/UniversalSearch";
import { BigAccentShell } from "@/components/ui/boxes/BigAccentShell";
import { getMyCommunities } from "@/lib/profile-service";
import type { MyCommunityCard } from "@/lib/profile-types";

/* =========================================================
   Landing "Comunidades" — conteúdo principal da rota /Communities.
   Renderizado à direita da barra lateral do perfil (float de 143px),
   por isso a margem esquerda de 153px que o clareia — mesmo padrão da
   página de comunidade. Duas colunas lado a lado: painel de boas-vindas
   (~63%) e painel de busca + categorias (~34%).
   Quando o usuário já participa de comunidades, o painel da esquerda
   troca o texto de boas-vindas pela aba "minhas comunidades" + filtro +
   tabela (nome / última postagem / membros).
   ========================================================= */

// Categorias exatamente na ordem do orkut clássico.
const CATEGORIES = [
  "Alunos e Escolas",
  "Animais: de estimação ou não",
  "Artes e Entretenimento",
  "Atividades",
  "Automotivo",
  "Cidades e Bairros",
  "Computadores e Internet",
  "Culinária, Bebidas e Vinhos",
  "Culturas e Comunidade",
  "Empresa",
  "Escolas e Cursos",
  "Esportes e Lazer",
  "Família e Lar",
  "Gays, Lésbicas e Bi",
  "Governo e Política",
  "História e Ciências",
  "Hobbies e Trabalhos Manuais",
  "Jogos",
  "Moda e Beleza",
  "Música",
  "Negócios",
  "Países e Regiões",
  "Pessoas",
  "Religiões e Crenças",
  "Romances e Relacionamentos",
  "Saúde, Bem-estar e Fitness",
  "Viagens",
  "Outros",
];

// Painel de boas-vindas (estado sem comunidades).
function WelcomePanel() {
  return (
    <div className="px-1.5 pb-3">
      <h1 className="orkut-title text-black py-1.75 pb-1.25">Comunidades</h1>

      <p className="text-[11px] leading-4 text-[#7b8ca5] m-0 pt-0.5">
        <Link href="/" className="text-[#7b8ca5]">
          Início
        </Link>
        {" › Comunidades"}
      </p>

      <div className="pt-4 text-[13px] leading-[1.7] text-[#333] max-w-136">
        <p className="m-0">
          Compartilhe suas paixões. Conheça pessoas que têm interesses em comum.
          Troque idéias. Planeje eventos...
        </p>
        <p className="mt-4 mb-0">
          Você pode{" "}
          <Link href="#pesquisa" className="text-orkut-link">
            pesquisar
          </Link>{" "}
          comunidades ou{" "}
          <Link href="/CommunityEdit?mode=create" className="text-orkut-link">
            criar sua própria comunidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

// Filtros da barra "Mostrar:" — casam com o campo `relation` de cada card.
type Filter = "all" | "owner" | "pending";

// Painel "minhas comunidades" (aba + filtro + tabela).
function MyCommunitiesPanel({ communities }: { communities: MyCommunityCard[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const shown = communities.filter((c) =>
    filter === "all"
      ? true
      : filter === "owner"
        ? c.relation === "OWNER"
        : c.relation === "PENDING",
  );

  const FilterLink = ({ value, children }: { value: Filter; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={filter === value ? "font-bold text-black" : "text-orkut-link"}
    >
      {children}
    </button>
  );

  return (
    <div className="px-1.5 pt-1 pb-2">
      {/* Aba, no mesmo estilo de "Minhas atualizações" */}
      <div className="border-b border-orkut-border">
        <button type="button" className="orkut-edit-tab orkut-edit-tab-active">
          minhas comunidades ({communities.length})
        </button>
      </div>

      {/* Filtro */}
      <p className="text-[12px] text-[#5a5a5a] mt-2 mb-2">
        Mostrar: <FilterLink value="all">Todas</FilterLink>,{" "}
        <FilterLink value="owner">Comunidades de que sou dono</FilterLink>,{" "}
        <FilterLink value="pending">Pendentes</FilterLink>
      </p>

      {/* Tabela: nome / última postagem / membros */}
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-orkut-border text-left align-bottom">
            <th className="font-bold text-black pb-1">nome</th>
            <th className="font-bold text-black pb-1 w-28">última postagem</th>
            <th className="font-bold text-black pb-1 w-20">membros</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((c, i) => (
            <tr key={c.id} className={i % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]"}>
              <td>
                <Link href={`/Community/${c.id}`} className="text-orkut-link">
                  {c.name}
                </Link>
              </td>
              <td className="text-[#333]">{c.lastPostLabel}</td>
              <td className="text-[#333]">{c.membersCount.toLocaleString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CommunitiesPage() {
  // null enquanto carrega; array (possivelmente vazio) depois da resposta.
  const [communities, setCommunities] = useState<MyCommunityCard[] | null>(null);

  useEffect(() => {
    getMyCommunities()
      .then(setCommunities)
      .catch((e) => {
        console.error("Falha ao carregar minhas comunidades:", e);
        setCommunities([]);
      });
  }, []);

  return (
    <div className="ml-38.25">
      <div className="flex flex-col md:flex-row md:items-start gap-3.5">
        {/* ══════════ Coluna esquerda (~63%) ══════════ */}
        <BigAccentShell className="md:basis-[63%] md:grow">
          {communities === null ? (
            <p className="px-1.5 py-3 text-[12px] text-[#7b8ca5]">
              carregando comunidades...
            </p>
          ) : communities.length > 0 ? (
            <MyCommunitiesPanel communities={communities} />
          ) : (
            <WelcomePanel />
          )}
        </BigAccentShell>

        {/* ══════════ Busca + Categorias (~34%) ══════════ */}
        <aside
          id="pesquisa"
          className="md:basis-[34%] md:shrink-0 border border-orkut-border bg-white rounded-md p-4"
        >
          <h2 className="orkut-subtitle lowercase">todas as comunidades</h2>

          {/* Pesquisa por nome — UniversalSearch navega para /pesquisar já com
              type=community, deixando somente a aba "comunidades" ativa. */}
          <p className="text-[12px] font-bold text-[#555] mb-1">Pesquisar por nome:</p>
          <UniversalSearch variant="inline" preserve={{ type: "community" }} />

          {/* Categorias — a lista fica dentro de uma caixa azul-clara */}
          <p className="text-[13px] font-bold text-[#555] mt-5 mb-1.5">
            Procurar categorias:
          </p>
          <div className="bg-orkut-panel border border-orkut-border rounded-sm p-2">
            <ul className="m-0 p-0 list-none">
              {CATEGORIES.map((c) => (
                <li key={c} className="leading-[1.45]">
                  <a href="#" className="text-[12px] text-orkut-link">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Criar comunidade */}
          <div className="mt-4">
            <Link href="/CommunityEdit?mode=create" className="orkut-btn-pill">
              criar
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
