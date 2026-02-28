// ============================================
// QUERY KEYS
// ============================================

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: any) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  referrals: () => [...userKeys.all, 'referrals'] as const,
};

export const adventureKeys = {
  all: ['adventures'] as const,
  lists: () => [...adventureKeys.all, 'list'] as const,
  list: (filters?: any) => [...adventureKeys.lists(), { filters }] as const,
  details: () => [...adventureKeys.all, 'detail'] as const,
  detail: (id: string) => [...adventureKeys.details(), id] as const,
  itineraries: (adventureId: string) =>
    [...adventureKeys.all, 'itineraries', adventureId] as const,
  gallery: (adventureId: string) =>
    [...adventureKeys.all, 'gallery', adventureId] as const,
  tripTypeCounts: () => [...adventureKeys.all, 'trip-type-counts'] as const,
};

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters?: any) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  myPosts: () => [...postKeys.all, 'my-posts'] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
  comments: (postId: string) => [...postKeys.all, 'comments', postId] as const,
};

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters?: any) => [...reviewKeys.lists(), { filters }] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  featured: () => [...reviewKeys.all, 'featured'] as const,
  averageRating: () => [...reviewKeys.all, 'average-rating'] as const,
  myReviews: () => [...reviewKeys.all, 'my-reviews'] as const,
};

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: any) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  upcoming: () => [...eventKeys.all, 'upcoming'] as const,
  myBookings: () => [...eventKeys.all, 'my-bookings'] as const,
  adminStats: () => [...eventKeys.all, 'admin-stats'] as const,
};

export const tripRequestKeys = {
  all: ['trip-requests'] as const,
  lists: () => [...tripRequestKeys.all, 'list'] as const,
  list: (filters?: any) => [...tripRequestKeys.lists(), { filters }] as const,
  details: () => [...tripRequestKeys.all, 'detail'] as const,
  detail: (id: string) => [...tripRequestKeys.details(), id] as const,
  myRequests: () => [...tripRequestKeys.all, 'my-requests'] as const,
  assignedToMe: () => [...tripRequestKeys.all, 'assigned-to-me'] as const,
  recent: () => [...tripRequestKeys.all, 'recent'] as const,
};

export const callbackRequestKeys = {
  all: ['callback-requests'] as const,
  lists: () => [...callbackRequestKeys.all, 'list'] as const,
  list: (filters?: any) =>
    [...callbackRequestKeys.lists(), { filters }] as const,
  details: () => [...callbackRequestKeys.all, 'detail'] as const,
  detail: (id: string) => [...callbackRequestKeys.details(), id] as const,
  myRequests: () => [...callbackRequestKeys.all, 'my-requests'] as const,
  assignedToMe: () => [...callbackRequestKeys.all, 'assigned-to-me'] as const,
  pending: () => [...callbackRequestKeys.all, 'pending'] as const,
};

export const inquiryKeys = {
  all: ['inquiries'] as const,
  lists: () => [...inquiryKeys.all, 'list'] as const,
  list: (filters?: any) => [...inquiryKeys.lists(), { filters }] as const,
  details: () => [...inquiryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inquiryKeys.details(), id] as const,
  recent: () => [...inquiryKeys.all, 'recent'] as const,
};

export const planningCallKeys = {
  all: ['planning-calls'] as const,
  lists: () => [...planningCallKeys.all, 'list'] as const,
  list: (filters?: any) => [...planningCallKeys.lists(), { filters }] as const,
  details: () => [...planningCallKeys.all, 'detail'] as const,
  detail: (id: string) => [...planningCallKeys.details(), id] as const,
  upcoming: () => [...planningCallKeys.all, 'upcoming'] as const,
  myCalls: () => [...planningCallKeys.all, 'my-calls'] as const,
};

export const newsletterKeys = {
  all: ['newsletter'] as const,
  list: () => [...newsletterKeys.all, 'list'] as const,
};

export const galleryKeys = {
  all: ['platform-galleries'] as const,
  lists: () => [...galleryKeys.all, 'list'] as const,
  list: (filters?: any) => [...galleryKeys.lists(), { filters }] as const,
  details: () => [...galleryKeys.all, 'detail'] as const,
  detail: (id: string) => [...galleryKeys.details(), id] as const,
};

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  leaderboard: () => [...dashboardKeys.all, 'leaderboard'] as const,
  agentStats: (agentId: string) =>
    [...dashboardKeys.all, 'agent', agentId] as const,
  affiliateStats: (affiliateId: string) =>
    [...dashboardKeys.all, 'affiliate', affiliateId] as const,
};

export const platformSettingsKeys = {
  all: ['platform-settings'] as const,
  detail: () => [...platformSettingsKeys.all, 'detail'] as const,
};
