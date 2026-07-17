import type {
  ProfileOverviewParams,
  ProfileOverviewResponse,
  AddFriendParams,
  RemoveFriendParams,
  CreateCommunityRequest,
  CommunityResponse,
  CommunityCategoryOption,
  CommunityIconResponse,
  JoinCommunityParams,
  JoinCommunityResponse,
  LeaveCommunityParams,
  CommunityJoinRequest,
  CommunityJoinRequestParams,
  CommunityCard,
  MyCommunityCard,
  CreateProfileRatingRequest,
  ProfileRatingParams,
  CreateTestimonialRequest,
  CreateTestimonialParams,
  UpdateTestimonialDecisionRequest,
  UpdateTestimonialDecisionParams,
  DeleteTestimonialParams,
  GetSentTestimonialsParams,
  GetReceivedTestimonialsParams,
  TestimonialListResponse,
  FriendRequest,
  FriendRequestListResponse,
  AcceptFriendRequestParams,
  DeleteFriendRequestParams,
  ProfileUser,
  UpdateStatusMessageRequest,
} from "./profile-types";

// As chamadas do cliente vão para as rotas /api/... do próprio Next (padrão proxy),
// que anexam o JWT no servidor via getServerSession. A sessão viaja no cookie, então
// não enviamos token aqui — mesma abordagem usada por scraps e perfil.
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

export async function getProfileOverview(
  params?: ProfileOverviewParams,
): Promise<ProfileOverviewResponse> {
  const queryParams = new URLSearchParams();
  if (params?.userId) {
    queryParams.set("userId", params.userId);
  }

  const queryString = queryParams.toString();
  const url = `/api/profile/overview${queryString ? `?${queryString}` : ""}`;

  const response = await apiFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile overview: ${response.status}`);
  }

  return response.json();
}

// Atualiza a frase de status do próprio perfil (PUT /users/me/status). Enviar
// `null` limpa a frase.
export async function updateStatusMessage(
  request: UpdateStatusMessageRequest,
): Promise<ProfileUser> {
  const response = await apiFetch(`/api/account/status`, {
    method: "PUT",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to update status message: ${response.status}`);
  }

  return response.json();
}

// Envia um pedido de amizade (backend responde 201 com o FriendRequestDTO).
// Mantém o nome `addFriend` por compatibilidade com o restante do código.
export async function addFriend(
  params: AddFriendParams,
): Promise<FriendRequest> {
  const { friendUserId } = params;
  const response = await apiFetch(
    `/api/profile/friends/${friendUserId}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to send friend request: ${response.status}`);
  }

  return response.json();
}

export async function getReceivedFriendRequests(): Promise<FriendRequestListResponse> {
  const response = await apiFetch(`/api/profile/friends/requests`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch received friend requests: ${response.status}`,
    );
  }

  return response.json();
}

export async function getSentFriendRequests(): Promise<FriendRequestListResponse> {
  const response = await apiFetch(`/api/profile/friends/requests/sent`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sent friend requests: ${response.status}`);
  }

  return response.json();
}

export async function acceptFriendRequest(
  params: AcceptFriendRequestParams,
): Promise<void> {
  const { requestId } = params;
  const response = await apiFetch(
    `/api/profile/friends/requests/${requestId}/accept`,
    { method: "POST" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to accept friend request: ${response.status}`);
  }
}

// Recusa (destinatário) ou cancela (remetente) um pedido — mesmo endpoint.
export async function deleteFriendRequest(
  params: DeleteFriendRequestParams,
): Promise<void> {
  const { requestId } = params;
  const response = await apiFetch(
    `/api/profile/friends/requests/${requestId}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete friend request: ${response.status}`);
  }
}

export async function removeFriend(params: RemoveFriendParams): Promise<void> {
  const { friendUserId } = params;
  const response = await apiFetch(
    `/api/profile/friends/${friendUserId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to remove friend: ${response.status}`);
  }
}

// Categorias do formulário de criação (GET /api/community/categories → [{value,label}]).
export async function getCommunityCategories(): Promise<CommunityCategoryOption[]> {
  const response = await apiFetch(`/api/community/categories`, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Failed to fetch community categories: ${response.status}`);
  }

  return response.json();
}

// Upload multipart da imagem da comunidade. Devolve a URL para mandar em `icon`.
// Usa fetch cru (sem apiFetch) para o browser definir o boundary do multipart.
export async function uploadCommunityIcon(
  file: File,
): Promise<CommunityIconResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/community/icon`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload community icon: ${response.status}`);
  }

  return response.json();
}

