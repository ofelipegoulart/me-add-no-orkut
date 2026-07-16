"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { getAlbum, saveAlbumPhotoChanges } from "@/lib/album-service";

type EditablePhoto = {
  id: string;
  src: string;
  caption: string;
};

function AlbumEditActionBar({
  albumHref,
  saving,
  onSave,
  onCancel,
}: {
  albumHref: string;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link href={albumHref} className="text-[11px]">
        « voltar para álbum
      </Link>
      <OrkutActionButton onClick={onSave} disabled={saving}>
        {saving ? "salvando..." : "salvar alterações"}
      </OrkutActionButton>
      <OrkutActionButton onClick={onCancel} disabled={saving}>
        cancelar
      </OrkutActionButton>
    </div>
  );
}

function AlbumEditPhotoRow({
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
  return (
    <div className="flex gap-3 border-b border-orkut-border pb-3 last:border-b-0 last:pb-0">
      <div className="orkut-search-card-thumb shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt=""
          width={120}
          height={90}
          className="block h-[90px] w-[120px] object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-0.5">
        <textarea
          className="orkut-textarea w-full"
          style={{ height: 40 }}
          placeholder="Clique para adicionar uma legenda."
          value={photo.caption}
          onChange={(e) => onCaptionChange(e.target.value)}
        />
        <label className="orkut-radio-label">
          <input
            type="radio"
            name="album-cover-photo"
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

function AlbumEditShareTag({ label, onRemove }: { label: string; onRemove: () => void }) {
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

function AlbumEditShareRow({
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

function AlbumEditSharePanel() {
  const [groupTags, setGroupTags] = useState<string[]>(["todos do orkut"]);

  return (
    <div className="w-60 shrink-0 border border-orkut-box-border bg-orkut-panel p-3">
      <h3 className="m-0 mb-2 text-[13px] font-bold">
        compartilhar com amigos
      </h3>

      <label className="mb-1 block text-[11px] font-bold text-black">
        escolher amigos:
      </label>
      <textarea
        className="orkut-textarea w-auto"
        placeholder="digite o nome de um amigo ou grupo"
      />

      <p className="mt-3 mb-1.5 text-[11px] font-bold text-black">
        compartilhado atualmente com:
      </p>
      <div className="flex flex-col gap-1.5">
        <AlbumEditShareRow icon="/icons/i_friend.gif" label="amigos">
          <span className="text-[#5a5a5a]">nenhum</span>
        </AlbumEditShareRow>
        <AlbumEditShareRow icon="/icons/i_friendgroup.png" label="grupos">
          {groupTags.length === 0 ? (
            <span className="text-[#5a5a5a]">nenhum</span>
          ) : (
            groupTags.map((tag) => (
              <AlbumEditShareTag
                key={tag}
                label={tag}
                onRemove={() =>
                  setGroupTags((prev) => prev.filter((t) => t !== tag))
                }
              />
            ))
          )}
        </AlbumEditShareRow>
        <AlbumEditShareRow icon="/icons/i_friend.gif" label="contatos">
          <span className="text-[#5a5a5a]">nenhum</span>
        </AlbumEditShareRow>
      </div>
    </div>
  );
}

export function AlbumEditPage({
  albumId,
  homeHref = "/",
  albumHref = "/",
}: {
  albumId: string;
  homeHref?: string;
  albumHref?: string;
}) {
  const router = useRouter();
  const [albumTitle, setAlbumTitle] = useState("");
  const [photos, setPhotos] = useState<EditablePhoto[] | null>(null);
  const [coverPhotoId, setCoverPhotoId] = useState("");
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const initialCaptionsRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    let active = true;
    getAlbum(albumId)
      .then((detail) => {
        if (!active) return;
        const mapped = detail.photos.map((p) => ({
          id: p.id,
          src: p.url,
          caption: p.caption ?? "",
        }));
        setAlbumTitle(detail.title);
        setPhotos(mapped);
        initialCaptionsRef.current = new Map(mapped.map((p) => [p.id, p.caption]));
        const cover = detail.photos.find((p) => p.url === detail.coverPhotoUrl);
        setCoverPhotoId(cover?.id ?? mapped[0]?.id ?? "");
      })
      .catch((e) => {
        console.error("Falha ao carregar fotos do álbum:", e);
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [albumId]);

  function handleCaptionChange(id: string, caption: string) {
    setPhotos((prev) => prev?.map((p) => (p.id === id ? { ...p, caption } : p)) ?? prev);
  }

  function handleToggleDelete(id: string) {
    setPhotosToDelete((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function handleCancel() {
    router.push(albumHref);
  }

  async function handleSave() {
    if (!photos) return;
    setSaving(true);
    setError("");
    try {
      const captionUpdates = photos
        .filter(
          (p) =>
            !photosToDelete.includes(p.id) &&
            p.caption !== (initialCaptionsRef.current.get(p.id) ?? ""),
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
      router.push(albumHref);
    } catch (e) {
      console.error("Falha ao salvar fotos do álbum:", e);
      setError("Não foi possível salvar as alterações. Tente novamente.");
      setSaving(false);
    }
  }

  const breadcrumbLabel = (
    <>
      <Link href={homeHref}>Álbuns</Link>
      <span className="orkut-breadcrumb-sep">&gt;</span>
      <Link href={albumHref}>{albumTitle || "Álbum"}</Link>
      <span className="orkut-breadcrumb-sep">&gt;</span>
      Editar fotos
    </>
  );

  if (loadError) {
    return (
      <BigSharpShell title="Editar fotos" breadcrumbLabel={breadcrumbLabel} homeHref={homeHref}>
        <p className="mt-3 text-[12px] text-red-600">
          Não foi possível carregar as fotos deste álbum.
        </p>
      </BigSharpShell>
    );
  }

  if (!photos) {
    return (
      <BigSharpShell title="Editar fotos" breadcrumbLabel={breadcrumbLabel} homeHref={homeHref}>
        <p className="mt-3 text-[12px] text-black">carregando fotos...</p>
      </BigSharpShell>
    );
  }

  return (
    <BigSharpShell title={albumTitle || "Álbum"} breadcrumbLabel={breadcrumbLabel} homeHref={homeHref}>
      <div className="flex flex-col gap-3">
        <AlbumEditActionBar
          albumHref={albumHref}
          saving={saving}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {error && <p className="text-[12px] text-red-600">{error}</p>}

        {photos.length === 0 ? (
          <p className="text-[12px] text-black">nenhuma foto neste álbum.</p>
        ) : (
          <div className="flex items-start gap-4">
            <div className="flex flex-1 flex-col gap-3">
              {photos.map((photo) => (
                <AlbumEditPhotoRow
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

            <AlbumEditSharePanel />
          </div>
        )}

        <AlbumEditActionBar
          albumHref={albumHref}
          saving={saving}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </BigSharpShell>
  );
}
