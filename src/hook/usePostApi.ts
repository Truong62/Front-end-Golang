'use client';

import {useMutation, UseMutationOptions} from '@tanstack/react-query';
import {useLogout} from '@/hook/useLogout';

interface ApiError {
  message: string;
  status?: number;
}

export const useApiMutation = <TInput, TOutput>(
  url: string,
  token?: string,
  options?: Omit<UseMutationOptions<TOutput, ApiError, TInput>, 'mutationFn'>,
) => {
  const logout = useLogout();

  return useMutation<TOutput, ApiError, TInput>({
    mutationFn: async (data: TInput) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.status === 401) {
        logout();
        throw new Error('Invalid or expired token');
      }

      if (!res.ok) {
        throw {
          message: responseData.error || 'API error',
          status: res.status,
        };
      }

      return responseData;
    },
    onError: () => {
      console.log(`onError`);
    },
    onSettled: () => {
      console.log(`onSettled`);
    },
    ...options,
  });
};

export function usePostApi<TInput, TOutput>(
  url: string,
  token?: string,
  options?: Omit<UseMutationOptions<TOutput, ApiError, TInput>, 'mutationFn'>,
) {
  return useApiMutation<TInput, TOutput>(url, token, options);
}
