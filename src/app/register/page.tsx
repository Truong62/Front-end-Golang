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
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {usePostApi} from '@/hook/usePostApi';
type InputRegister = {
  email: string;
  password: string;
};

type OutputRegister = {
  success: boolean;
  token?: string;
  message?: string;
};

const Register = (): React.ReactElement => {
  const [loginData, setLoginData] = useState<InputRegister>({
    email: '',
    password: '',
  });
  const {mutate, isPending, error} = usePostApi<InputRegister, OutputRegister>('/api/register');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({email: loginData.email, password: loginData.password});
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full h-[calc(100vh-50px)]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your new account</CardDescription>
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
                  onChange={(e) =>
                    setLoginData((prev: InputRegister) => ({...prev, email: e.target.value}))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData((prev: InputRegister) => ({...prev, password: e.target.value}))
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="mt-4">
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? 'Loading...' : 'Register'}
              </Button>
            </CardFooter>
          </form>
          <CardFooter className="mt-4">
            <Button variant="outline" className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </CardFooter>
          <div>{error?.message}</div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
