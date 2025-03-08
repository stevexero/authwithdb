'use server';

import { signIn } from '@/auth';

export async function loginWithCredentials(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (!result || result.error) {
    throw new Error('Invalid email or password');
  }

  // No return value; client handles redirect
}
