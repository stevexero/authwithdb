import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { hash } from 'bcryptjs';
import { signIn } from '@/auth';

export async function POST(request: NextRequest) {
  const { name, email, password, passwordConfirm } = await request.json();

  if (!name || !email || !password || !passwordConfirm) {
    return NextResponse.json(
      {
        error: 'Name, email, password, and password confirmation are required',
      },
      { status: 400 }
    );
  }

  if (password !== passwordConfirm) {
    return NextResponse.json(
      { error: 'Passwords do not match' },
      { status: 400 }
    );
  }

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already in use' },
      { status: 409 }
    );
  }

  const hashedPassword = await hash(password, 12);
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  await signIn('credentials', { email, password, redirect: false });
  return NextResponse.json(
    { success: true, redirect: '/dashboard' },
    { status: 201 }
  );
}
