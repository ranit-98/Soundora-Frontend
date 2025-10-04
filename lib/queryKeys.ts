export const QUERY_KEYS = {
  isAdmin: ['auth', 'isAdmin'],
  albums: ['music', 'albums'],
  albumById: (id: string) => ['music', 'album', id],
  songs: ['music', 'songs'],
  featuredSongs: ['music', 'featuredSongs'],
  madeForYouSongs: ['music', 'madeForYouSongs'],
  trendingSongs: ['music', 'trendingSongs'],
  stats: ['stats'],
  users: ['users'],
  messages: (userId: string) => ['messages', userId],
  userDetails: (userId: string) => ['user', userId],
  
} as const;