'use client';

import { useState } from 'react';
import { loginWithCredentials } from '@/lib/actions';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await loginWithCredentials(formData);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white shadow-2xl shadow-slate-800 rounded-2xl'>
      <h1 className='text-2xl font-bold mb-6'>Login</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form
        action={loginWithCredentials}
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <input
          name='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='w-full p-2 border rounded'
        />
        <input
          name='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='w-full p-2 border rounded'
        />
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded'
        >
          Login with Credentials
        </button>
      </form>
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className='w-full mt-4 p-2 bg-red-500 text-white rounded'
      >
        Login with Google
      </button>
      <button
        onClick={() =>
          signIn('magic-link', { email, callbackUrl: '/dashboard' })
        }
        className='w-full mt-4 p-2 bg-green-500 text-white rounded'
      >
        Login with Magic Link
      </button>
      <p className='mt-4 text-center'>
        Don’t have an account?{' '}
        <a href='/signup' className='text-blue-500 hover:underline'>
          Sign Up
        </a>
      </p>
    </div>
  );
}
