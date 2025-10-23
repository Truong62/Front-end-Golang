'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getCookie} from '@/utils/cookieUtils';
import {useLogout} from '@/hook/useLogout';

export const useDeleteTodoApi = () => {
  const queryClient = useQueryClient();
  const token = getCookie('token');
  const logout = useLogout();

  return useMutation({
    mutationFn: async (todoId: string) => {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 401) {
        logout();
        throw new Error('Invalid or expired token');
      }

      if (!response.ok) throw new Error('Cannot delete todo');
      return todoId;
    },
    onSuccess: () => {
      // Invalidate todos query to refetch the data
      queryClient.invalidateQueries({queryKey: ['todos']});
    },
    onError: (error) => {
      console.error('Delete failed:', error);
    },
  });
};
