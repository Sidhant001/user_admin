"use client";

import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "@/app/lib/auth";
import { useParams, useRouter } from "next/navigation";

type Todo = {
  id: string;
  task: string;
  completed: boolean;
  userId: string | number;
};

type User = {
  id: string | number;
  name: string;
  email: string;
  role: string;
};

export default function AdminUserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);

  const router = useRouter();
  const params = useParams();

  const userIdFromUrl = params.id;

  const loadTodos = () => {
    const loggedInUser = getUserFromLocalStorage();

    let activeUser: User | null = null;

    if (loggedInUser?.role === "admin" && userIdFromUrl) {
      const allUsers: User[] = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const foundUser = allUsers.find(
        (u) => String(u.id) === String(userIdFromUrl)
      );

      if (foundUser) {
        activeUser = foundUser;
      }
    }

    setUser(activeUser);

    if (!activeUser) return;

    const activeTodos: Todo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );

    const completedTodos: Todo[] = JSON.parse(
      localStorage.getItem("completedTodos") || "[]"
    );

    const userActive = activeTodos.filter(
      (t) => String(t.userId) === String(activeUser.id)
    );

    const userCompleted = completedTodos.filter(
      (t) => String(t.userId) === String(activeUser.id)
    );

    setUserTodos([...userActive, ...userCompleted]);
  };

  useEffect(() => {
    loadTodos();

    window.addEventListener("focus", loadTodos);
    return () => window.removeEventListener("focus", loadTodos);
  }, [params.id]);

  if (!user) return <div className="p-5">User not found</div>;

  const completed = userTodos.filter((t) => t.completed).length;
  const pending = userTodos.length - completed;

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h1 className="text-lg md:text-2xl font-bold">
        {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <p>Total</p>
          <h2 className="text-xl">{userTodos.length}</h2>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <p>Completed</p>
          <h2 className="text-xl">{completed}</h2>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
          <p>Pending</p>
          <h2 className="text-xl">{pending}</h2>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h2 className="text-md md:text-lg mb-3 font-semibold">
          Last Completed Todos
        </h2>

        {userTodos.length === 0 && (
          <p className="text-gray-500">No todos available</p>
        )}

        {[...userTodos].reverse().slice(0, 2).map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center border p-2 mb-2 rounded-lg"
          >
            <span>{todo.task}</span>
            <span>{todo.completed ? "✅" : "⭕"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}