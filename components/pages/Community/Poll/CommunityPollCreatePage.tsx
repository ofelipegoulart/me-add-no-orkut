"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommunityFooter } from "@/components/pages/Community/CommunityFooter";
import { CommunityLeftColumn } from "@/components/pages/Community/CommunityLeftColumn";
import { roleFromRelation } from "@/components/pages/Community/types";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { createPoll, uploadPollImage } from "@/lib/poll-service";
import type { CommunityDashboard } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";
const MAX_OPTIONS = 10;

const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);

function defaultClosesDate() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// Placeholder decorativo — sem upload real, ver .orkut-dashed-upload em
// globals.css. Usado ao lado de cada opção (o backend só aceita 1 imagem
// por enquete inteira, não por opção).
function ImagePlaceholder() {
  return (
    <div className="orkut-dashed-upload shrink-0">
      adicionar imagem
      <br />
      (opcional)
    </div>
  );
}

// Upload real da imagem da enquete — só existe uma vez, ao lado de
// pergunta/descrição. POST /polls/image (multipart) retorna a URL pública,
// que vai junto no POST de criação.
function PollImageUploadBox({
  imageUrl,
  uploading,
  error,
  onSelectFile,
}: {
  imageUrl: string | null;
  uploading: boolean;
  error: string | null;
  onSelectFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="shrink-0 flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="orkut-dashed-upload"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="max-w-full max-h-full object-cover" />
        ) : uploading ? (
          "enviando..."
        ) : (
          <>
            adicionar imagem
            <br />
            (opcional)
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onSelectFile(file);
        }}
      />
      {error && <span className="text-[10px] text-red-600 w-[90px] text-center">{error}</span>}
    </div>
  );
}

