"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Admin Login</h2>
          <p className="text-slate-500 mt-2">Sign in to manage Zain Manzoor Construction</p>
        </div>
        {error && <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm text-center font-medium">{error}</div>}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition outline-none" required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200">Sign In</button>
        </div>
      </form>
    </div>
  );
}
