'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getCookie} from '@/utils/cookieUtils';
import {Todo} from '@/types/todo';
import {useLogout} from '@/hook/useLogout';

interface UpdateTodoParams {
  todoId: string;
  data: Todo;
}

export const useUpdateTodoApi = () => {
  const queryClient = useQueryClient();
  const token = getCookie('token');
  const logout = useLogout();

  return useMutation({
    mutationFn: async ({todoId, data}: UpdateTodoParams) => {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        logout();
        throw new Error('Invalid or expired token');
      }

      if (!response.ok) throw new Error('can not update todo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });
};