// Linha de campo(s): uma caixa tracejada compartilhada + 1+ campos empilhados
// (pergunta e descrição dividem uma única linha/placeholder).
function FieldRow({
  index,
  imageSlot,
  children,
}: {
  index: number;
  imageSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bg = index % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]";
  return (
    <div className={`flex items-start gap-2 p-2 ${bg}`}>
      {imageSlot ?? <ImagePlaceholder />}
      <div className="flex-1 min-w-0 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="orkut-tahoma block text-[12px] font-bold text-black mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function CommunityPollCreatePage({ dashboard }: { dashboard: CommunityDashboard }) {
  const c = dashboard.community;
  const role = roleFromRelation(c.viewerRelation);
  const icon = c.icon || NOPHOTO;
  const pollHref = `/Community/${c.id}/Poll`;
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [closesMode, setClosesMode] = useState<"never" | "custom">("never");
  const [closesHour, setClosesHour] = useState("01:00");
  const [closesDate, setClosesDate] = useState(defaultClosesDate);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function updateOption(i: number, value: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  }

  function addOption() {
    setOptions((prev) => (prev.length >= MAX_OPTIONS ? prev : [...prev, ""]));
  }

  async function handleSelectImage(file: File) {
    setUploadingImage(true);
    setImageError(null);
    try {
      const { url } = await uploadPollImage(c.id, file);
      setImageUrl(url);
    } catch {
      setImageError("Não foi possível enviar a imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  const canSubmit = question.trim() !== "" && options[0]?.trim() !== "" && options[1]?.trim() !== "";

  async function handleCreate() {
    if (!canSubmit) return;
    setCreating(true);
    setCreateError(null);
    try {
      const closesAt =
        closesMode === "custom" ? new Date(`${closesDate}T${closesHour}:00`).toISOString() : null;
      const poll = await createPoll(c.id, {
        question: question.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl ?? undefined,
        options: options.map((o) => o.trim()).filter((o) => o !== ""),
        closesAt,
        anonymous,
        multipleChoice,
      });
      router.push(`${pollHref}/${poll.id}`);
    } catch {
      setCreateError("Não foi possível criar a enquete. Tente novamente.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <CommunityLeftColumn
        role={role}
        icon={icon}
        name={c.name}
        membersCount={c.membersCount}
        editHref={`/CommunityEdit?mode=edit&id=${c.id}`}
        membersHref={`/Community/${c.id}/membros`}
        pollHref={pollHref}
      />

      <BigSharpShell
        title="Nova pesquisa"
        breadcrumbLabel={
          <>
            <Link href="/Communities">Comunidades</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            <Link href={`/Community/${c.id}`}>{c.name}</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            <Link href={pollHref}>Pesquisas</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            Nova pesquisa
          </>
        }
        homeHref="/"
        full
      >
        <p className="text-[12px] text-black px-2 pb-2">
          Depois de criada, não é possível editar uma enquete (mas você pode excluí-la).
        </p>

        <FieldRow
          index={0}
          imageSlot={
            <PollImageUploadBox
              imageUrl={imageUrl}
              uploading={uploadingImage}
              error={imageError}
              onSelectFile={handleSelectImage}
            />
          }
        >
          <Field label="pergunta (obrigatório):">
            <input
              type="text"
              className="orkut-input w-[350px]!"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Field>
          <Field label="descrição (opcional):">
            <textarea
              className="orkut-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </FieldRow>

        {options.map((opt, i) => (
          <FieldRow key={i} index={i + 1}>
            <Field label={i < 2 ? `opção ${i + 1} (obrigatório):` : `opção ${i + 1}:`}>
              <input
                type="text"
                className="orkut-input w-[350px]!"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
            </Field>
          </FieldRow>
        ))}

        <div className="p-2">
          <OrkutActionButton onClick={addOption} disabled={options.length >= MAX_OPTIONS}>
            adicionar opção
          </OrkutActionButton>
        </div>

        <div className="orkut-divider" />

        <div className="p-2">
          <p className="orkut-tahoma text-[12px] font-bold text-black mb-1">Quantas opções podem ser selecionadas?</p>
          <div className="orkut-radio-group orkut-radio-group-column mb-3">
            <label className="orkut-radio-label">
              <input
                type="radio"
                name="multipleChoice"
                checked={!multipleChoice}
                onChange={() => setMultipleChoice(false)}
              />
              Apenas uma
            </label>
            <label className="orkut-radio-label">
              <input
                type="radio"
                name="multipleChoice"
                checked={multipleChoice}
                onChange={() => setMultipleChoice(true)}
              />
              Várias
            </label>
          </div>

          <label className="orkut-checkbox-label mb-3">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Enquete anônima (não mostra em qual opção cada pessoa votou nos comentários)
          </label>

          <p className="orkut-tahoma text-[12px] font-bold text-black mb-1">Quando termina a votação?</p>
          <div className="orkut-radio-group orkut-radio-group-column mb-3">
            <label className="orkut-radio-label">
              <input
                type="radio"
                name="closesMode"
                checked={closesMode === "never"}
                onChange={() => setClosesMode("never")}
              />
              Nunca
            </label>
            <label className="orkut-radio-label">
              <input
                type="radio"
                name="closesMode"
                checked={closesMode === "custom"}
                onChange={() => setClosesMode("custom")}
              />
              <select
                className="orkut-input"
                value={closesHour}
                onChange={(e) => setClosesHour(e.target.value)}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>{" "}
              <input
                type="date"
                className="orkut-input"
                value={closesDate}
                onChange={(e) => setClosesDate(e.target.value)}
              />
            </label>
          </div>

          {createError && <p className="text-[12px] text-red-600 mb-2">{createError}</p>}

          <div className="orkut-divider" style={{marginTop: 8, marginBottom: 8}} />

          <OrkutActionButton onClick={handleCreate} disabled={creating || !canSubmit}>
            Criar enquete
          </OrkutActionButton>
        </div>
      </BigSharpShell>

      <CommunityFooter />
    </div>
  );
}