export async function createCommunity(
  request: CreateCommunityRequest,
): Promise<CommunityResponse> {
  const response = await apiFetch(`/api/community`, {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create community: ${response.status}`);
  }

  return response.json();
}

// Atualiza a comunidade com o payload completo do formulário de edição
// (mesmo formato de createCommunity). Só o dono pode editar.
export async function updateCommunity(
  id: string,
  request: CreateCommunityRequest,
): Promise<CommunityResponse> {
  const response = await apiFetch(`/api/community/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to update community: ${response.status}`);
  }

  return response.json();
}

// Entra (ou pede para entrar) numa comunidade. 200 → { status } diz se entrou
// direto (APPROVED, pública) ou ficou pendente (PENDING, moderada). 409 se já
// for membro ou já tiver pedido pendente.
export async function joinCommunity(
  params: JoinCommunityParams,
): Promise<JoinCommunityResponse> {
  const { communityId } = params;
  const response = await apiFetch(
    `/api/community/${communityId}/join`,
    { method: "POST" },
  );

  if (!response.ok) {
    throw new Error(`Failed to join community: ${response.status}`);
  }

  return response.json();
}

// Sai da comunidade ou retira um pedido de participação ainda pendente.
export async function leaveCommunity(
  params: LeaveCommunityParams,
): Promise<void> {
  const { communityId } = params;
  const response = await apiFetch(
    `/api/community/${communityId}/leave`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to leave community: ${response.status}`);
  }
}

// ── Listagens (cards) ──

// Comunidades de uma categoria, mais membros primeiro.
export async function getCommunitiesByCategory(
  category: string,
  page = 0,
  size = 20,
): Promise<CommunityCard[]> {
  const query = new URLSearchParams({
    category,
    page: String(page),
    size: String(size),
  });
  const response = await apiFetch(`/api/community?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch communities by category: ${response.status}`);
  }

  return response.json();
}

// Busca por nome (case-insensitive, casa qualquer parte). Nome em branco
// devolve lista vazia — nem chamamos o backend nesse caso.
export async function searchCommunities(
  name: string,
  page = 0,
  size = 20,
): Promise<CommunityCard[]> {
  if (!name.trim()) {
    return [];
  }
  const query = new URLSearchParams({
    name,
    page: String(page),
    size: String(size),
  });
  const response = await apiFetch(`/api/community/search?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to search communities: ${response.status}`);
  }

  return response.json();
}

// Comunidades que o usuário é dono, participa, ou está pendente (campo relation).
export async function getMyCommunities(): Promise<MyCommunityCard[]> {
  const response = await apiFetch(`/api/community/mine`, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Failed to fetch my communities: ${response.status}`);
  }

  return response.json();
}

// ── Moderação de pedidos de participação (só o dono da comunidade) ──

export async function getCommunityJoinRequests(
  communityId: string,
): Promise<CommunityJoinRequest[]> {
  const response = await apiFetch(
    `/api/community/${communityId}/join-requests`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch join requests: ${response.status}`);
  }

  return response.json();
}

