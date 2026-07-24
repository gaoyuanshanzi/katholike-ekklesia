import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인 | Katholike Ekklesia",
  description: "Katholike Ekklesia 웹진 관리자 로그인",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf9f5] px-4 py-12">
      {/* Decorative Background Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200/40 to-transparent blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-600/30 bg-amber-50 shadow-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8 text-amber-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
            </svg>
          </div>

          <h1 className="font-cinzel text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Katholike Ekklesia
          </h1>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">관리자 전용 로그인</p>
        </div>

        {/* Glass Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">로그인</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              관리자 계정으로 로그인하세요.
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} Katholike Ekklesia. All rights reserved.
        </p>
      </div>
    </main>
  );
}
