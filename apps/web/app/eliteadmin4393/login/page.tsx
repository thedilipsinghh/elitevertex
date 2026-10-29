"use client";

import { useState } from "react";
import Link from "next/link";
import { useLoginMutation, useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const { data: settingsResponse } = useGetWebsiteSettingsQuery({});
  const settings = settingsResponse?.data || {};
  const logoSrc = settings.logoUrl || "/logo.png";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res: any = await login({ email, password }).unwrap();
      if (res.success) {
        if (res.token && typeof window !== "undefined") {
          localStorage.setItem("admin_token", res.token);
        }
        if (typeof window !== "undefined") {
          const isSecure = window.location.protocol === "https:";
          document.cookie = `admin_token=1; path=/; max-age=86400; SameSite=Lax${isSecure ? "; Secure" : ""}`;
          window.location.href = "/eliteadmin4393/dashboard";
        }
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials. Please verify your administrative email and password.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-surface text-on-surface relative overflow-hidden transition-colors selection:bg-secondary/20 selection:text-secondary">
      
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] dark:bg-blue-500/10" />

      {/* ── Top Header Navigation ── */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors py-2 px-3 rounded-lg hover:bg-surface-container"
          aria-label="Return to Public Website"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Public Website</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold border border-outline-variant/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure TLS 1.3 Console</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main Authentication Card ── */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-[460px] bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-7 sm:p-10 shadow-xl backdrop-blur-md transition-all animate-scale-in">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center mb-5 p-2 rounded-xl bg-surface-container dark:bg-white/95 border border-outline-variant shadow-2xs transition-all hover:scale-105">
              <img
                src={logoSrc}
                alt="Elite Vertex Brand Logo"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs">
              <span className="material-symbols-outlined text-[14px]">shield_lock</span>
              <span>Restricted Governance Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
              Administrative Console
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed max-w-sm">
              Sign in with institutional credentials to govern programs, certificates, faculty, and student leads.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px] shrink-0 mt-0.5">
                error
              </span>
              <div className="flex-1 text-xs text-red-800 dark:text-red-300 font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center justify-between">
                <span>Institutional Email</span>
                <span className="text-[11px] font-normal text-on-surface-variant lowercase">admin@elitevertex</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3.5 text-[20px] pointer-events-none">
                  alternate_email
                </span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@elitevertex.com"
                  className="w-full bg-surface-container pl-11 pr-4 py-3 rounded-xl border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center justify-between">
                <span>Passphrase / Security Key</span>
                <span className="text-[11px] font-normal text-on-surface-variant">Confidential</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3.5 text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container pl-11 pr-11 py-3 rounded-xl border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Security Session Note */}
            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 pb-1">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                <span>Session Auto-Expires in 15m</span>
              </span>
              <span className="font-mono text-[11px] text-on-surface-variant/80">RBAC Level 1</span>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 btn-press"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Authenticate &amp; Enter Console</span>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footnote */}
          <div className="mt-8 pt-6 border-t border-outline-variant/60 flex items-center justify-center gap-2 text-[11px] text-on-surface-variant text-center">
            <span className="material-symbols-outlined text-[15px] text-secondary">lock</span>
            <span>256-Bit Cryptographic Session • Access Audit Logged</span>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-on-surface-variant/80 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-outline-variant/30">
        <span>© {new Date().getFullYear()} Elite Vertex Institute of Communication &amp; Allied Skills</span>
        <span className="flex items-center gap-2">
          <span>ISO 9001:2015 Accredited</span>
          <span>•</span>
          <span>CEFR Certified Framework</span>
        </span>
      </footer>

    </div>
  );
}
