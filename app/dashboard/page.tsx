import { redirect } from 'next/navigation';
import { auth, signOut } from '../../auth';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white shadow-2xl shadow-slate-800 rounded-2xl'>
      <h1 className='text-2xl font-bold mb-6'>Welcome, {session.user.name}</h1>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button className='w-full p-2 bg-red-500 text-white rounded'>
          Sign Out
        </button>
      </form>
    </div>
  );
}
