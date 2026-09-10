/**
 * Centralised React Query key factory.
 * All admin hooks must import from here — never inline string arrays.
 * Changing a key here automatically invalidates all dependent queries.
 */

export const queryKeys = {
  appointments: {
    all: ['appointments'] as const,
    filtered: (status: string, search: string) =>
      ['appointments', 'filtered', status, search] as const,
  },
  blogPosts: {
    all: ['blog-posts'] as const,
  },
  gallery: {
    all: ['gallery'] as const,
  },
  team: {
    all: ['team'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
  },
} as const;
