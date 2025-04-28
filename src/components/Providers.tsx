'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {useState} from 'react';
import Header from '@/components/Header';
import {useLogout} from '@/hook/useLogout';

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

export function Providers({children}: {children: React.ReactNode}) {
  const logout = useLogout();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // data is stale after 5 minutes
            refetchOnWindowFocus: false, // data is not refetched when window is focused
            retry: 1, // retry 1 time if request fails
          },
          mutations: {
            onError: (error: Error) => {
              const apiError = error as ApiError;
              if (apiError?.response?.status === 401) {
                logout();
              }
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main>{children}</main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
