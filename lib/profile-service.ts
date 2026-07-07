import type {
  ProfileOverviewParams,
  ProfileOverviewResponse,
  AddFriendParams,
  RemoveFriendParams,
  CreateCommunityRequest,
  CommunityResponse,
  JoinCommunityParams,
  LeaveCommunityParams,
  CreateProfileRatingRequest,
  ProfileRatingParams,
  CreateTestimonialRequest,
  CreateTestimonialParams,
  UpdateTestimonialDecisionRequest,
  UpdateTestimonialDecisionParams,
  GetSentTestimonialsParams,
  GetReceivedTestimonialsParams,
  TestimonialListResponse,
  FriendRequest,
  FriendRequestListResponse,
  AcceptFriendRequestParams,
  DeleteFriendRequestParams,
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

export async function createCommunity(
  request: CreateCommunityRequest,
): Promise<CommunityResponse> {
  const response = await apiFetch(`/api/profile/communities`, {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create community: ${response.status}`);
  }

  return response.json();
}

export async function joinCommunity(
  params: JoinCommunityParams,
): Promise<void> {
  const { communityId } = params;
  const response = await apiFetch(
    `/api/profile/communities/${communityId}/join`,
    { method: "POST" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to join community: ${response.status}`);
  }
}

export async function leaveCommunity(
  params: LeaveCommunityParams,
): Promise<void> {
  const { communityId } = params;
  const response = await apiFetch(
    `/api/profile/communities/${communityId}/leave`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to leave community: ${response.status}`);
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

  addFriend,
  removeFriend,
  getReceivedFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  deleteFriendRequest,

  createCommunity,
  joinCommunity,
  leaveCommunity,

  rateProfile,
  getAverageRatings,

  sendTestimonial,
  respondToTestimonial,
  getSentTestimonials,
  getReceivedTestimonials,
};
