import { clerkClient } from '@clerk/express';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // שליפת רשימת משתמשים
    const response = await clerkClient.users.getUserList({ limit: 1000 });
    const users = response.data;

    const total = users.length;
   const verifiedUsers = users.filter((u) =>
  u.emailAddresses.some((e) => e.verification?.status === 'verified')
);
    const verified = verifiedUsers.length;
    const unverified = total - verified;

    return NextResponse.json({ total, verified, unverified });
  } catch (error) {
    console.error('שגיאה בשליפת משתמשים:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}