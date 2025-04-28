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
import Link from 'next/link';

export default function CreateTodo(): React.ReactElement {
  const [title, setTitle] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {mutate} = usePostApi('/api/todos', getCookie('token') || undefined, {
    onSuccess: () => {
      setTitle('');
      setIsDialogOpen(true);
    },
  });

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
          <Button className="cursor-pointer" onClick={() => mutate({title})}>
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
                Yes
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" variant="link">
                <Link href="/">No</Link>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
