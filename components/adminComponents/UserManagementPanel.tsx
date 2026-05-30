"use client";
import React from "react";
import { useUser, useAuth, UserButton, Show } from "@clerk/nextjs";

const UserManagementPanel: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">ניהול משתמשים</h2>

      <Show when="signed-in">
        <div className="space-y-3">
          <div>👤 <strong>{user?.fullName}</strong></div>
          <div>📧 {user?.primaryEmailAddress?.emailAddress}</div>
          <div>🆔 {user?.id}</div>

          <UserButton afterSignOutUrl="/" />

          <button
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            התנתקות
          </button>
        </div>
      </Show>

      <Show when="signed-out">
        <div className="text-gray-600">אינך מחובר. אנא התחבר כדי לנהל משתמשים.</div>
      </Show>
    </div>
  );
};

export default UserManagementPanel;