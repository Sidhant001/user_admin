"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/app/lib/data";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const router = useRouter();

  const handleLogin = () => {
    setLoading(true); 

    setTimeout(() => {


      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        alert("Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("users", JSON.stringify(users));

      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(user)
      )}; path=/`;

      if (user.role === "admin") {
        router.push("/admin/user");
      } else {
        router.push("/user/dashboard");
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

    

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 mt-3 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}