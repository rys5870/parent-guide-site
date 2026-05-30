import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({ limit: 1000 });
    const users = response.data;

    const total = users.length;
    const verifiedUsers = users.filter((u) =>
      u.emailAddresses.some((e) => e.verification?.status === "verified")
    );
    const verified = verifiedUsers.length;
    const unverified = total - verified;

    return NextResponse.json({ total, verified, unverified });
  } catch (error) {
    console.error("שגיאה בשליפת משתמשים:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
