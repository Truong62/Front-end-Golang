// hooks/useGetData.ts
'use client';

import {useQuery} from '@tanstack/react-query';
import {useLogout} from '@/hook/useLogout';

interface UseGetDataProps {
  endpoint: string;
  queryKey: string[];
  token?: string;
}

export const useGetData = <T>({endpoint, queryKey, token}: UseGetDataProps) => {
  const logout = useLogout();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 401) {
        logout();
        throw new Error('Invalid or expired token');
      }

      if (!response.ok) throw new Error('Network response was not ok');

      return response.json() as Promise<T>;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
