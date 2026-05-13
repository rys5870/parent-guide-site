import { clerkClient, User } from '@clerk/express';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const daysBack = 7;
    const dailyCounts: Record<string, number> = {};

    // נבנה מפת ימים עם ספירה אפסית לפי UTC
    for (let i = 0; i < daysBack; i++) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      date.setUTCHours(0, 0, 0, 0);
      const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      dailyCounts[key] = 0;
    }

    // נביא את כל המשתמשים עם פאגינציה
   let allUsers: User[] = [];
let offset = 0;
const limit = 100;

while (true) {
  const response = await clerkClient.users.getUserList({ limit, offset });
  const users = response.data;

  allUsers = allUsers.concat(users);

  if (users.length < limit) break; // אין עוד עמודים
  offset += limit;
}

    // נעדכן את הספירה לפי תאריך ההרשמה (UTC)
    allUsers.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      createdAt.setUTCHours(0, 0, 0, 0);
      const key = createdAt.toISOString().split('T')[0];
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++;
      }
    });

    // נחשב כמה נרשמו היום לפי UTC
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);

    const todaysUsers = allUsers.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= todayUTC;
    });

    return NextResponse.json({
      totalCount: allUsers.length,
      todayCount: todaysUsers.length,
      dailyCounts,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}