import { clerkClient } from "@clerk/express";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, banned } = await req.json();

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { banned },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}