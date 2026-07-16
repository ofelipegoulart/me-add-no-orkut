import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { BigAccentShell } from "@/components/ui/boxes/BigAccentShell";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import { BigSoftSection } from "@/components/ui/boxes/BigSoftSection";
import { BigSoftCard } from "@/components/ui/boxes/BigSoftCard";
import { SmallSoftCard } from "@/components/ui/boxes/SmallSoftCard";
import { CommunityHeaderBlock } from "@/components/pages/Community/CommunityHeaderBlock";
import { OrganizeFriendsGroups } from "@/components/pages/Social/OrganizeFriendsGroups";

// ── Cores: tokens definidos em src/app/globals.css (:root + @theme) ──
const COLORS: { label: string; className: string; hex: string }[] = [
  { label: "--orkut-bg", className: "bg-orkut-bg", hex: "#d9e6f7" },
  { label: "--orkut-box-white", className: "bg-orkut-box-white", hex: "#ffffff" },
  { label: "--orkut-border", className: "bg-orkut-border", hex: "#c9d7f1" },
  { label: "--orkut-header-blue", className: "bg-orkut-header-blue", hex: "#bfd4f2" },
  { label: "--orkut-tab-inactive", className: "bg-orkut-tab-inactive", hex: "#e8eefa" },
  { label: "--orkut-link-dark", className: "bg-orkut-link-dark", hex: "#4b66a1" },
  { label: "--orkut-accent-pink", className: "bg-orkut-accent-pink", hex: "#ff0084" },
  { label: "--orkut-link", className: "bg-orkut-link", hex: "#02679c" },
  { label: "--orkut-nav-inactive", className: "bg-orkut-nav-inactive", hex: "#7091bd" },
  { label: "--orkut-panel", className: "bg-orkut-panel", hex: "#eff7ff" },
  { label: "--orkut-panel-alt", className: "bg-orkut-panel-alt", hex: "#ddeeff" },
  { label: "--orkut-box-border", className: "bg-orkut-box-border", hex: "#7791bc" },
  { label: "--orkut-link-bright", className: "bg-orkut-link-bright", hex: "#3333ff" },
  { label: "--orkut-notice", className: "bg-orkut-notice", hex: "#fcfdde" },
  { label: "--orkut-notice-border", className: "bg-orkut-notice-border", hex: "#dddddd" },
];

