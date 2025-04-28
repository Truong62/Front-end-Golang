import {useMutation, UseMutationOptions} from '@tanstack/react-query';

export const useApiMutation = <TInput, TOutput>(
  url: string,
  token?: string,
  options?: Omit<UseMutationOptions<TOutput, Error, TInput>, 'mutationFn'>,
) => {
  return useMutation<TOutput, Error, TInput>({
    mutationFn: async (data: TInput) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const err = await res.json();
            throw new Error(err.message || 'API error');
          } else {
            const text = await res.text();
            throw new Error(text || 'API error');
          }
        } catch (parseError) {
          if (parseError instanceof Error) {
            throw parseError;
          }
          throw new Error('Unexpected error response');
        }
      }

      return res.json();
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
  options?: Omit<UseMutationOptions<TOutput, Error, TInput>, 'mutationFn'>,
) {
  return useApiMutation<TInput, TOutput>(url, token, options);
}
