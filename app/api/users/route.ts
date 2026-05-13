import { NextResponse } from "next/server";
import { fetchClerkUsersForAdmin } from "@/lib/fetchClerkUsersForAdmin";

export async function GET() {
  try {
    const simplified = await fetchClerkUsersForAdmin();
    return NextResponse.json(simplified);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}