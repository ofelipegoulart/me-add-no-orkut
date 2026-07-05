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

export interface CreateProfileRatingRequest {
  trust?: number;
  cool?: number;
  cute?: number;
}

export interface RatingValues {
  trust: number;
  cool: number;
  cute: number;
}

export interface ProfileRatingParams {
  targetUserId: UUID;
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

export interface GetSentTestimonialsParams {
  userId: UUID;
}

export interface GetReceivedTestimonialsParams {
  userId: UUID;
  includePending?: boolean;
}

export type TestimonialListResponse = TestimonialResponse[];