// hooks/useGetData.ts
import {useQuery} from '@tanstack/react-query';
import {getCookie} from '@/utils/cookieUtils';

interface UseGetDataProps<T> {
  endpoint: string;
  queryKey: string | (string | number)[];
  enabled?: boolean;
  responseType?: T;
  token?: string;
}

const fetcher = async <T>(endpoint: string, token?: string): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(endpoint, {
    headers,
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const data = (await response.json()) as T;
  return data;
};

export function useGetData<T>({endpoint, queryKey, enabled = true, token}: UseGetDataProps<T>) {
  const authToken = token || getCookie('token');

  return useQuery<T>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => fetcher<T>(endpoint, authToken || undefined),
    enabled,
  });
}
