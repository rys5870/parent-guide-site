"use client";
import { ClerkLoaded, SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import SignIn from "./SignIn";

export default function HeaderAuth() {
  return (
    <ClerkLoaded>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </ClerkLoaded>
  );
}