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
import {useLogin} from '@/hook/useLogin';

type LoginData = {
  email: string;
  password: string;
};

export default function Login(): React.ReactElement {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const {mutate, isPending, isSuccess, error, data} = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({email: loginData.email, password: loginData.password});
  };

  console.log(data);
  console.log(isSuccess);

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
        <div>{error?.message}</div>
      </Card>
    </div>
  );
}
