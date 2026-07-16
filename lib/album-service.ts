import type {
  AlbumCard,
  AlbumDetail,
  AlbumPhoto,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  GetAlbumsParams,
} from "./album-types";

// As chamadas do cliente vão para as rotas /api/... do próprio Next (padrão
// proxy), que anexam o JWT no servidor via getServerSession. Mesma abordagem
// usada por comunidades, depoimentos e scraps.
async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function createAlbum(
  request: CreateAlbumRequest,
): Promise<AlbumCard> {
  const response = await apiFetch(`/api/albums`, {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create album: ${response.status}`);
  }

  return response.json();
}

export async function getAlbums(
  params: GetAlbumsParams,
): Promise<AlbumCard[]> {
  const query = new URLSearchParams({ userId: params.userId });
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));

  const response = await apiFetch(`/api/albums?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch albums: ${response.status}`);
  }

  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.content)) return data.content;
  throw new Error("Unexpected response shape for GET /api/albums");
}

export async function getAlbum(id: string): Promise<AlbumDetail> {
  const response = await apiFetch(`/api/albums/${id}`, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Failed to fetch album: ${response.status}`);
  }

  return response.json();
}

export async function updateAlbum(
  id: string,
  request: UpdateAlbumRequest,
): Promise<AlbumCard> {
  const response = await apiFetch(`/api/albums/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to update album: ${response.status}`);
  }

  return response.json();
}

export async function deleteAlbum(id: string): Promise<void> {
  const response = await apiFetch(`/api/albums/${id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete album: ${response.status}`);
  }
}

// Upload multipart de uma foto. Usa fetch cru (sem apiFetch) para o browser
// definir o boundary do multipart.
export async function uploadAlbumPhoto(
  albumId: string,
  file: File,
): Promise<AlbumPhoto> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/albums/${albumId}/photos`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload photo: ${response.status}`);
  }

  return response.json();
}

export async function updatePhotoCaption(
  albumId: string,
  photoId: string,
  caption: string,
): Promise<AlbumPhoto> {
  const response = await apiFetch(
    `/api/albums/${albumId}/photos/${photoId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ caption }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update photo caption: ${response.status}`);
  }

  return response.json();
}

export async function deleteAlbumPhoto(
  albumId: string,
  photoId: string,
): Promise<void> {
  const response = await apiFetch(
    `/api/albums/${albumId}/photos/${photoId}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete photo: ${response.status}`);
  }
}

export async function setAlbumCover(
  albumId: string,
  photoId: string,
): Promise<void> {
  const response = await apiFetch(`/api/albums/${albumId}/cover`, {
    method: "PUT",
    body: JSON.stringify({ photoId }),
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to set album cover: ${response.status}`);
  }
}

// Aplica em lote as edições feitas nas telas de "editar fotos": legendas
// alteradas, exclusões marcadas e a capa escolhida. Reaproveitado pela tela
// de legendas do upload e pela tela de gerenciar fotos do álbum.
export async function saveAlbumPhotoChanges(
  albumId: string,
  changes: {
    captionUpdates: { photoId: string; caption: string }[];
    deletions: string[];
    coverPhotoId?: string;
  },
): Promise<void> {
  await Promise.all([
    ...changes.captionUpdates.map((c) =>
      updatePhotoCaption(albumId, c.photoId, c.caption),
    ),
    ...changes.deletions.map((photoId) => deleteAlbumPhoto(albumId, photoId)),
  ]);

  if (changes.coverPhotoId && !changes.deletions.includes(changes.coverPhotoId)) {
    await setAlbumCover(albumId, changes.coverPhotoId);
  }
}

export const albumService = {
  createAlbum,
  getAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  uploadAlbumPhoto,
  updatePhotoCaption,
  deleteAlbumPhoto,
  setAlbumCover,
  saveAlbumPhotoChanges,
};
