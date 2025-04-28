'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getCookie} from '@/utils/cookieUtils';
import {Todo} from '@/types/todo';

interface UpdateTodoParams {
  todoId: string;
  data: Todo;
}

export const useUpdateTodoApi = () => {
  const queryClient = useQueryClient();
  const token = getCookie('token');

  return useMutation({
    mutationFn: async ({todoId, data}: UpdateTodoParams) => {
      console.log('Calling PUT API with:', {todoId, data});

      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });

      console.log('API response status:', response.status);

      if (!response.ok) throw new Error('can not update todo');
      return response.json();
    },
    onSuccess: () => {
      console.log('Update successful, invalidating queries');
      queryClient.invalidateQueries({queryKey: ['todos']});
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });
};
