'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
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
    <div className='max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow'>
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
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded'
        >
          Sign Up
        </button>
      </form>
      <p className='mt-4 text-center'>
        Already have an account?{' '}
        <Link href='/login' className='text-blue-500 hover:underline'>
          Login
        </Link>
      </p>
    </div>
  );
}
