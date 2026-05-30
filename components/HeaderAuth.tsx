"use client";

import { Show, UserButton, SignInButton } from "@clerk/nextjs";

export default function HeaderAuth() {
  return (
    <div className="flex items-center gap-4">
      <Show when="signed-in">
        <UserButton />
      </Show>

      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="rounded-full bg-myColor_red px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-myColor_red/20 transition hover:-translate-y-0.5 hover:bg-myColor_orange hover:text-white">
            התחבר
          </button>
        </SignInButton>
      </Show>
    </div>
  );
}
