export type UUID = string;
export type FriendsForUI = { id: string; name: string; count: number; seed: string; avatarUrl?: string }[];
export type CommunitiesForUI = { name: string; seed: string; icon?: string; count: number }[];


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
  avatar?: string | null;
}

// Espelha ProfileOverviewDTO.FriendCardDTO do backend (Spring): o campo da
// foto se chama `avatar`, não `avatarUrl`.
export interface FriendSummary {
  id: UUID;
  name: string;
  firstName: string;
  avatar?: string | null;
  friendsCount: number;
}

// Espelha ProfileOverviewDTO.CommunityCardDTO do backend.
export interface CommunitySummary {
  id: UUID;
  name: string;
  icon?: string | null;
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

export function transformFriendsForUI(friends: FriendSummary[]): FriendsForUI {
  return friends.slice(0, 9).map((f, index) => ({
    id: f.id,
    name: f.firstName || f.name,
    count: f.friendsCount || 0,
    seed: f.id || String(index),
    avatarUrl: f.avatar ?? undefined,
  }));
}

export function transformCommunitiesForUI(
  communities: CommunitySummary[]
): CommunitiesForUI {
  return communities.slice(0, 9).map((c) => ({
    name: c.name,
    seed: c.id,
    icon: c.icon ?? undefined,
    count: c.memberCount || 0,
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

// ── Comunidades (contrato do CommunityController) ──

// PUBLIC: qualquer um entra na hora. MODERATED: o pedido fica pendente até o
// mediador aprovar. (O enum antigo PUBLIC/PRIVATE foi substituído por este.)
export type CommunityType = "PUBLIC" | "MODERATED";

// OPEN_TO_NON_MEMBERS: conteúdo visível a qualquer um. RESTRICTED: só membros
// veem o conteúdo (o GET dashboard responde 403 para não-membros).
export type CommunityContentPrivacy = "OPEN_TO_NON_MEMBERS" | "RESTRICTED";

// Opção do dropdown de categorias vinda de GET /api/community/categories.
// `value` é o nome do enum no backend (ex.: "COMPUTERS_AND_INTERNET").
export interface CommunityCategoryOption {
  value: string;
  label: string;
}

export interface CommunityLocation {
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Cada flag é opcional; omitir `features` (ou uma flag) aplica os defaults do
// formulário no backend.
export interface CommunityFeatures {
  forumEnabled?: boolean;
  forumOnHomepage?: boolean;
  forumNoAnonymousPosts?: boolean;
  pollsEnabled?: boolean;
  pollsOnHomepage?: boolean;
  eventsEnabled?: boolean;
  eventsOnHomepage?: boolean;
  customNewsEnabled?: boolean;
}

// Payload de POST /api/community.
export interface CreateCommunityRequest {
  name: string;
  category: string; // enum value vindo de /api/community/categories
  type: CommunityType;
  contentPrivacy: CommunityContentPrivacy;
  language: string;
  location?: CommunityLocation;
  icon?: string; // URL devolvida por POST /api/community/icon
  description?: string;
  features?: CommunityFeatures;
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

// POST /api/community/icon → { url }.
export interface CommunityIconResponse {
  url: string;
}

export interface JoinCommunityParams {
  communityId: UUID;
}

// POST .../join responde 200 com o status: APPROVED (comunidade pública, entrou
// direto) ou PENDING (moderada, aguardando o mediador).
export type JoinCommunityStatus = "APPROVED" | "PENDING";

export interface JoinCommunityResponse {
  status: JoinCommunityStatus;
}

export interface LeaveCommunityParams {
  communityId: UUID;
}

// Card padrão das listagens (categoria / busca / minhas). `lastPostLabel` já vem
// pronto ("14:32" se foi hoje, senão "09/07/2026"); `lastPostAt` é o ISO cru em
// UTC (nulo se o fórum ainda não tem mensagens). `membersCount` conta só membros
// aprovados.
export interface CommunityCard {
  id: UUID;
  name: string;
  icon?: string;
  membersCount: number;
  lastPostAt: string | null;
  lastPostLabel: string;
}

// Relação do usuário com a comunidade em GET /api/community/mine. OWNER vence
// MEMBER (quem criou aparece sempre como OWNER), então dá para agrupar as três
// seções direto por este campo, sem desduplicar.
export type CommunityRelation = "OWNER" | "MEMBER" | "PENDING";

export interface MyCommunityCard extends CommunityCard {
  relation: CommunityRelation;
}

// Vínculo do viewer com a comunidade em GET /api/community/{id}/dashboard.
// Igual a CommunityRelation, mas com "NONE" para quem não participa.
export type CommunityViewerRelation = CommunityRelation | "NONE";

// ── Dashboard de uma comunidade (GET /api/community/{id}/dashboard) ──
// Ficha completa + fórum + enquete ativa + membros em destaque. É o que
// alimenta a página /Community/{id}. RESTRICTED responde 403 a não-membros.

export interface CommunityInfo {
  id: UUID;
  name: string;
  description?: string | null;
  icon?: string | null;
  language?: string | null;
  category?: string | null; // nome do enum (ex.: COUNTRIES_AND_REGIONS)
  categoryLabel?: string | null; // rótulo já traduzido para exibição
  ownerId?: UUID | null;
  ownerName?: string | null;
  type: CommunityType;
  contentPrivacy: CommunityContentPrivacy;
  location?: CommunityLocation | null;
  features?: CommunityFeatures;
  membersCount: number;
  createdAt?: string | null;
  viewerRelation?: CommunityViewerRelation;
}

export interface CommunityTopicBrief {
  id: UUID;
  title: string;
  totalPosts: number;
  lastPostDate?: string | null;
}

export interface CommunityPollOption {
  id: UUID;
  text: string;
  voteCount: number;
}

export interface CommunityActivePoll {
  id: UUID;
  question: string;
  creator?: string | null;
  voteOptions: CommunityPollOption[];
}

export interface CommunityMemberSummary {
  id: UUID;
  name: string;
  photoUrl?: string | null;
}

export interface CommunityDashboard {
  community: CommunityInfo;
  topics: CommunityTopicBrief[];
  activePoll?: CommunityActivePoll | null;
  featuredMembers: CommunityMemberSummary[];
}

// Pedido de participação pendente (visível só ao dono da comunidade).
export interface CommunityJoinRequest {
  userId: UUID;
  name: string;
  avatarUrl?: string;
  requestedAt: string;
}

export interface CommunityJoinRequestParams {
  communityId: UUID;
  userId: UUID;
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