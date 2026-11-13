import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export const liveQueryKeys = [
  ['logements'],
  ['reservations'],
  ['availability-slots'],
  ['messages'],
  ['gallery'],
] as const;
