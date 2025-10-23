'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {usePostApi} from '@/hook/usePostApi';
import {getCookie} from '@/utils/cookieUtils';
import {DialogClose, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {DialogContent, DialogFooter} from '@/components/ui/dialog';
import {Dialog} from '@/components/ui/dialog';
import {useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {Todo} from '@/types/todo';

export default function CreateTodo(): React.ReactElement {
  const [title, setTitle] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {mutate} = usePostApi('/api/todos', getCookie('token') || undefined, {
    onSuccess: (newTodo) => {
      setTitle('');

      queryClient.setQueryData(['todos'], (oldData: Todo[] | undefined) => {
        if (!oldData) return [newTodo];
        return [...oldData, newTodo];
      });

      queryClient.invalidateQueries({queryKey: ['todos']});

      setIsDialogOpen(true);
    },
  });

  const handleGoToHome = () => {
    queryClient.invalidateQueries({queryKey: ['todos']});
    queryClient.refetchQueries({queryKey: ['todos']});

    router.push('/?refresh=' + Date.now());
  };

  const handleCreateTodo = () => {
    if (title.trim()) mutate({title});
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-50px)]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <div className="flex gap-2">
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e): void => setTitle(e.target.value)}
            required
          />
          <Button className="cursor-pointer" onClick={handleCreateTodo}>
            Create
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create todo successfully</DialogTitle>
            <DialogDescription>You can create another todo or view your todos.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Create Another
              </Button>
            </DialogClose>
            <Button type="button" variant="default" onClick={handleGoToHome}>
              View All Todos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
