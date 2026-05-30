import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clerkClient();
    const daysBack = 7;
    const dailyCounts: Record<string, number> = {};

    for (let i = 0; i < daysBack; i++) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      date.setUTCHours(0, 0, 0, 0);
      const key = date.toISOString().split("T")[0];
      dailyCounts[key] = 0;
    }

    const allUsers: { createdAt: number }[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await client.users.getUserList({ limit, offset });
      const users = response.data;

      allUsers.push(...users);

      if (users.length < limit) break;
      offset += limit;
    }

    allUsers.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      createdAt.setUTCHours(0, 0, 0, 0);
      const key = createdAt.toISOString().split("T")[0];
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++;
      }
    });

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
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
