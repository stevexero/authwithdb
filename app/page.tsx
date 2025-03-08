import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Login from './components/sign-in';

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className='w-full flex items-center justify-center font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <Login />
      </main>
    </div>
  );
}
