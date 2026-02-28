const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.zagotours.com/api';

// Helper function to build URLs
const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: buildUrl('/auth/register'),
    REGISTER_ADMIN: buildUrl('/auth/register-admin'),
    LOGIN: buildUrl('/auth/login'),
    ME: buildUrl('/auth/me'),
    FORGOT_PASSWORD: buildUrl('/auth/forgot-password'),
    RESET_PASSWORD: buildUrl('/auth/reset-password'),
  },

  // Users
  USERS: {
    // User Profile Routes
    PROFILE: buildUrl('/users/profile'),
    UPDATE_PROFILE: buildUrl('/users/profile'),
    REFERRALS: buildUrl('/users/referrals'),

    // Admin Routes
    LIST: buildUrl('/users'),
    BY_ID: (id: string) => buildUrl(`/users/${id}`),
    UPDATE_BY_ID: (id: string) => buildUrl(`/users/${id}/profile`),
    UPDATE_STATUS: (id: string) => buildUrl(`/users/${id}/status`),
    PROMOTE_SAFETY_AMBASSADOR: (id: string) =>
      buildUrl(`/users/${id}/safety-ambassador`),
    DELETE: (id: string) => buildUrl(`/users/${id}`),
  },

  PLATFORM_SETTINGS: {
    GET: buildUrl('/platform-settings'),
    CREATE: buildUrl('/platform-settings'),
    UPDATE: buildUrl('/platform-settings'),
  },

  // Inside ADVENTURES:

  // Adventures
  ADVENTURES: {
    LIST: buildUrl('/adventures'),
    CREATE: buildUrl('/adventures'),
    BULK_CREATE: buildUrl('/adventures/bulk'),
    BY_ID: (id: string) => buildUrl(`/adventures/${id}`),
    UPDATE: (id: string) => buildUrl(`/adventures/${id}`),
    DELETE: (id: string) => buildUrl(`/adventures/${id}`),
    TOGGLE_LIKE: (id: string) => buildUrl(`/adventures/${id}/toggle-like`),
    TRIP_TYPE_COUNTS: buildUrl('/adventures/trip-type-counts'),
    // Itineraries (nested under adventures)
    ITINERARIES: {
      LIST: (adventureId: string) =>
        buildUrl(`/adventures/${adventureId}/itineraries`),
      CREATE: (adventureId: string) =>
        buildUrl(`/adventures/${adventureId}/itineraries`),
      BULK_CREATE: (adventureId: string) =>
        buildUrl(`/adventures/${adventureId}/itineraries/bulk`),
      BY_ID: (itineraryId: string) =>
        buildUrl(`/adventures/itineraries/${itineraryId}`),
      UPDATE: (itineraryId: string) =>
        buildUrl(`/adventures/itineraries/${itineraryId}`),
      DELETE: (itineraryId: string) =>
        buildUrl(`/adventures/itineraries/${itineraryId}`),
    },

    // Gallery (nested under adventures)
    GALLERY: {
      LIST: (adventureId: string) =>
        buildUrl(`/adventures/${adventureId}/gallery`),
      CREATE: (adventureId: string) =>
        buildUrl(`/adventures/${adventureId}/gallery`),
      BULK_UPLOAD: (adventureId: string) =>
        buildUrl(`/adventures/${adventureId}/gallery/bulk`),
      BY_ID: (galleryId: string) =>
        buildUrl(`/adventures/gallery/${galleryId}`),
      UPDATE: (galleryId: string) =>
        buildUrl(`/adventures/gallery/${galleryId}`),
      REORDER: buildUrl('/adventures/gallery/reorder'),
      DELETE: (galleryId: string) =>
        buildUrl(`/adventures/gallery/${galleryId}`),
    },
  },

  // Posts
  POSTS: {
    LIST: buildUrl('/posts'),
    BY_ID: (id: string) => buildUrl(`/posts/${id}`),
    CREATE: buildUrl('/posts'),
    UPDATE: (id: string) => buildUrl(`/posts/${id}`),
    DELETE: (id: string) => buildUrl(`/posts/${id}`),
    MY_POSTS: buildUrl('/posts/my/posts'),
    FEED: buildUrl('/posts/feed/my-feed'),

    // Social interactions
    TOGGLE_LIKE: (postId: string) => buildUrl(`/posts/${postId}/like`),
    SHARE: (postId: string) => buildUrl(`/posts/${postId}/share`),

    // Comments
    COMMENTS: {
      LIST: (postId: string) => buildUrl(`/posts/${postId}/comments`),
      CREATE: (postId: string) => buildUrl(`/posts/${postId}/comments`),
      DELETE: (postId: string, commentId: string) =>
        buildUrl(`/posts/${postId}/comments/${commentId}`),
    },
  },

  // Reviews
  REVIEWS: {
    LIST: buildUrl('/reviews'),
    FEATURED: buildUrl('/reviews/featured'),
    AVERAGE_RATING: buildUrl('/reviews/average-rating'),
    BY_ID: (id: string) => buildUrl(`/reviews/${id}`),
    CREATE: buildUrl('/reviews'),
    MY_REVIEWS: buildUrl('/reviews/my/reviews'),
    UPDATE: (id: string) => buildUrl(`/reviews/${id}`),
    DELETE: (id: string) => buildUrl(`/reviews/${id}`),
    TOGGLE_FEATURED: (id: string) => buildUrl(`/reviews/${id}/toggle-featured`),
  },

  // Events
  EVENTS: {
    LIST: buildUrl('/events'),
    UPCOMING: buildUrl('/events/upcoming'),
    BY_ID: (id: string) => buildUrl(`/events/${id}`),
    CREATE: buildUrl('/events'),
    UPDATE: (id: string) => buildUrl(`/events/${id}`),
    DELETE: (id: string) => buildUrl(`/events/${id}`),
    MY_BOOKINGS: buildUrl('/events/me/bookings'),
    JOIN: (id: string) => buildUrl(`/events/${id}/join`),
    CANCEL_REGISTRATION: (id: string) => buildUrl(`/events/${id}/cancel`),
    ADMIN_STATS: buildUrl('/events/admin/stats'),
  },

  // Trip Requests
  TRIP_REQUESTS: {
    CREATE: buildUrl('/trip-requests'),
    MY_REQUESTS: buildUrl('/trip-requests/my-requests'),
    ASSIGNED_TO_ME: buildUrl('/trip-requests/assigned-to-me'),
    LIST: buildUrl('/trip-requests'),
    RECENT: buildUrl('/trip-requests/recent'),
    BY_ID: (id: string) => buildUrl(`/trip-requests/${id}`),
    DELETE: (id: string) => buildUrl(`/trip-requests/${id}`),
  },

  // Callback Requests
  CALLBACK_REQUESTS: {
    CREATE: buildUrl('/callback-requests'),
    MY_REQUESTS: buildUrl('/callback-requests/my-requests'),
    ASSIGNED_TO_ME: buildUrl('/callback-requests/assigned-to-me'),
    LIST: buildUrl('/callback-requests'),
    PENDING: buildUrl('/callback-requests/pending'),
    BY_ID: (id: string) => buildUrl(`/callback-requests/${id}`),
    DELETE: (id: string) => buildUrl(`/callback-requests/${id}`),
  },

  // General Inquiries
  INQUIRIES: {
    CREATE: buildUrl('/inquiries'),
    LIST: buildUrl('/inquiries'),
    RECENT: buildUrl('/inquiries/recent'),
    BY_ID: (id: string) => buildUrl(`/inquiries/${id}`),
    DELETE: (id: string) => buildUrl(`/inquiries/${id}`),
  },

  // Trip Planning Calls
  PLANNING_CALLS: {
    SCHEDULE: buildUrl('/trip-planning-calls'),
    UPCOMING: buildUrl('/trip-planning-calls/upcoming'),
    MY_CALLS: buildUrl('/trip-planning-calls/my-calls'),
    RESCHEDULE: (id: string) =>
      buildUrl(`/trip-planning-calls/${id}/reschedule`),
    CANCEL: (id: string) => buildUrl(`/trip-planning-calls/${id}/cancel`),
    COMPLETE: (id: string) => buildUrl(`/trip-planning-calls/${id}/complete`),
    LIST: buildUrl('/trip-planning-calls'),
    BY_ID: (id: string) => buildUrl(`/trip-planning-calls/${id}`),
    DELETE: (id: string) => buildUrl(`/trip-planning-calls/${id}`),
  },

  // Platform-galleries
  PLATFORM_GALLERIES: {
    CREATE: buildUrl('/platform-galleries'),
    UPDATE: (id: string) => buildUrl(`/platform-galleries/${id}`),
    LIST: buildUrl('/platform-galleries'),
    DELETE: (id: string) => buildUrl(`/platform-galleries/${id}`),
  },

  // Dashboard
  DASHBOARD: {
    STATS: buildUrl('/dashboard/stats'),
    LEADERBOARD: buildUrl('/dashboard/leaderboard'),
    AGENT_STATS: (agentId: string) => buildUrl(`/dashboard/agent/${agentId}`),
    AFFILIATE_STATS: (affiliateId: string) =>
      buildUrl(`/dashboard/affiliate/${affiliateId}`),
  },

  NEWSLETTER: {
    SUBSCRIBE: buildUrl('/newsletters/subscribe'),
    LIST: buildUrl('/newsletters/list'),
  },
} as const;

export { API_BASE_URL };
