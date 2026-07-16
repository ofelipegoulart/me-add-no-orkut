"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { deleteAlbum, getAlbum, updateAlbum } from "@/lib/album-service";
import type { AlbumDetail, AlbumPrivacy } from "@/lib/album-types";

type Sharing = "todos" | "amigos";

const PLACEHOLDER_PHOTO = "/avatar/i_nophoto128.gif";

function privacyToSharing(privacy: AlbumPrivacy): Sharing {
  return privacy === "PUBLIC" ? "todos" : "amigos";
}

function sharingToPrivacy(sharing: Sharing): AlbumPrivacy {
  return sharing === "todos" ? "PUBLIC" : "FRIENDS_ONLY";
}

export function AlbumDetailPage({
  albumId,
  homeHref,
  albumListHref,
  isOwner,
}: {
  albumId: string;
  homeHref: string;
  albumListHref: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [compartilhamento, setCompartilhamento] = useState<Sharing>("amigos");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    getAlbum(albumId)
      .then((detail) => {
        if (!active) return;
        setAlbum(detail);
        setTitulo(detail.title);
        setDescricao(detail.description ?? "");
        setCompartilhamento(privacyToSharing(detail.privacy));
      })
      .catch((e) => {
        console.error("Falha ao carregar álbum:", e);
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [albumId]);

  async function handleSaveMetadata() {
    if (!titulo.trim()) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateAlbum(albumId, {
        title: titulo.trim(),
        description: descricao.trim() || undefined,
        privacy: sharingToPrivacy(compartilhamento),
      });
      setAlbum((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditing(false);
    } catch (e) {
      console.error("Falha ao atualizar álbum:", e);
      setError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAlbum() {
    setDeleting(true);
    try {
      await deleteAlbum(albumId);
      router.push(albumListHref);
    } catch (e) {
      console.error("Falha ao excluir álbum:", e);
      setDeleting(false);
    }
  }

  if (loadError) {
    return (
      <BigSharpShell title="Álbum" breadcrumbLabel="Álbum" homeHref={homeHref} full>
        <p className="mt-3 text-[12px] text-red-600">
          Não foi possível carregar este álbum.
        </p>
      </BigSharpShell>
    );
  }

  if (!album) {
    return (
      <BigSharpShell title="Álbum" breadcrumbLabel="Álbum" homeHref={homeHref} full>
        <p className="mt-3 text-[12px] text-black">carregando álbum...</p>
      </BigSharpShell>
    );
  }

  return (
    <BigSharpShell
      title={album.title}
      breadcrumbLabel={
        <>
          <Link href={albumListHref}>Álbuns</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          {album.title}
        </>
      }
      homeHref={homeHref}
      full
    >
      {isOwner && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          <Link
            href={`${albumListHref}/${albumId}/Adicionar`}
            className="orkut-blue-button"
          >
            adicionar fotos
          </Link>
          <Link href={`${albumListHref}/${albumId}/Editar`} className="text-orkut-link">
            editar fotos
          </Link>
          <span className="text-[#ccc]">|</span>
          <button
            type="button"
            className="text-orkut-link"
            onClick={() => setIsEditing((v) => !v)}
          >
            editar álbum
          </button>
          <span className="text-[#ccc]">|</span>
          <button
            type="button"
            className="text-orkut-link"
            onClick={handleDeleteAlbum}
            disabled={deleting}
          >
            {deleting ? "excluindo..." : "excluir álbum"}
          </button>
        </div>
      )}

      {isOwner && isEditing && (
        <div className="orkut-edit-body mb-3">
          <table className="orkut-edit-table" cellPadding={0} cellSpacing={0}>
            <colgroup>
              <col className="orkut-edit-col-label" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td className="orkut-edit-label">título:</td>
                <td className="orkut-edit-field">
                  <input
                    type="text"
                    className="orkut-input"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="orkut-edit-label">descrição:</td>
                <td className="orkut-edit-field">
                  <textarea
                    className="orkut-textarea"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="orkut-edit-label">compartilhar com:</td>
                <td className="orkut-edit-field">
                  <div className="flex flex-col gap-0.5">
                    <label className="orkut-radio-label">
                      <input
                        type="radio"
                        name="album-detail-sharing"
                        checked={compartilhamento === "todos"}
                        onChange={() => setCompartilhamento("todos")}
                      />
                      todos
                    </label>
                    <label className="orkut-radio-label">
                      <input
                        type="radio"
                        name="album-detail-sharing"
                        checked={compartilhamento === "amigos"}
                        onChange={() => setCompartilhamento("amigos")}
                      />
                      todos os meus amigos
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {error && <p className="px-2.5 py-2 text-[12px] text-red-600">{error}</p>}

          <div className="orkut-edit-buttons">
            <OrkutActionButton
              variant="edit"
              onClick={handleSaveMetadata}
              disabled={saving}
            >
              {saving ? "salvando..." : "salvar"}
            </OrkutActionButton>{" "}
            <OrkutActionButton
              variant="edit"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              cancelar
            </OrkutActionButton>
          </div>
        </div>
      )}

      {album.description && (
        <p className="mb-2 text-[12px] text-black">{album.description}</p>
      )}

      {album.photos.length === 0 ? (
        <div className="border border-orkut-border bg-orkut-panel px-2 py-2 text-[12px] text-black">
          {isOwner ? (
            <>
              nenhuma foto ainda.{" "}
              <Link
                href={`${albumListHref}/${albumId}/Adicionar`}
                className="text-orkut-link"
              >
                Adicionar fotos
              </Link>
            </>
          ) : (
            "nenhuma foto neste álbum"
          )}
        </div>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {album.photos.map((photo) => (
            <li key={photo.id} className="w-[150px]">
              <a href={photo.url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url || PLACEHOLDER_PHOTO}
                  alt={photo.caption ?? ""}
                  width={150}
                  height={150}
                  className="block h-[150px] w-[150px] border border-orkut-border object-cover"
                />
              </a>
              {photo.caption && (
                <p className="m-0 mt-0.5 text-[11px] text-[#676767] break-words">
                  {photo.caption}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </BigSharpShell>
  );
}
