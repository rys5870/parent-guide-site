"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function HeaderAuth() {
  return (
    <div className="flex items-center gap-4">
      {/* משתמש מחובר */}
      <SignedIn>
        <UserButton />
      </SignedIn>

      {/* משתמש לא מחובר */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 rounded-lg bg-myColor_red text-white hover:bg-myColor_orange hover:text-white transition">
            התחבר
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
