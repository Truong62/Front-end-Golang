'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="border-b sticky flex justify-center top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-medium text-lg hover:text-primary transition-colors">
            Home
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button onClick={() => router.push('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
