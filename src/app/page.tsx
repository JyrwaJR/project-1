'use client';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@src/components';
import { buttonVariants } from '@src/components/ui/button';
import { showToast } from '@src/components/ui/show-toast';
import { loginFields } from '@src/constants/input-fields';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useAuthContext } from '@src/context/auth';
import { cn } from '@src/lib/utils';
import { LoginModel, LoginModelType } from '@src/models';

export default function AuthenticationPage() {
  const { onLogin, isLoading } = useAuthContext();
  const form = useForm<LoginModelType>({
    resolver: zodResolver(LoginModel),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<LoginModelType> = async (data) => {
    try {
      console.log(data);

      await onLogin(data.email, data.password).then(() => {
        showToast(SuccessToastTitle, 'Login Successful');
      });
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  return (
    <div className="relative flex-col items-center justify-center h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden  md:right-8 md:top-8'
        )}
      >
        Register
      </Link>
      <div className="relative flex-col hidden h-full p-10 text-white bg-muted lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 mr-2"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center h-full p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in
            </p>
          </div>
          <Form
            form={form}
            fields={loginFields}
            onSubmit={onSubmit}
            loading={isLoading}
            className="sm:col-span-full"
            btnStyle="w-full md:w-full"
            btnText="Continue"
          />
          <p className="px-8 text-sm text-center text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
