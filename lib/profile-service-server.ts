// ============================================
// Serviço de API para Perfil (Server-Side)
// Versão para uso em Server Components e Server Actions
// ============================================

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type {
  ProfileOverviewParams,
  ProfileOverviewResponse,
  FriendRequestListResponse,
} from "./profile-types";

const API_BASE_URL = process.env.API_URL || "";

/**
 * Versão server-side de getProfileOverview
 * Usa getServerSession para obter o token JWT
 */
export async function getProfileOverviewServer(
  jwt: string,
  params?: ProfileOverviewParams
): Promise<ProfileOverviewResponse> {
  const queryParams = new URLSearchParams();

  if (params?.userId) {
    queryParams.set("userId", params.userId);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/profile/overview${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile overview: ${response.status}`);
  }

  return response.json();
}

/**
 * Pedidos de amizade recebidos (pendentes) do usuário autenticado.
 */
export async function getReceivedFriendRequestsServer(
  jwt: string,
): Promise<FriendRequestListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/profile/friends/requests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch received friend requests: ${response.status}`,
    );
  }

  return response.json();
}

/**
 * Pedidos de amizade enviados pelo usuário autenticado.
 */
export async function getSentFriendRequestsServer(
  jwt: string,
): Promise<FriendRequestListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/profile/friends/requests/sent`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch sent friend requests: ${response.status}`);
  }

  return response.json();
}