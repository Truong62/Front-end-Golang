'use client';

import {useRouter} from 'next/navigation';
import {deleteCookie} from '@/utils/cookieUtils';

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    deleteCookie('token');
    router.push('/login');
  };

  return logout;
};
