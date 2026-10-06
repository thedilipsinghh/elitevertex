"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/features/api/apiSlice";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password }).unwrap();
      if (res.success) {
        // Hard redirect to ensure middleware picks up the new HttpOnly cookie fresh
        window.location.href = "/eliteadmin4393/courses";
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-space-xl rounded-xl shadow-md border border-outline-variant">
        <div className="text-center mb-space-lg">
          <h1 className="font-display text-headline-md text-on-surface mb-2">Elite Admin</h1>
          <p className="text-body-md text-on-surface-variant">Sign in to manage content.</p>
        </div>
        
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Email Address</label>
            <input
              type="email"
              required
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Password</label>
            <input
              type="password"
              required
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
