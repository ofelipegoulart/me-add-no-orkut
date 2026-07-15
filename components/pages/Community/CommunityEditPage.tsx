"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import {
  getCommunityCategories,
  uploadCommunityIcon,
  createCommunity,
  updateCommunity,
} from "@/lib/profile-service";
import type { CommunityCategoryOption, CommunityInfo } from "@/lib/profile-types";

/* =========================================================
   Formulário de criar / editar comunidade — reconstrução do
   antigo CommunityEdit.aspx. O modo ("create" | "edit") vem do
   query param `mode` da rota (?mode=create[&id=...]), lido no
   server e repassado como prop; no modo edição o server também
   busca a comunidade (`initial`) para pré-preencher o form. No
   clássico a mesma tela servia os dois fluxos; mantemos isso: só
   muda o título, o rótulo do botão e o payload (POST vs. PUT).
   ========================================================= */

type Mode = "create" | "edit";

// Limite de caracteres da descrição no backend (rejeita HTML acima disso).
const DESC_MAX = 5000;

const IDIOMAS = [
  "Português",
  "English (US)",
  "Español",
  "Français",
  "Deutsch",
  "Italiano",
  "日本語",
];

// Par de rádios "Ativar / Desativar" reutilizado nas configurações
// de recursos. `value` = true ⇒ Ativar.
function AtivarDesativar({
  name,
  value,
  onChange,
}: {
  name: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <span className="orkut-radio-group">
      <label className="orkut-radio-label">
        <input type="radio" name={name} checked={value} onChange={() => onChange(true)} />
        Ativar
      </label>
      <label className="orkut-radio-label">
        <input type="radio" name={name} checked={!value} onChange={() => onChange(false)} />
        Desativar
      </label>
    </span>
  );
}

// Bloco de um recurso dentro da sanfona (título + rádios + filhos).
function FeatureBlock({
  title,
  name,
  enabled,
  onEnabledChange,
  children,
  info,
}: {
  title: string;
  name: string;
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  children?: React.ReactNode;
  info?: string;
}) {
  return (
    <div className="border-b border-orkut-border py-2 last:border-b-0">
      <div className="flex items-baseline gap-3">
        <span className="w-24 text-right text-[12px] text-[#676767]">{title}:</span>
        <AtivarDesativar name={name} value={enabled} onChange={onEnabledChange} />
      </div>
      {(children || info) && (
        <div className="ml-[108px] mt-1">
          {children}
          {info && <p className="mt-1 text-[11px] text-[#7b7b7b] m-0">{info}</p>}
        </div>
      )}
    </div>
  );
}

