import type {
  AddPollCommentRequest,
  CreatePollRequest,
  Poll,
  PollComment,
  PollImageResponse,
  PollsPage,
  VotePollRequest,
} from "./poll-types";

// As chamadas do cliente vão para as rotas /api/... do próprio Next (padrão
// proxy), que anexam o JWT no servidor via getServerSession. Mesma abordagem
// usada por álbuns (lib/album-service.ts), comunidades e depoimentos.
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

// GET /api/community/{id}/polls — lista paginada de enquetes da comunidade.
export async function listPolls(communityId: string, page = 0, size = 20): Promise<PollsPage> {
  const response = await apiFetch(
    `/api/community/${communityId}/polls?page=${page}&size=${size}`,
    { method: "GET" },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch polls: ${response.status}`);
  }
  return response.json();
}

// GET /api/community/{id}/polls/{pollId} — detalhe de uma enquete.
export async function getPoll(communityId: string, pollId: string): Promise<Poll> {
  const response = await apiFetch(`/api/community/${communityId}/polls/${pollId}`, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Failed to fetch poll: ${response.status}`);
  }
  return response.json();
}

// POST /api/community/{id}/polls/image — upload multipart, retorna a URL
// pública pra mandar como `imageUrl` na criação da enquete.
export async function uploadPollImage(communityId: string, file: File): Promise<PollImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/community/${communityId}/polls/image`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Failed to upload poll image: ${response.status}`);
  }
  return response.json();
}

// POST /api/community/{id}/polls — cria uma enquete.
export async function createPoll(communityId: string, request: CreatePollRequest): Promise<Poll> {
  const response = await apiFetch(`/api/community/${communityId}/polls`, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Failed to create poll: ${response.status}`);
  }
  return response.json();
}

// POST /api/community/{id}/polls/{pollId}/vote — registra o voto do usuário.
export async function votePoll(communityId: string, pollId: string, request: VotePollRequest): Promise<Poll> {
  const response = await apiFetch(`/api/community/${communityId}/polls/${pollId}/vote`, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Failed to vote on poll: ${response.status}`);
  }
  return response.json();
}

// POST /api/community/{id}/polls/{pollId}/comments — novo comentário na enquete.
export async function addPollComment(
  communityId: string,
  pollId: string,
  request: AddPollCommentRequest,
): Promise<PollComment> {
  const response = await apiFetch(`/api/community/${communityId}/polls/${pollId}/comments`, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Failed to add poll comment: ${response.status}`);
  }
  return response.json();
}

// DELETE /api/community/{id}/polls/{pollId} — exclui a enquete.
export async function deletePoll(communityId: string, pollId: string): Promise<void> {
  const response = await apiFetch(`/api/community/${communityId}/polls/${pollId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed to delete poll: ${response.status}`);
  }
}

export const pollService = {
  listPolls,
  getPoll,
  uploadPollImage,
  createPoll,
  votePoll,
  addPollComment,
  deletePoll,
};
