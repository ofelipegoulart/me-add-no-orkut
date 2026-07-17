import type { CommunityActivePoll, UUID } from "./profile-types";

// Espelha o contrato final do backend (PollController/PollService/DTOs em
// api-orkut-clone, prompt final de 2026-07-16). Não existe restrição de
// quem pode votar (voterScope) — nunca entrou no contrato real, então não
// faz parte de nenhum tipo aqui (ver CommunityPollCreatePage.tsx).

export interface PollOption {
  id: UUID;
  text: string;
  voteCount: number;
}

export interface PollComment {
  id: UUID;
  authorId: UUID;
  authorName: string;
  authorAvatar?: string | null;
  message: string;
  createdAt?: string | null;
  createdAtLabel: string;
  // [] quando a enquete é anônima ou o autor ainda não votou. Mesma ordem/
  // tamanho de votedOptionTexts.
  votedOptionIds: UUID[];
  votedOptionTexts: string[];
}

// Linha da listagem (/Community/{id}/Poll) — PollSummaryDTO.
export interface PollSummary {
  id: UUID;
  communityId: UUID;
  question: string;
  imageUrl?: string | null;
  creatorId: UUID;
  creatorName: string;
  createdAt?: string | null;
  closesAt?: string | null;
  closed: boolean;
  anonymous: boolean;
  multipleChoice: boolean;
  totalVotes: number;
  commentsCount: number;
  viewerVoted: boolean;
}

// PollsPageDTO — GET /polls é paginado.
export interface PollsPage {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  results: PollSummary[];
}

// Enquete completa (detalhe, e a que aparece em destaque na home) — PollDetailDTO.
export interface Poll {
  id: UUID;
  communityId: UUID;
  communityName: string;
  question: string;
  description?: string | null;
  imageUrl?: string | null;
  creatorId: UUID;
  creatorName: string;
  createdAt?: string | null;
  closesAt?: string | null;
  closed: boolean;
  anonymous: boolean;
  multipleChoice: boolean;
  options: PollOption[];
  totalVotes: number;
  viewerVoteOptionIds: UUID[];
  comments: PollComment[];
}

// CreatePollRequest real.
export interface CreatePollRequest {
  question: string;
  description?: string;
  imageUrl?: string;
  options: string[];
  closesAt?: string | null;
  anonymous?: boolean;
  multipleChoice?: boolean;
}

// POST /polls/image (multipart) — PollImageResponse.
export interface PollImageResponse {
  url: string;
}

// VoteRequest real: mínimo 1 item; mais de 1 numa enquete não-multipleChoice dá 400.
export interface VotePollRequest {
  optionIds: UUID[];
}

export interface AddPollCommentRequest {
  message: string;
}

// CommunityDashboard.activePoll (ActivePollDTO) vem preenchido de verdade
// pelo backend — PollService.getActivePollForDashboard retorna a enquete
// mais recente por createdAt (confirma a decisão de "sem mecanismo de
// destacar"). O DTO ainda é mais enxuto que PollDetailDTO (sem
// creatorId/communityName/description/anonymous/comments/voto do viewer).
export function adaptActivePollToPoll(activePoll: CommunityActivePoll, communityId: UUID): Poll {
  return {
    id: activePoll.id,
    communityId,
    communityName: "",
    question: activePoll.question,
    description: null,
    imageUrl: activePoll.imageUrl ?? null,
    creatorId: "",
    creatorName: activePoll.creator || "—",
    createdAt: null,
    closesAt: activePoll.closesAt ?? null,
    closed: activePoll.closed ?? false,
    anonymous: false,
    multipleChoice: activePoll.multipleChoice ?? false,
    options: activePoll.voteOptions,
    totalVotes: activePoll.voteOptions.reduce((sum, o) => sum + o.voteCount, 0),
    viewerVoteOptionIds: [],
    comments: [],
  };
}
