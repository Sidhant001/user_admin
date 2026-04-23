"use client";

import { users } from "@/app/lib/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserFromLocalStorage } from "@/app/lib/auth";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();

  const normalUsers = users.filter((u) => u.role === "user");

 useEffect(() => {
  const loggedInUser = getUserFromLocalStorage();

  if (!loggedInUser || loggedInUser.role !== "admin") {
    router.push("/login");
  }
}, [router]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center text-orange-500">
        All Users
      </h1>

      {normalUsers.map((user) => (
        <div
          key={user.id}
          className="p-3 border mb-2 rounded-lg flex justify-between items-center"
        >
          <span>{user.name}</span>

          <Link
            href={`/admin/users/${user.id}`}
            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
          >
            View Dashboard
          </Link>
        </div>
      ))}
    </div>
  );
}