export async function approveCommunityJoinRequest(
  params: CommunityJoinRequestParams,
): Promise<void> {
  const { communityId, userId } = params;
  const response = await apiFetch(
    `/api/community/${communityId}/join-requests/${userId}/approve`,
    { method: "POST" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to approve join request: ${response.status}`);
  }
}

export async function rejectCommunityJoinRequest(
  params: CommunityJoinRequestParams,
): Promise<void> {
  const { communityId, userId } = params;
  const response = await apiFetch(
    `/api/community/${communityId}/join-requests/${userId}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to reject join request: ${response.status}`);
  }
}

export async function rateProfile(
  params: ProfileRatingParams,
  request: CreateProfileRatingRequest,
): Promise<void> {
  const { targetUserId } = params;
  const response = await apiFetch(
    `/api/profile/ratings/${targetUserId}`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to rate profile: ${response.status}`);
  }
}

export async function getAverageRatings(
  targetUserId: string,
): Promise<import("./profile-types").RatingsAverage> {
  const response = await apiFetch(
    `/api/profile/ratings/${targetUserId}/average`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch average ratings: ${response.status}`);
  }

  return response.json();
}

export async function getRatedCategories(
  targetUserId: string,
): Promise<import("./profile-types").RatedCategoriesResponse> {
  const response = await apiFetch(
    `/api/profile/ratings/${targetUserId}/me`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch rated categories: ${response.status}`);
  }

  return response.json();
}

export async function sendTestimonial(
  params: CreateTestimonialParams,
  request: CreateTestimonialRequest,
): Promise<import("./profile-types").TestimonialResponse> {
  const { targetUserId } = params;
  const response = await apiFetch(
    `/api/profile/testimonials/${targetUserId}`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to send testimonial: ${response.status}`);
  }

  return response.json();
}

export async function respondToTestimonial(
  params: UpdateTestimonialDecisionParams,
  request: UpdateTestimonialDecisionRequest,
): Promise<void> {
  const { testimonialId } = params;
  const response = await apiFetch(
    `/api/profile/testimonials/${testimonialId}/decision`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to respond to testimonial: ${response.status}`);
  }
}

// Apaga um depoimento. O dono do perfil remove os que recebeu; o autor remove
// os que escreveu — a autorização fica a cargo do backend (mesmo endpoint).
export async function deleteTestimonial(
  params: DeleteTestimonialParams,
): Promise<void> {
  const { testimonialId } = params;
  const response = await apiFetch(
    `/api/profile/testimonials/${testimonialId}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete testimonial: ${response.status}`);
  }
}

export async function getSentTestimonials(
  params: GetSentTestimonialsParams,
): Promise<TestimonialListResponse> {
  const { userId } = params;
  const response = await apiFetch(
    `/api/profile/testimonials/sent?userId=${userId}`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch sent testimonials: ${response.status}`);
  }

  return response.json();
}

export async function getReceivedTestimonials(
  params: GetReceivedTestimonialsParams,
): Promise<TestimonialListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set("userId", params.userId);
  if (params.includePending !== undefined) {
    queryParams.set("includePending", String(params.includePending));
  }

  const response = await apiFetch(
    `/api/profile/testimonials/received?${queryParams.toString()}`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch received testimonials: ${response.status}`,
    );
  }

  return response.json();
}

export const profileService = {
  getOverview: getProfileOverview,
  updateStatusMessage,

  addFriend,
  removeFriend,
  getReceivedFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  deleteFriendRequest,

  getCommunityCategories,
  uploadCommunityIcon,
  createCommunity,
  updateCommunity,
  getCommunitiesByCategory,
  searchCommunities,
  getMyCommunities,
  joinCommunity,
  leaveCommunity,
  getCommunityJoinRequests,
  approveCommunityJoinRequest,
  rejectCommunityJoinRequest,

  rateProfile,
  getAverageRatings,
  getRatedCategories,

  sendTestimonial,
  respondToTestimonial,
  deleteTestimonial,
  getSentTestimonials,
  getReceivedTestimonials,
};
