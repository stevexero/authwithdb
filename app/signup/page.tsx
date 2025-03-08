'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Signup failed');
      return;
    }

    if (data.success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <div className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <div className='max-w-md mx-auto mt-20 p-6 bg-white shadow-2xl shadow-slate-800 rounded-2xl'>
          <h1 className='text-2xl font-bold mb-6'>Sign Up</h1>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Name'
              className='w-full p-2 border rounded'
              required
            />
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className='w-full p-2 border rounded'
              required
            />
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='w-full p-2 border rounded'
              required
            />
            <input
              type='password'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder='Confirm Password'
              className='w-full p-2 border rounded'
              required
            />
            <button
              type='submit'
              className='w-full p-2 bg-blue-500 text-white rounded'
            >
              Sign Up
            </button>
          </form>
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className='w-full mt-4 p-2 bg-red-500 text-white rounded'
          >
            Sign up with Google
          </button>
          <button
            onClick={() =>
              signIn('magic-link', { email, callbackUrl: '/dashboard' })
            }
            className='w-full mt-4 p-2 bg-green-500 text-white rounded'
          >
            Sign up with Magic Link
          </button>
          <p className='mt-4 text-center'>
            Already have an account?{' '}
            <Link href='/' className='text-blue-500 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
