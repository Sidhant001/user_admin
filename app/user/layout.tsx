"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function UserLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/login");
    } 
    
    else {
      setIsAuth(true);
    }
  }, []);

  if (!isAuth) return <p className="p-5">Loading...</p>;

  const linkClass = (path: string) =>
    `p-2 rounded ${
      pathname === path
        ? "bg-gray-700 text-green-400"
        : "hover:bg-gray-700 text-white"
    }`;

  return (
    <div className="flex">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        ☰
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-gray-900 text-white p-5 transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl mb-4">User Panel</h2>

        <nav className="flex flex-col gap-2">
          <Link href="/user/dashboard" className={linkClass("/user/dashboard")}>
            Dashboard
          </Link>

          <Link href="/user/todos" className={linkClass("/user/todos")}>
            Todos
          </Link>

          <Link href="/user/add" className={linkClass("/user/add")}>
            Completed Todos
          </Link>
          <Link href="/user/query" className={linkClass("/user/query")}>
          Query
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              document.cookie = "user=; Max-Age=0";
              document.cookie = "token=; Max-Age=0";
              router.push("/login");
            }}
            className="mt-5 bg-red-500 w-full p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 w-full">{children}</main>
    </div>
  );
}