function ColorSwatch({ label, className, hex }: { label: string; className: string; hex: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-9 w-9 shrink-0 rounded border border-orkut-border ${className}`} />
      <div className="min-w-0">
        <div className="truncate font-mono text-[11px] text-black">{label}</div>
        <div className="truncate font-mono text-[10px] text-[#7b7b7b]">
          {hex} · {className}
        </div>
      </div>
    </div>
  );
}

function TypeSample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-orkut-border py-2 last:border-b-0">
      <div className="mb-1 font-mono text-[11px] text-[#7b7b7b]">{label}</div>
      {children}
    </div>
  );
}

// ── Catálogo de componentes, agrupado por FORMA (canto) antes do conteúdo ──
function Block({
  name,
  path,
  usedIn,
  contextNote,
  children,
}: {
  name: string;
  path: string;
  usedIn: string[];
  contextNote: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-1 flex flex-wrap items-baseline gap-2">
        <span className="inline-block rounded bg-black px-2 py-0.5 font-mono text-[11px] text-white">
          {name}
        </span>
        <span className="font-mono text-[11px] text-[#7b7b7b]">{path}</span>
      </div>
      <div className="mb-2 text-[11px] text-[#7b7b7b]">
        usado em: {usedIn.join(", ")} · {contextNote}
      </div>
      {/* orkut-three-col contém floats (clearfix) — sem isso, blocos que usam
          orkut-col-left/main/right (float) colapsam a altura do pai e o
          próximo bloco sobe por cima. */}
      <div className="orkut-three-col">{children}</div>
    </section>
  );
}

function ShapeGroup({
  title,
  radiusNote,
  children,
}: {
  title: string;
  radiusNote: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h3 className="mb-0.5 text-base font-bold text-black">{title}</h3>
      <p className="mb-4 font-mono text-[11px] text-[#7b7b7b]">{radiusNote}</p>
      {children}
    </div>
  );
}

function Placeholder({ lines = 2 }: { lines?: number }) {
  return (
    <div className="p-2 text-[12px] text-[#5a5a5a]">
      {Array.from({ length: lines }).map((_, i) => (
        <p key={i}>conteúdo de exemplo — linha {i + 1}</p>
      ))}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="orkut-shell">
      <h1 className="mb-1 text-2xl font-bold text-black">/design-system</h1>
      <p className="mb-8 text-[12px] text-[#5a5a5a]">
        Catálogo visual dos tokens e blocos reutilizáveis do projeto. Os componentes de
        &quot;caixa&quot; são nomeados primeiro pela <strong>forma</strong> (tamanho + estilo de
        canto) e só depois pelo conteúdo — ex.: <code>BigSoftCard</code> é grande e de canto
        suave, <code>SmallSoftCard</code> é pequeno e de canto suave. Os <code>Sidebar*</code>{" "}
        continuam nomeados pela posição na página, não pela forma.
      </p>

      {/* ══════════ Cores ══════════ */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold text-black">Cores</h2>
        <p className="mb-3 text-[12px] text-[#5a5a5a]">
          Tokens definidos em <code>:root</code> e mapeados em <code>@theme</code> (globals.css).
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          {COLORS.map((c) => (
            <ColorSwatch key={c.label} {...c} />
          ))}
        </div>
      </section>

      {/* ══════════ Títulos / tipografia ══════════ */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold text-black">Títulos</h2>
        <p className="mb-3 text-[12px] text-[#5a5a5a]">
          Classes de texto/título definidas em globals.css, na ordem da hierarquia:{" "}
          <code>orkut-title</code> (padrão de página, mesma formatação do h1 da comunidade — a
          mais fiel ao Orkut original) → <code>orkut-subtitle</code> (nível abaixo, usado dentro
          de cards) → <code>orkut-breadcrumb</code>/<code>orkut-uname</code> (texto auxiliar).
        </p>
        <div className="max-w-140 border border-orkut-border bg-white px-3">
          <TypeSample label=".orkut-title (24px / Tahoma / normal) — padrão de página">
            <h2 className="orkut-title">Título de página</h2>
          </TypeSample>
          <TypeSample label=".orkut-subtitle (15px / bold) — um nível abaixo de .orkut-title">
            <h2 className="orkut-subtitle">membros (12)</h2>
          </TypeSample>
          <TypeSample label=".orkut-search-title (20px / cor #4a68a0)">
            <h1 className="orkut-search-title">Resultados de pesquisa para termo</h1>
          </TypeSample>
          <TypeSample label=".orkut-breadcrumb (11px / cor #7b8ca5)">
            <p className="orkut-breadcrumb">
              <a href="#">Início</a>
              <span className="orkut-breadcrumb-sep">&gt;</span>
              Página atual
            </p>
          </TypeSample>
          <TypeSample label=".orkut-uname (11px) — sem text-align embutido; quem centraliza é o chamador (text-center)">
            <div className="orkut-uname text-center">Nome do Usuário</div>
          </TypeSample>
          <TypeSample label="texto padrão do body (12px Tahoma/Arial)">
            <p>Texto corrido padrão usado em parágrafos, células de tabela etc.</p>
          </TypeSample>
        </div>
      </section>

      {/* ══════════ Anatomia de uma página ══════════
          Mesmas classes (orkut-col-left/main/right) e componentes usados de
          verdade — em miniatura, lado a lado, nas proporções reais. */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold text-black">Anatomia de uma página</h2>
        <p className="mb-3 text-[12px] text-[#5a5a5a]">
          Mesma estrutura de Home/Profile: <code>.orkut-col-left</code> (143px, <code>SidebarLeftBox</code>
          {" "}— canto quase reto) + <code>.orkut-col-main</code> (fluido, <code>BigAccentShell</code> — canto
          acentuado) + <code>.orkut-col-right</code> (240px, <code>SidebarSocialBox</code> — canto acentuado
          em escala menor).
        </p>
        <div className="orkut-three-col">
          <SidebarLeftBox>
            <Placeholder lines={3} />
          </SidebarLeftBox>
          <div className="orkut-col-main flex flex-col gap-1.25">
            <BigAccentShell>
              <Placeholder lines={4} />
            </BigAccentShell>
          </div>
          <div className="orkut-col-right">
            <SidebarSocialBox>
              <Placeholder />
            </SidebarSocialBox>
            <SidebarSocialBox>
              <Placeholder />
            </SidebarSocialBox>
          </div>
        </div>
      </section>

      {/* ══════════ Blocos, agrupados por forma ══════════ */}
      <h2 className="mb-1 text-lg font-bold text-black">Blocos</h2>
      <p className="mb-6 text-[12px] text-[#5a5a5a]">
        Agrupados pelo estilo de canto (a característica mais fácil de lembrar de bater o olho),
        depois pelo tamanho real de uso.
      </p>

      <ShapeGroup title="Accent — canto superior direito bem puxado" radiusNote="border-radius: 4px 48px 4px 4px">
        <Block
          name="BigAccentShell"
          path="components/ui/boxes/BigAccentShell.tsx"
          usedIn={["MyProfilePage", "UserProfilePage", "CommunitiesPage", "CommunityInfoCard", "CommunityMembersPage"]}
          contextNote="grande · dentro de .orkut-col-main"
        >
          <div className="orkut-col-main">
            <BigAccentShell>
              <Placeholder />
            </BigAccentShell>
          </div>
        </Block>
      </ShapeGroup>

      <ShapeGroup title="Sharp — sem arredondamento" radiusNote="border-radius: 0 (herdado de .orkut-col-main, sem raio)">
        <Block
          name="BigSharpShell"
          path="components/ui/boxes/BigSharpShell.tsx"
          usedIn={["Profile/[id]/fotos", "Profile/[id]/amigos", "Profile/[id]/comunidades"]}
          contextNote="grande · já inclui .orkut-col-main, não precisa de wrapper"
        >
          <BigSharpShell title="Título da página" breadcrumbLabel="Sub-página">
            <Placeholder />
          </BigSharpShell>
        </Block>
      </ShapeGroup>

      <ShapeGroup title="Soft — arredondamento suave e uniforme" radiusNote="border-radius: 6px a 8px, igual nos 4 cantos">
        <Block
          name="BigSoftShell"
          path="components/ui/boxes/BigSoftShell.tsx"
          usedIn={["CommunityEdit", "Home/Testimonials"]}
          contextNote="grande · já inclui .orkut-col-full (~85% do shell), radius 8px"
        >
          <BigSoftShell>
            <Placeholder />
          </BigSoftShell>
        </Block>

        <Block
          name="BigSoftSection"
          path="components/ui/boxes/BigSoftSection.tsx"
          usedIn={["MyProfilePage (atualizações)", "TestimonialsSection", "RecentMediaSection", "ReceivedTestimonialsPreview", "PendingTestimonials"]}
          contextNote="grande · dentro de .orkut-col-main, radius 8px"
        >
          <div className="orkut-col-main">
            <BigSoftSection title="título da seção" icon seeAllHref="#" seeAllLabel="ver todos »">
              <Placeholder />
            </BigSoftSection>
          </div>
        </Block>

        <Block
          name="BigSoftCard"
          path="components/ui/boxes/BigSoftCard.tsx"
          usedIn={["friend-requests-card", "FriendAddForm"]}
          contextNote="grande · renderizado na coluna principal, radius 8px (rounded-lg)"
        >
          <div className="orkut-col-main">
            <BigSoftCard title="Título do card">
              <Placeholder />
            </BigSoftCard>
          </div>
        </Block>

        <Block
          name="SmallSoftCard"
          path="components/ui/boxes/SmallSoftCard.tsx"
          usedIn={["CommunityRightColumn (membros)", "CommunityRightColumn (relacionadas)", "CommunityForumBox", "CommunityJoinConfirmCard", "CommunityJoinRequestSentCard"]}
          contextNote="pequeno · coluna direita da comunidade (float-right, 284px), radius 6px"
        >
          <div className="float-right w-71">
            <SmallSoftCard className="mb-2 px-3 py-3">
              <Placeholder />
            </SmallSoftCard>
          </div>
        </Block>
      </ShapeGroup>

      {/* ══════════ Conteúdo sem forma própria ══════════
          Não têm borda/fundo — sempre moram dentro de outro bloco acima. */}
      <div className="mb-10">
        <h3 className="mb-0.5 text-base font-bold text-black">Sem forma própria</h3>
        <p className="mb-4 font-mono text-[11px] text-[#7b7b7b]">
          sem border/bg/radius — sempre nested dentro de um bloco acima
        </p>

        <Block
          name="CommunityHeaderBlock"
          path="components/pages/Community/CommunityHeaderBlock.tsx"
          usedIn={["CommunityInfoCard", "CommunityMembersPage"]}
          contextNote="mora dentro de BigAccentShell"
        >
          <div className="orkut-col-main">
            <div className="border border-orkut-border bg-white">
              <CommunityHeaderBlock
                title="Nome da comunidade"
                breadcrumb={<span>Início › Comunidades › Categoria</span>}
              />
            </div>
          </div>
        </Block>

        <Block
          name="OrganizeFriendsGroups"
          path="components/pages/Social/OrganizeFriendsGroups.tsx"
          usedIn={["friend-requests-card", "FriendAddForm"]}
          contextNote="mora dentro do painel azul do BigSoftCard"
        >
          <div className="orkut-col-main">
            <div className="border border-orkut-border bg-white p-3">
              <OrganizeFriendsGroups defaultOpen />
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}
