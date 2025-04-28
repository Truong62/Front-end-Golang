'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {useGetData} from '@/hook/useGetData';
import {getCookie} from '@/utils/cookieUtils';
import {TodoBoard} from '@/components/DragDrop/TodoBoard';
import {Todo} from '@/types/todo';

export default function Home() {
  const {data, isLoading, error} = useGetData<Todo[]>({
    endpoint: '/api/todos',
    queryKey: [''],
    token: getCookie('token') || undefined,
  });

  return (
    <div className="flex flex-col items-center px-4 py-6 w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Todo App</h1>
            <p className="text-muted-foreground mt-1">Easy to manage your tasks</p>
          </div>
          <Button asChild size="lg" className="mt-4 md:mt-0">
            <Link href="/create-todo">Add new task</Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p>Loading data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>There is an error when loading data. Please try again later.</p>
          </div>
        )}

        {data && !isLoading && (
          <>
            {data.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">You don&apost have any task</p>
                <Button asChild>
                  <Link href="/create-todo">Create your first task</Link>
                </Button>
              </div>
            ) : (
              <TodoBoard todos={data} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
