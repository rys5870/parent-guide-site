import { clerkClient } from "@clerk/express";
import { NextResponse } from "next/server";
import type { User } from "@clerk/backend"; // טיפוס מובנה של Clerk

export async function GET() {
  try {
    const response = await clerkClient.users.getUserList({ limit: 50 });
    const users = response.data;

    const simplified = users.map((user: User) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      banned: user.publicMetadata?.banned ?? false,
      role: user.publicMetadata?.role ?? "user",
      lastSignInAt: user.lastSignInAt
        ? new Date(user.lastSignInAt).toISOString()
        : null,
    }));

    return NextResponse.json(simplified);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}