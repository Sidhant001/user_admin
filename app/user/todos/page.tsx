"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  task: string;
  completed: boolean;
  userId: string;
};

export default function TodoPage() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);

    const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");

    const userTodos = storedTodos.filter(
      (t: Todo) => t.userId === storedUser?.id
    );

    setTodos(userTodos);
  }, []);

  const handleAdd = () => {
    if (!task.trim() || !user) return;

    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36),
      task,
      completed: false,
      userId: user.id,
    };

    const allTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    const updated = [...allTodos, newTodo];

    localStorage.setItem("todos", JSON.stringify(updated));
    setTodos((prev) => [...prev, newTodo]);
    setTask("");
  };

  const handleToggle = (id: string) => {
    const allTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    const completedTodos = JSON.parse(
      localStorage.getItem("completedTodos") || "[]"
    );

    const todo = allTodos.find((t: Todo) => t.id === id);
    if (!todo) return;

    const newActive = allTodos.filter((t: Todo) => t.id !== id);
    const newCompleted = [...completedTodos, { ...todo, completed: true }];

    localStorage.setItem("todos", JSON.stringify(newActive));
    localStorage.setItem("completedTodos", JSON.stringify(newCompleted));

    setTodos(newActive.filter((t: Todo) => t.userId === user.id));
  };

  const handleDelete = (id: string) => {
    const allTodos = JSON.parse(localStorage.getItem("todos") || "[]");

    const updated = allTodos.filter((t: Todo) => t.id !== id);

    localStorage.setItem("todos", JSON.stringify(updated));
    setTodos(updated.filter((t: Todo) => t.userId === user.id));
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg md:text-xl mb-4 font-bold text-center text-orange-500">
        Todos
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={task}
          placeholder="Add Todos"
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 flex-1 rounded-lg"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      {todos.length === 0 && (
        <p className="text-center text-gray-500">
          No todos yet
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
                ⭕
              </button>

              <span className="break-words">
                {todo.task}
              </span>
            </div>

            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg w-full sm:w-auto"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}