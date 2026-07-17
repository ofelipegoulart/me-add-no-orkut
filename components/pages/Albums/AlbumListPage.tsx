"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { createAlbum, deleteAlbum, getAlbums, SCRAP_PHOTOS_ALBUM_TITLE } from "@/lib/album-service";
import type { AlbumCard, AlbumPrivacy } from "@/lib/album-types";

type Sharing = "todos" | "amigos";

const TABS = [
  { key: "minhas", label: "minhas fotos" },
  { key: "comigo", label: "fotos comigo" },
] as const;

const PLACEHOLDER_COVER = "/avatar/i_nophoto128.gif";

const SHARING_LABEL: Record<Sharing, string> = {
  todos: "todos do orkut",
  amigos: "todos os meus amigos",
};

function privacyToSharing(privacy: AlbumPrivacy): Sharing {
  return privacy === "PUBLIC" ? "todos" : "amigos";
}

function sharingToPrivacy(sharing: Sharing): AlbumPrivacy {
  return sharing === "todos" ? "PUBLIC" : "FRIENDS_ONLY";
}

function formatDateBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function AlbumDatesLine({ album }: { album: AlbumCard }) {
  if (album.createdAt && album.updatedAt) {
    return (
      <p className="m-0 text-[11px] text-[#676767]">
        data de criação: {formatDateBR(album.createdAt)} | última atualização:{" "}
        {formatDateBR(album.updatedAt)}
      </p>
    );
  }
  return null;
}

