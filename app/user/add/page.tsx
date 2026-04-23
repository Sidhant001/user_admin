"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  task: string;
  completed: boolean;
  userId: string;
};

export default function CompletedTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);

    const stored = JSON.parse(
      localStorage.getItem("completedTodos") || "[]"
    );

    const userTodos = stored.filter(
      (t: Todo) => t.userId === storedUser?.id
    );

    setTodos(userTodos);
  }, []);

  const handleToggle = (id: string) => {
    const activeTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    const completedTodos = JSON.parse(
      localStorage.getItem("completedTodos") || "[]"
    );

    const todo = completedTodos.find((t: Todo) => t.id === id);
    if (!todo) return;

    const newCompleted = completedTodos.filter((t: Todo) => t.id !== id);
    const newActive = [...activeTodos, { ...todo, completed: false }];

    localStorage.setItem("completedTodos", JSON.stringify(newCompleted));
    localStorage.setItem("todos", JSON.stringify(newActive));

    setTodos(newCompleted.filter((t: Todo) => t.userId === user.id));
  };

  const handleDelete = (id: string) => {
    const completedTodos = JSON.parse(
      localStorage.getItem("completedTodos") || "[]"
    );

    const updated = completedTodos.filter((t: Todo) => t.id !== id);

    localStorage.setItem("completedTodos", JSON.stringify(updated));
    setTodos(updated.filter((t: Todo) => t.userId === user.id));
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg md:text-xl mb-4 font-bold text-center text-orange-500">
        Completed Todos
      </h1>

      {todos.length === 0 && (
        <p className="text-center text-gray-500">
          No completed todos yet
        </p>
      )}

      <div className="flex flex-col gap-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-3 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <button
                onClick={() => handleToggle(todo.id)}
                className="text-lg"
              >
                ✅
              </button>

              <span className="line-through break-words">
                {todo.task}
              </span>
            </div>

            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 w-full sm:w-auto"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}