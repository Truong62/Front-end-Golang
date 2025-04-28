'use client';

import React, {useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {usePostApi} from '@/hook/usePostApi';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

type LoginData = {
  email: string;
  password: string;
};

type LoginDataSuccess = {
  token: string;
};

type LoginResponse = {
  success: boolean;
  data?: LoginDataSuccess;
  message?: string;
};

export default function Login(): React.ReactElement {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const {mutate, isPending, error, data} = usePostApi<LoginData, LoginResponse>(
    '/api/login',
    undefined,
    {
      onSuccess: (data) => {
        console.log(data);
        if (data?.success && data?.data?.token) {
          localStorage.setItem('token', data.data.token);
          document.cookie = `token=${data.data.token}; path=/`;
          router.push('/');
        }
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({email: loginData.email, password: loginData.password});
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-50px)]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => ({...prev, email: e.target.value}))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData((prev) => ({...prev, password: e.target.value}))}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? 'Loading...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
        <CardFooter className="mt-4">
          <Button type="submit" className="w-full">
            <Link href="/register">Register</Link>
          </Button>
        </CardFooter>
        {error && <div className="p-4 text-red-500 text-center">{error.message}</div>}
        {data?.message && !data?.success && (
          <div className="p-4 text-red-500 text-center">{data.message}</div>
        )}
      </Card>
    </div>
  );
}
