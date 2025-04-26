'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-190px)]">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">App</h1>
        <p className="text-muted-foreground text-center max-w-[600px]">
          A simple task management application that helps you organize and track your daily tasks.
        </p>
        <Button asChild size="lg">
          <Link href="/create-todo">Create New Task</Link>
        </Button>
      </div>
    </div>
  );
}