function AlbumListRow({
  album,
  albumListHref,
  isOwner,
  onDelete,
}: {
  album: AlbumCard;
  albumListHref: string;
  isOwner: boolean;
  onDelete: () => void;
}) {
  const albumHref = `${albumListHref}/${album.id}`;
  const sharing = privacyToSharing(album.privacy);

  return (
    <li className="orkut-search-card">
      <div className="orkut-search-card-row">
        <Link href={albumHref} className="orkut-search-card-thumb shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album.coverPhotoUrl || PLACEHOLDER_COVER}
            alt=""
            width={150}
            height={150}
            className="block object-cover"
            style={{ width: 150, height: 150 }}
          />
        </Link>

        <div className="orkut-search-card-body">
          <div className="orkut-search-card-head">
            <span className="orkut-search-name-wrap">
              <Link href={albumHref} className="orkut-search-name">
                {album.title}
              </Link>
              <span className="text-[11px] text-[#676767]">
                ({album.photoCount} fotos)
              </span>
            </span>
          </div>

          <AlbumDatesLine album={album} />

          {isOwner && (
            <>
              <div className="mt-1.5 flex items-start gap-1.5 text-[11px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/i_friend.gif"
                  alt=""
                  width={14}
                  height={14}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-black">
                  compartilhado com{" "}
                  <span className="font-bold">{SHARING_LABEL[sharing]}</span>{" "}
                  <Link href={albumHref} className="font-bold text-orkut-link">
                    Alterar
                  </Link>
                </span>
              </div>

              <div className="mt-1.5 text-[11px]">
                <Link href={albumHref} className="text-orkut-link">
                  Ver álbum
                </Link>
                <span className="text-[#ccc]"> | </span>
                <Link href={`${albumHref}/Adicionar`} className="text-orkut-link">
                  Adicionar mais fotos
                </Link>
                <span className="text-[#ccc]"> | </span>
                <Link href={albumHref} className="text-orkut-link">
                  Editar álbum
                </Link>
                <span className="text-[#ccc]"> | </span>
                <button type="button" onClick={onDelete} className="text-orkut-link">
                  Excluir álbum
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export function AlbumListPage({
  homeHref,
  albumListHref,
  isOwner = true,
  userId,
}: {
  homeHref: string;
  albumListHref: string;
  isOwner?: boolean;
  userId: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"minhas" | "comigo">("minhas");
  const [isCreating, setIsCreating] = useState(false);
  const [albums, setAlbums] = useState<AlbumCard[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [compartilhamento, setCompartilhamento] = useState<Sharing>("amigos");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAlbums({ userId, page: 0, size: 50 })
      .then((list) => {
        if (active) {
          setAlbums(list.filter((a) => a.title !== SCRAP_PHOTOS_ALBUM_TITLE));
        }
      })
      .catch((e) => {
        console.error("Falha ao carregar álbuns:", e);
        if (active) {
          setAlbums([]);
          setLoadError(true);
        }
      });
    return () => {
      active = false;
    };
  }, [userId]);

  function resetForm() {
    setTitulo("");
    setDescricao("");
    setCompartilhamento("amigos");
    setError("");
  }

  function handleCancel() {
    resetForm();
    setIsCreating(false);
  }

  async function handleCreate() {
    if (!titulo.trim()) return;
    setSaving(true);
    setError("");
    try {
      const album = await createAlbum({
        title: titulo.trim(),
        description: descricao.trim() || undefined,
        privacy: sharingToPrivacy(compartilhamento),
      });
      resetForm();
      setIsCreating(false);
      router.push(`${albumListHref}/${album.id}/Adicionar`);
    } catch (e) {
      console.error("Falha ao criar álbum:", e);
      setError("Não foi possível criar o álbum. Tente novamente.");
      setSaving(false);
    }
  }

  async function handleDeleteAlbum(id: string) {
    const previous = albums;
    setAlbums((prev) => (prev ? prev.filter((album) => album.id !== id) : prev));
    try {
      await deleteAlbum(id);
    } catch (e) {
      console.error("Falha ao excluir álbum:", e);
      setAlbums(previous ?? null);
    }
  }

  return (
    <BigSharpShell title="Fotos" breadcrumbLabel="Fotos" homeHref={homeHref} full>
      <div className="border-b border-orkut-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeTab === tab.key
                ? "orkut-edit-tab orkut-edit-tab-active"
                : "orkut-edit-tab"
            }
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.key === "comigo" && (
              <img
                src="/icons/p_camera.gif"
                alt=""
                width={12}
                height={12}
                className="mr-1 inline-block align-middle"
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "comigo" ? (
        <div className="mt-3 border border-orkut-border bg-orkut-panel px-2 py-2 text-[12px] text-black">
          nenhuma foto
        </div>
      ) : (
        <div className="mt-3">
          {isOwner && (
            <div className="mb-2">
              <button
                type="button"
                className="orkut-blue-button"
                onClick={() => setIsCreating((v) => !v)}
              >
                Criar novo álbum
              </button>
            </div>
          )}

          {isOwner && isCreating && (
            <div className="orkut-edit-body">
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
                            name="album-sharing"
                            checked={compartilhamento === "todos"}
                            onChange={() => setCompartilhamento("todos")}
                          />
                          todos
                        </label>
                        <label className="orkut-radio-label">
                          <input
                            type="radio"
                            name="album-sharing"
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

              {error && (
                <p className="px-2.5 py-2 text-[12px] text-red-600">{error}</p>
              )}

              <div className="orkut-edit-buttons">
                <OrkutActionButton
                  variant="edit"
                  onClick={handleCreate}
                  disabled={saving}
                >
                  {saving ? "criando..." : "criar"}
                </OrkutActionButton>{" "}
                <OrkutActionButton
                  variant="edit"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  cancelar
                </OrkutActionButton>
              </div>
            </div>
          )}

          <h2 className="orkut-subtitle">Álbuns ({albums?.length ?? 0})</h2>

          {albums === null ? (
            <table className="w-full border-collapse">
              <tbody>
                <tr className="bg-orkut-panel">
                  <td className="text-[12px] text-black">carregando álbuns...</td>
                </tr>
              </tbody>
            </table>
          ) : loadError ? (
            <table className="w-full border-collapse">
              <tbody>
                <tr className="bg-orkut-panel">
                  <td className="text-[12px] text-red-600">
                    Não foi possível carregar os álbuns.
                  </td>
                </tr>
              </tbody>
            </table>
          ) : albums.length === 0 ? (
            <table className="w-full border-collapse">
              <tbody>
                <tr className="bg-orkut-panel">
                  <td className="text-[12px] text-black">nenhum álbum</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <ul className="orkut-search-list">
              {albums.map((album) => (
                <AlbumListRow
                  key={album.id}
                  album={album}
                  albumListHref={albumListHref}
                  isOwner={isOwner}
                  onDelete={() => handleDeleteAlbum(album.id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </BigSharpShell>
  );
}
