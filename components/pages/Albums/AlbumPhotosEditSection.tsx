"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { saveAlbumPhotoChanges } from "@/lib/album-service";

type EditablePhoto = {
  id: string;
  src: string;
  caption: string;
};

function AlbumPhotosActionBar({
  saving,
  onSave,
  onCancel,
}: {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="text-[11px] text-orkut-link"
        onClick={onCancel}
        disabled={saving}
      >
        « voltar para o álbum
      </button>
      <OrkutActionButton onClick={onSave} disabled={saving}>
        {saving ? "salvando..." : "salvar alterações"}
      </OrkutActionButton>
      <OrkutActionButton onClick={onCancel} disabled={saving}>
        cancelar
      </OrkutActionButton>
    </div>
  );
}

function AlbumPhotoRow({
  photo,
  isCover,
  isMarkedForDeletion,
  onCaptionChange,
  onSetCover,
  onToggleDelete,
}: {
  photo: EditablePhoto;
  isCover: boolean;
  isMarkedForDeletion: boolean;
  onCaptionChange: (value: string) => void;
  onSetCover: () => void;
  onToggleDelete: () => void;
}) {
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [thumbWidth, thumbHeight] =
    orientation === "portrait" ? [600, 900] : [1200, 800];

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setOrientation(img.naturalHeight > img.naturalWidth ? "portrait" : "landscape");
  }

  return (
    <div className="flex gap-3">
      <a
        href={photo.src}
        target="_blank"
        rel="noopener noreferrer"
        className="orkut-search-card-thumb shrink-0"
        style={{ height: 160, aspectRatio: `${thumbWidth} / ${thumbHeight}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt=""
          width={thumbWidth}
          height={thumbHeight}
          onLoad={handleImageLoad}
          className="block object-cover"
          style={{ width: "100%", height: "100%" }}
        />
      </a>
      <div className="flex w-36 shrink-0 flex-col gap-1 pt-0.5">
        <textarea
          className="orkut-textarea w-36"
          style={{ height: 40 }}
          placeholder="Clique para adicionar uma legenda."
          value={photo.caption}
          onChange={(e) => onCaptionChange(e.target.value)}
        />
        <label className="orkut-radio-label">
          <input
            type="radio"
            name="album-photos-cover"
            checked={isCover}
            onChange={onSetCover}
          />
          capa do álbum
          {isCover && (
            <span className="ml-1 text-[#5a5a5a]">(Capa do álbum atual)</span>
          )}
        </label>
        <label className="orkut-checkbox-label">
          <input
            type="checkbox"
            checked={isMarkedForDeletion}
            onChange={onToggleDelete}
          />
          excluir
        </label>
      </div>
    </div>
  );
}

function AlbumPhotosShareTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 border border-orkut-notice-border bg-orkut-notice px-1.5 py-0.5 text-[11px] text-black">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`remover ${label}`}
        className="text-[#5a5a5a] hover:text-black"
      >
        ✕
      </button>
    </span>
  );
}

function AlbumPhotosShareRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-1.5 text-[11px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={14} height={14} className="mt-0.5 shrink-0" />
      <span className="shrink-0 font-bold text-black">{label}</span>
      <span className="flex flex-1 flex-wrap items-center gap-1">{children}</span>
    </div>
  );
}

function AlbumPhotosSharePanel() {
  const [groupTags, setGroupTags] = useState<string[]>(["todos do orkut"]);

  return (
    <div className="w-48 shrink-0 border border-orkut-box-border bg-orkut-panel p-3">
      <h3 className="m-0 mb-2 text-[13px] font-bold">compartilhar com amigos</h3>

      <p className="mt-3 mb-1.5 text-[11px] font-bold text-black">
        compartilhado atualmente com:
      </p>
      <div className="flex flex-col gap-1.5">
        <AlbumPhotosShareRow icon="/icons/i_friend.gif" label="amigos">
          <span className="text-[#5a5a5a]">nenhum</span>
        </AlbumPhotosShareRow>
        <AlbumPhotosShareRow icon="/icons/i_friendgroup.png" label="grupos">
          {groupTags.length === 0 ? (
            <span className="text-[#5a5a5a]">nenhum</span>
          ) : (
            groupTags.map((tag) => (
              <AlbumPhotosShareTag
                key={tag}
                label={tag}
                onRemove={() =>
                  setGroupTags((prev) => prev.filter((t) => t !== tag))
                }
              />
            ))
          )}
        </AlbumPhotosShareRow>
        <AlbumPhotosShareRow icon="/icons/i_friend.gif" label="contatos">
          <span className="text-[#5a5a5a]">nenhum</span>
        </AlbumPhotosShareRow>
      </div>
    </div>
  );
}

export function AlbumPhotosEditSection({
  albumId,
  homeHref = "/",
  albumListHref = "/",
  albumHref = "/",
  photos: initialPhotos,
  onCancel = () => {},
  onSaved = () => {},
}: {
  albumId: string;
  homeHref?: string;
  albumListHref?: string;
  albumHref?: string;
  photos: EditablePhoto[];
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const [photos, setPhotos] = useState<EditablePhoto[]>(initialPhotos);
  const [coverPhotoId, setCoverPhotoId] = useState(initialPhotos[0]?.id ?? "");
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const initialCaptions = useRef(
    new Map(initialPhotos.map((p) => [p.id, p.caption])),
  ).current;

  function handleCaptionChange(id: string, caption: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  }

  function handleToggleDelete(id: string) {
    setPhotosToDelete((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const captionUpdates = photos
        .filter(
          (p) =>
            !photosToDelete.includes(p.id) &&
            p.caption !== (initialCaptions.get(p.id) ?? ""),
        )
        .map((p) => ({ photoId: p.id, caption: p.caption }));

      await saveAlbumPhotoChanges(albumId, {
        captionUpdates,
        deletions: photosToDelete,
        coverPhotoId:
          coverPhotoId && !photosToDelete.includes(coverPhotoId)
            ? coverPhotoId
            : undefined,
      });
      onSaved();
    } catch (e) {
      console.error("Falha ao salvar fotos do álbum:", e);
      setError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="orkut-col-full">
      <div className="overflow-hidden rounded-md border border-orkut-box-border bg-white">
        <div className="p-3 pb-0">
          <h1 className="orkut-title">
            Editando: Meu álbum (adicionadas recentemente: {photos.length} foto)
          </h1>
          <p className="orkut-breadcrumb">
            <Link href={homeHref}>Início</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            <Link href={albumListHref}>Álbuns</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            <Link href={albumHref}>Meu álbum</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            Editar fotos
          </p>
        </div>

        <div className="bg-orkut-panel m-1.5 p-3">
          <AlbumPhotosActionBar saving={saving} onSave={handleSave} onCancel={onCancel} />

          {error && (
            <p className="mt-1.5 text-[11px] text-red-600">{error}</p>
          )}

          <div className="orkut-divider" style={{ marginTop: 8, marginBottom: 8 }} />
          <div className="flex items-start" style={{ gap: 48 }}>
            <div className="flex flex-1 flex-col gap-3 mb-1.5">
              {photos.map((photo) => (
                <AlbumPhotoRow
                  key={photo.id}
                  photo={photo}
                  isCover={coverPhotoId === photo.id}
                  isMarkedForDeletion={photosToDelete.includes(photo.id)}
                  onCaptionChange={(value) => handleCaptionChange(photo.id, value)}
                  onSetCover={() => setCoverPhotoId(photo.id)}
                  onToggleDelete={() => handleToggleDelete(photo.id)}
                />
              ))}
            </div>

            <AlbumPhotosSharePanel />
          </div>
        </div>
        <div className="orkut-divider" style={{ marginTop: 0, marginBottom: 12 }} />

        <div className="bg-white p-3">
          <AlbumPhotosActionBar saving={saving} onSave={handleSave} onCancel={onCancel} />
        </div>
      </div>
    </div>
  );
}
