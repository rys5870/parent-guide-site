import { clerkClient } from "@clerk/nextjs/server";

const MAX_USERS = 500;
const PAGE_SIZE = 100;

export type ClerkUserSimplified = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  banned: boolean;
  role: string;
  lastSignInAt: string | null;
};

/** רשימת משתמשים לפאנל אדמין — Clerk דרך SDK של Next (לא @clerk/express). */
export async function fetchClerkUsersForAdmin(): Promise<ClerkUserSimplified[]> {
  const client = await clerkClient();
  const out: ClerkUserSimplified[] = [];
  let offset = 0;

  while (offset < MAX_USERS) {
    const page = Math.min(PAGE_SIZE, MAX_USERS - offset);
    const res = await client.users.getUserList({ limit: page, offset });

    for (const user of res.data) {
      out.push({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? null,
        firstName: user.firstName,
        lastName: user.lastName,
        banned: Boolean(user.publicMetadata?.banned),
        role: String(user.publicMetadata?.role ?? "user"),
        lastSignInAt: user.lastSignInAt
          ? new Date(user.lastSignInAt).toISOString()
          : null,
      });
    }

    if (res.data.length === 0 || res.data.length < page) break;
    offset += res.data.length;
  }

  return out;
}
