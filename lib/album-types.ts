import type { UUID } from "./profile-types";

// PUBLIC: qualquer um vê o álbum. FRIENDS_ONLY: só amigos do dono veem — o
// GET de listagem já esconde esses álbuns de quem não é amigo.
export type AlbumPrivacy = "PUBLIC" | "FRIENDS_ONLY";

export interface AlbumPhoto {
  id: UUID;
  url: string;
  caption?: string | null;
  createdAt?: string;
}

// Card usado na listagem (GET /api/albums?userId=).
export interface AlbumCard {
  id: UUID;
  title: string;
  description?: string | null;
  privacy: AlbumPrivacy;
  coverPhotoUrl?: string | null;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

// Detalhe (GET /api/albums/{id}), com a lista de fotos.
export interface AlbumDetail extends AlbumCard {
  ownerId: UUID;
  photos: AlbumPhoto[];
}

export interface CreateAlbumRequest {
  title: string;
  description?: string;
  privacy: AlbumPrivacy;
}

export interface UpdateAlbumRequest {
  title: string;
  description?: string;
  privacy: AlbumPrivacy;
}

export interface GetAlbumsParams {
  userId: UUID;
  page?: number;
  size?: number;
}