export default function CommunityEditPage({
  mode = "create",
  communityId,
  initial,
}: {
  mode?: Mode;
  /** Id da comunidade sendo editada (obrigatório quando mode === "edit"). */
  communityId?: string;
  /** Dados atuais da comunidade, usados para pré-preencher o formulário no modo edição. */
  initial?: CommunityInfo;
}) {
  // ── Seção principal ──
  const [nome, setNome] = useState(initial?.name ?? "");
  const [categoria, setCategoria] = useState(initial?.category ?? "");
  const [tipo, setTipo] = useState<"publica" | "moderada">(
    initial?.type === "MODERATED" ? "moderada" : "publica",
  );
  const [privacidade, setPrivacidade] = useState<"aberta" | "oculta">(
    initial?.contentPrivacy === "RESTRICTED" ? "oculta" : "aberta",
  );
  const [idioma, setIdioma] = useState(initial?.language || "Português");
  const [cidade, setCidade] = useState(initial?.location?.city ?? "");
  const [estado, setEstado] = useState(initial?.location?.state ?? "");
  const [cep, setCep] = useState(initial?.location?.zipCode ?? "");
  const [pais, setPais] = useState(initial?.location?.country || "Brasil");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [descricao, setDescricao] = useState(initial?.description ?? "");

  // ── Configurações de recursos (sanfona) ──
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [forum, setForum] = useState(initial?.features?.forumEnabled ?? true);
  const [forumHome, setForumHome] = useState(initial?.features?.forumOnHomepage ?? true);
  const [forumNoAnon, setForumNoAnon] = useState(initial?.features?.forumNoAnonymousPosts ?? true);
  const [enquetes, setEnquetes] = useState(initial?.features?.pollsEnabled ?? true);
  const [enquetesHome, setEnquetesHome] = useState(initial?.features?.pollsOnHomepage ?? true);
  const [eventos, setEventos] = useState(initial?.features?.eventsEnabled ?? true);
  const [eventosHome, setEventosHome] = useState(initial?.features?.eventsOnHomepage ?? false);
  const [noticias, setNoticias] = useState(initial?.features?.customNewsEnabled ?? false);

  // ── Categorias (dropdown alimentado pelo backend) e estado do envio ──
  const [categorias, setCategorias] = useState<CommunityCategoryOption[]>([]);
  const [catStatus, setCatStatus] = useState<"loading" | "ok" | "error">("loading");
  const [catErrorMsg, setCatErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    getCommunityCategories()
      .then((list) => {
        setCategorias(list);
        setCatStatus("ok");
      })
      .catch((e) => {
        // Não engolir em silêncio: sem isso, uma falha do backend vira um
        // dropdown vazio sem pista nenhuma. Loga e mostra o status na tela.
        console.error("Falha ao carregar categorias da comunidade:", e);
        setCatErrorMsg(e instanceof Error ? e.message : String(e));
        setCatStatus("error");
      });
  }, []);

  const titulo = mode === "create" ? "Criar Comunidade" : "Editar Comunidade";
  const botaoLabel = mode === "create" ? "criar" : "atualizar";

  async function handleSubmit() {
    setError("");

    if (!nome.trim()) {
      setError("Digite o nome da comunidade.");
      return;
    }
    if (!categoria) {
      setError("Escolha uma categoria.");
      return;
    }

    setSaving(true);
    try {
      // 1) sobe a imagem (se houver) e usa a URL devolvida em `icon`; sem
      // upload novo, mantém o ícone atual (relevante na edição).
      let icon = initial?.icon ?? undefined;
      if (iconFile) {
        icon = (await uploadCommunityIcon(iconFile)).url;
      }

      const payload = {
        name: nome.trim(),
        category: categoria,
        type: tipo === "publica" ? ("PUBLIC" as const) : ("MODERATED" as const),
        contentPrivacy:
          privacidade === "aberta"
            ? ("OPEN_TO_NON_MEMBERS" as const)
            : ("RESTRICTED" as const),
        language: idioma,
        location: { city: cidade, state: estado, zipCode: cep, country: pais },
        icon,
        description: descricao,
        features: {
          forumEnabled: forum,
          forumOnHomepage: forumHome,
          forumNoAnonymousPosts: forumNoAnon,
          pollsEnabled: enquetes,
          pollsOnHomepage: enquetesHome,
          eventsEnabled: eventos,
          eventsOnHomepage: eventosHome,
          customNewsEnabled: noticias,
        },
      };

      // 2) cria ou atualiza a comunidade com o payload completo do formulário.
      const community =
        mode === "edit" && communityId
          ? await updateCommunity(communityId, payload)
          : await createCommunity(payload);

      // 3) leva para a página da comunidade (nova ou já existente).
      router.push(`/Community/${community.id}`);
    } catch {
      setError(
        mode === "edit"
          ? "Não foi possível atualizar a comunidade. Tente novamente."
          : "Não foi possível criar a comunidade. Tente novamente.",
      );
      setSaving(false);
    }
  }

  return (
    <div className="orkut-edit-page">
      <h2 className="orkut-edit-title">{titulo}</h2>
      <p className="orkut-edit-breadcrumb">
        <Link href="/">Início</Link>
        <span className="orkut-breadcrumb-sep">&gt;</span>
        <Link href="/Communities">Comunidades</Link>
        <span className="orkut-breadcrumb-sep">&gt;</span>
        {titulo}
      </p>

      <div className="orkut-edit-body">
        <table className="orkut-edit-table" cellPadding={0} cellSpacing={0}>
          <colgroup>
            <col className="orkut-edit-col-label" />
            <col />
          </colgroup>
          <tbody>
            {/* Nome */}
            <tr>
              <td className="orkut-edit-label">Nome:</td>
              <td className="orkut-edit-field">
                <input
                  type="text"
                  className="orkut-input"
                  placeholder="Digite o nome da comunidade"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </td>
            </tr>

            {/* Categoria */}
            <tr>
              <td className="orkut-edit-label">Categoria:</td>
              <td className="orkut-edit-field">
                <select
                  className="orkut-select"
                  value={categoria}
                  disabled={catStatus !== "ok"}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">
                    {catStatus === "loading"
                      ? "carregando..."
                      : catStatus === "error"
                        ? "falha ao carregar"
                        : "selecione"}
                  </option>
                  {categorias.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {catStatus === "error" && (
                  <div className="mt-0.5 text-[11px] text-red-600">
                    Não foi possível carregar as categorias ({catErrorMsg}).
                  </div>
                )}
              </td>
            </tr>

            {/* Tipo (+ aviso condicional de spam quando pública) */}
            <tr>
              <td className="orkut-edit-label">Tipo:</td>
              <td className="orkut-edit-field">
                <div className="flex flex-col gap-0.5">
                  <label className="orkut-radio-label">
                    <input type="radio" name="tipo" checked={tipo === "publica"} onChange={() => setTipo("publica")} />
                    Pública — qualquer pessoa pode participar
                  </label>
                  <label className="orkut-radio-label">
                    <input type="radio" name="tipo" checked={tipo === "moderada"} onChange={() => setTipo("moderada")} />
                    Moderada — o mediador precisa aprovar pedidos de participação
                  </label>
                </div>
                {tipo === "publica" && (
                  <p className="mt-1 text-[11px] leading-4 text-[#7b7b7b] m-0 max-w-100">
                    Esta comunidade é pública. Para diminuir o volume de spam, desabilitamos o
                    envio de mensagens para esta comunidade. Use o fórum.
                  </p>
                )}
              </td>
            </tr>

            {/* Privacidade do conteúdo */}
            <tr>
              <td className="orkut-edit-label">Privacidade do conteúdo:</td>
              <td className="orkut-edit-field">
                <div className="flex flex-col gap-0.5">
                  <label className="orkut-radio-label">
                    <input type="radio" name="privacidade" checked={privacidade === "aberta"} onChange={() => setPrivacidade("aberta")} />
                    Aberta — qualquer pessoa pode visualizar o conteúdo da comunidade
                  </label>
                  <label className="orkut-radio-label">
                    <input type="radio" name="privacidade" checked={privacidade === "oculta"} onChange={() => setPrivacidade("oculta")} />
                    Oculta — apenas membros podem visualizar o conteúdo da comunidade
                  </label>
                </div>
              </td>
            </tr>

            {/* Idioma */}
            <tr>
              <td className="orkut-edit-label">Idioma:</td>
              <td className="orkut-edit-field">
                <select className="orkut-select" value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                  {IDIOMAS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* Localização */}
            <tr>
              <td className="orkut-edit-label">Cidade:</td>
              <td className="orkut-edit-field">
                <input type="text" className="orkut-input" value={cidade} onChange={(e) => setCidade(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className="orkut-edit-label">Estado:</td>
              <td className="orkut-edit-field">
                <input type="text" className="orkut-input" value={estado} onChange={(e) => setEstado(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className="orkut-edit-label">CEP:</td>
              <td className="orkut-edit-field">
                <input type="text" className="orkut-input orkut-input-sm" value={cep} onChange={(e) => setCep(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className="orkut-edit-label">País:</td>
              <td className="orkut-edit-field">
                <input type="text" className="orkut-input" value={pais} onChange={(e) => setPais(e.target.value)} />
              </td>
            </tr>

            {/* Imagem da comunidade */}
            <tr>
              <td className="orkut-edit-label">Imagem da comunidade:</td>
              <td className="orkut-edit-field">
                <input
                  type="file"
                  accept="image/*"
                  className="text-[11px]"
                  onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
                />
                {iconFile && <span className="ml-1 text-[11px] text-[#7b7b7b]">{iconFile.name}</span>}
              </td>
            </tr>

            {/* Descrição + contador dinâmico */}
            <tr>
              <td className="orkut-edit-label">Descrição:</td>
              <td className="orkut-edit-field">
                <textarea
                  className="orkut-textarea"
                  value={descricao}
                  maxLength={DESC_MAX}
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <p className="mt-0.5 text-[11px] text-[#7b7b7b] m-0">
                  seu texto contém {descricao.length} caracteres
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══════════ Sanfona: configurações de recursos ══════════ */}
        <div className="mx-1 mt-3 border border-orkut-border">
          <button
            type="button"
            onClick={() => setFeaturesOpen((o) => !o)}
            className="flex w-full items-center gap-1.5 bg-orkut-panel px-2 py-1 text-left text-[12px] font-bold text-orkut-link-dark"
          >
            <span className="inline-block w-3 text-center">{featuresOpen ? "−" : "+"}</span>
            Configurações de recursos da comunidade
          </button>

          {featuresOpen && (
            <div className="px-2 py-1 bg-white">
              <FeatureBlock
                title="Fórum"
                name="forum"
                enabled={forum}
                onEnabledChange={setForum}
                info="Mensagens HTML são desativadas em comunidades públicas."
              >
                <label className="orkut-checkbox-label">
                  <input type="checkbox" checked={forumHome} disabled={!forum} onChange={(e) => setForumHome(e.target.checked)} />
                  Exibir na página inicial da comunidade
                </label>
                <label className="orkut-checkbox-label">
                  <input type="checkbox" checked={forumNoAnon} disabled={!forum} onChange={(e) => setForumNoAnon(e.target.checked)} />
                  Não permitir postagens anônimas
                </label>
              </FeatureBlock>

              <FeatureBlock title="Enquetes" name="enquetes" enabled={enquetes} onEnabledChange={setEnquetes}>
                <label className="orkut-checkbox-label">
                  <input type="checkbox" checked={enquetesHome} disabled={!enquetes} onChange={(e) => setEnquetesHome(e.target.checked)} />
                  Exibir na página inicial da comunidade
                </label>
              </FeatureBlock>

              <FeatureBlock title="Eventos" name="eventos" enabled={eventos} onEnabledChange={setEventos}>
                <label className="orkut-checkbox-label">
                  <input type="checkbox" checked={eventosHome} disabled={!eventos} onChange={(e) => setEventosHome(e.target.checked)} />
                  Exibir na página inicial da comunidade
                </label>
              </FeatureBlock>

              <FeatureBlock title="Notícias Personalizadas" name="noticias" enabled={noticias} onEnabledChange={setNoticias} />
            </div>
          )}
        </div>

        {error && (
          <p className="px-2.5 py-2 text-[12px] text-red-600 bg-red-50">{error}</p>
        )}

        <div className="orkut-edit-buttons">
          <OrkutActionButton variant="edit" onClick={handleSubmit} disabled={saving}>
            {saving ? "salvando..." : botaoLabel}
          </OrkutActionButton>{" "}
          <Link href={mode === "edit" && communityId ? `/Community/${communityId}` : "/Communities"}>
            <OrkutActionButton variant="edit" disabled={saving}>cancelar</OrkutActionButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
