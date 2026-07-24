import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인 | Katholike Ekklesia",
  description: "Katholike Ekklesia 웹진 관리자 로그인",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a14] px-4 py-12">
      {/* Decorative Background Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-600/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-purple-800/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-indigo-800/15 to-transparent blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          {/* Cross icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-700/10 shadow-lg shadow-amber-500/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8 text-amber-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
            </svg>
          </div>

          <h1 className="bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            Katholike Ekklesia
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">관리자 전용 페이지</p>
        </div>

        {/* Glass Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">로그인</h2>
            <p className="mt-1 text-sm text-slate-400">
              관리자 계정으로 로그인하세요.
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Katholike Ekklesia. All rights reserved.
        </p>
      </div>
    </main>
  );
}
