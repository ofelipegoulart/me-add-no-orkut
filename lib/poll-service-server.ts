// ============================================
// Serviço de API para Enquetes (Server-Side)
// Versão para uso em Server Components, espelhando profile-service-server.ts
// ============================================

import type { Poll, PollsPage } from "./poll-types";

const API_BASE_URL = process.env.API_URL || "";

export async function getPollsServer(
  jwt: string,
  communityId: string,
  page = 0,
  size = 20,
): Promise<PollsPage> {
  const response = await fetch(
    `${API_BASE_URL}/api/community/${communityId}/polls?page=${page}&size=${size}`,
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
    throw new Error(`Failed to fetch polls: ${response.status}`);
  }

  return response.json();
}

export async function getPollServer(jwt: string, communityId: string, pollId: string): Promise<Poll> {
  const response = await fetch(`${API_BASE_URL}/api/community/${communityId}/polls/${pollId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch poll: ${response.status}`);
  }

  return response.json();
}
