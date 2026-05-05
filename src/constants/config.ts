export const FETCH_CONFIG = {
  static: {
    next: {
      revalidate: 86400, // 24 hours
    },
  },
  dynamic: {
    next: {
      revalidate: 3600, // 1 hour
    },
  },
} as const;
