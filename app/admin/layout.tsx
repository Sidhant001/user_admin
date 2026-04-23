"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/login");
    } else {
      setIsAuth(true);
    }

    setLoading(false); 
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuth) return null;

  const linkStyle = (path: string) =>
    `p-2 rounded ${
      pathname === path
        ? "bg-gray-700 text-green-400"
        : "hover:bg-gray-700 text-white"
    }`;

  return (
    <div className="flex  min-h-screen">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded"
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
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link
            href="/admin/user"
            className={linkStyle("/admin/user")}
            onClick={() => setIsOpen(false)}
          >
            Users
          </Link>

          <Link
            href="/admin/transactions"
            className={linkStyle("/admin/transactions")}
            onClick={() => setIsOpen(false)}
          >
            Transactions
          </Link>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            document.cookie = "user=; Max-Age=0";
            document.cookie = "token=; Max-Age=0";
            router.push("/login");
          }}
          className="mt-10 bg-red-500 w-full p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-4 md:p-6 w-full">
        {children}
      </main>
    </div>
  );
}