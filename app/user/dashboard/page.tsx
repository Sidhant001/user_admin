"use client";

import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "@/app/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const loadTodos = () => {
    const loggedInUser = getUserFromLocalStorage();
    const userIdFromUrl = searchParams.get("userId");

    console.log("URL USER ID:", userIdFromUrl);

    let activeUser: User | null = loggedInUser;

    if (loggedInUser?.role === "admin" && userIdFromUrl) {
      const allUsers: User[] = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      console.log("ALL USERS:", allUsers);

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
      (t) => String(t.userId) === String(activeUser!.id)
    );

    const userCompleted = completedTodos.filter(
      (t) => String(t.userId) === String(activeUser!.id)
    );

    setUserTodos([...userActive, ...userCompleted]);
  };

  useEffect(() => {
    loadTodos();

    window.addEventListener("focus", loadTodos);
    return () => window.removeEventListener("focus", loadTodos);
  }, [searchParams]); 
  const completed = userTodos.filter((t) => t.completed).length;
  const pending = userTodos.length - completed;

  const loggedInUser = getUserFromLocalStorage();
  const isAdminViewing =
    loggedInUser?.role === "admin" && searchParams.get("userId");

  return (
    <div className="p-4 md:p-6 space-y-6">
    
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h1 className="text-lg md:text-2xl font-bold">
          👋 Welcome, {user?.name || "User"}
        </h1>

        {isAdminViewing && (
          <p className="text-sm text-gray-500 mt-1">
            Viewing as Admin (User Dashboard)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <p className="text-sm">Total</p>
          <h2 className="text-xl md:text-2xl">{userTodos.length}</h2>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <p className="text-sm">Completed</p>
          <h2 className="text-xl md:text-2xl">{completed}</h2>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
          <p className="text-sm">Pending</p>
          <h2 className="text-xl md:text-2xl">{pending}</h2>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => router.push("/user/todos")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow"
        >
          Go to Todos
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h2 className="text-md md:text-lg mb-3 font-semibold">
          Recent Todos
        </h2>

        {userTodos.length === 0 && (
          <p className="text-gray-500 text-sm">
            No todos available
          </p>
        )}

        {userTodos.slice(0, 3).map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center border p-2 mb-2 rounded-lg"
          >
            <span className="break-words">{todo.task}</span>
            <span className="ml-2">
              {todo.completed ? "✅" : "⭕"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}