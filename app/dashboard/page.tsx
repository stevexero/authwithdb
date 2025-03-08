import { auth, signOut } from '../../auth'; // Import signOut from auth module (server-side)

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    return <div>Access Denied</div>;
  }

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow'>
      <h1 className='text-2xl font-bold mb-6'>Welcome, {session.user.name}</h1>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' }); // Server-side signOut
        }}
      >
        <button className='w-full p-2 bg-red-500 text-white rounded'>
          Sign Out
        </button>
      </form>
    </div>
  );
}
