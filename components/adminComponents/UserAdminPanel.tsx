"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type ClerkUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  banned: boolean;
  role: string;
  lastSignInAt: string | null;
};

const UserAdminPanel: React.FC = () => {
  const [users, setUsers] = useState<ClerkUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<ClerkUser[]>("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const toggleBan = async (userId: string, banned: boolean) => {
    try {
      await axios.post("/api/users/ban", { userId, banned: !banned });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, banned: !banned } : u))
      );
    } catch (err) {
      console.error("Error toggling ban:", err);
    }
  };
  const changeRole = async (userId: string, newRole: string) => {
    try {
      await axios.post("/api/users/role", { userId, role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Error changing role:", err);
    }
  };
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">רשימת משתמשים</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
          {user.lastSignInAt && (
            <div className="text-sm text-gray-500">
              כניסה אחרונה:{" "}
              {new Date(user.lastSignInAt).toLocaleString("he-IL")}
            </div>
          )}
          <select
            value={user.role}
            onChange={(e) => changeRole(user.id, e.target.value)}
            className="w-1/5 ml-4 border rounded px-2 py-1"
          >
            <option value="user">משתמש</option>
            <option value="admin">אדמין</option>
          </select>
          <button
            onClick={() => toggleBan(user.id, user.banned)}
            className={`px-4 py-2 rounded ${
              user.banned ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {user.banned ? "שחרור" : "חסימה"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserAdminPanel;
