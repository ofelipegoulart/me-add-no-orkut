export type UUID = string;
export type FriendsForUI = { id: string; name: string; count: number; seed: string }[];
export type CommunitiesForUI = { name: string; seed: string }[];


export interface ProfileOverviewParams {
  userId?: UUID;
}

export interface ProfileUser {
  id: UUID;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  city: string;
  state: string;
  country: string;
  avatarUrl?: string;
}

export interface FriendSummary {
  id: UUID;
  name: string;
  firstName: string;
  avatarUrl?: string;
}

export interface CommunitySummary {
  id: UUID;
  name: string;
  memberCount: number;
}

export interface TestimonialSummary {
  id: UUID;
  authorId: UUID;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface ProfileOverviewResponse {
  user: ProfileUser;
  counts: {
    scrapsCount: number;
    friendsCount: number;
    communitiesCount: number;
    testimonialsCount: number;
  };
  friends: FriendSummary[];
  communities: CommunitySummary[];
  receivedTestimonials: TestimonialSummary[];
}

export function transformFriendsForUI(
  friends: FriendSummary[],
  counts?: { friendsCount: number }
): FriendsForUI {
  return friends.slice(0, 9).map((f, index) => ({
    id: f.id,
    name: f.firstName || f.name,
    count: counts?.friendsCount || 0,
    seed: f.id || String(index),
  }));
}

export function transformCommunitiesForUI(
  communities: CommunitySummary[]
): CommunitiesForUI {
  return communities.slice(0, 9).map((c) => ({
    name: c.name,
    seed: c.id,
  }));
}

export interface AddFriendParams {
  friendUserId: UUID;
}

export interface RemoveFriendParams {
  friendUserId: UUID;
}

// Espelha FriendRequestDTO do backend (Spring).
// - Em pedidos recebidos, `userId`/`name`/`avatar` são de quem ENVIOU o pedido.
// - Em pedidos enviados, são de quem VAI RECEBER o pedido.
export interface FriendRequest {
  requestId: UUID;
  userId: UUID;
  name: string;
  avatar?: string | null;
  createdAt?: string | null;
}

export type FriendRequestListResponse = FriendRequest[];

export interface AcceptFriendRequestParams {
  requestId: UUID;
}

export interface DeleteFriendRequestParams {
  requestId: UUID;
}

// Relação do viewer com o dono do perfil visitado, resolvida no servidor para
// escolher o estado do botão de amizade.
export type FriendRelation =
  | { kind: "none" }
  | { kind: "friend" }
  | { kind: "outgoing"; requestId: UUID } // eu enviei um pedido, aguardando
  | { kind: "incoming"; requestId: UUID }; // ele me enviou um pedido

export interface CreateCommunityRequest {
  name: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
}

export interface CommunityResponse {
  id: UUID;
  name: string;
  description?: string;
  category?: string;
  memberCount: number;
  createdAt: string;
  createdBy: UUID;
}

export interface JoinCommunityParams {
  communityId: UUID;
}

export interface LeaveCommunityParams {
  communityId: UUID;
}

// Espelha CreateProfileRatingRequest do backend (Spring): cada categoria é um
// "passo" inteiro de 1 a 6, correspondendo aos 6 meios-ícones (3 ícones × 2 metades).
// O backend converte para fração via step / 6.
export interface CreateProfileRatingRequest {
  legal?: number; // 1..6
  trustworthy?: number; // 1..6
  sexy?: number; // 1..6
}

// Espelha RatingsDTO do backend: médias das avaliações recebidas, em frações 0..1.
// 0 significa "nenhuma nota recebida".
export interface RatingsAverage {
  legalPercentage: number;
  trustworthyPercentage: number;
  sexyPercentage: number;
}

export interface ProfileRatingParams {
  targetUserId: UUID;
}

// Espelha a resposta de GET /api/profile/ratings/{targetUserId}/me: para cada
// categoria, `true` indica que o usuário logado já enviou uma nota neste perfil.
// Deriva das colunas per-categoria da ProfileRating (null até avaliar), então é
// server-side e sobrevive a troca de dispositivo / limpeza de storage.
export interface RatedCategoriesResponse {
  legal: boolean;
  trustworthy: boolean;
  sexy: boolean;
}

export interface CreateTestimonialRequest {
  message: string;
}

export interface CreateTestimonialParams {
  targetUserId: UUID;
}

// Espelha ProfileOverviewDTO.TestimonialDTO do backend (Spring).
export type TestimonialStatus = "PENDING" | "APPROVED";

export interface TestimonialResponse {
  id: UUID;
  authorId: UUID;
  authorName: string;
  authorAvatar?: string | null;
  message: string;
  status?: TestimonialStatus | null;
  createdAt?: string | null;
}

export interface UpdateTestimonialDecisionRequest {
  approved: boolean;
}

export interface UpdateTestimonialDecisionParams {
  testimonialId: UUID;
}

export interface DeleteTestimonialParams {
  testimonialId: UUID;
}

export interface GetSentTestimonialsParams {
  userId: UUID;
}

export interface GetReceivedTestimonialsParams {
  userId: UUID;
  includePending?: boolean;
}

export type TestimonialListResponse = TestimonialResponse[];