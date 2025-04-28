// hooks/useGetData.ts
import {useQuery} from '@tanstack/react-query';

interface UseGetDataProps<T> {
  endpoint: string;
  queryKey: string | (string | number)[];
  enabled?: boolean;
  responseType?: T;
}

const fetcher = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(endpoint);

  if (!response.ok) throw new Error('Network response was not ok');

  const data = (await response.json()) as T;
  return data;
};

export function useGetData<T>({endpoint, queryKey, enabled = true}: UseGetDataProps<T>) {
  return useQuery<T>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => fetcher<T>(endpoint),
    enabled,
  });
}
