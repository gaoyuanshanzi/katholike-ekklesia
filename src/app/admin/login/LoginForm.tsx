"use client";

import { useActionState } from "react";
import { loginAdmin, type ActionResponse } from "@/app/admin/actions";

const initialState: ActionResponse = undefined;

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-slate-300">
          관리자 ID
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          placeholder="아이디를 입력하세요"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-500 outline-none ring-0 transition duration-200 focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/20"
          style={{ fontSize: "16px" }}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="비밀번호를 입력하세요"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-500 outline-none ring-0 transition duration-200 focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/20"
          style={{ fontSize: "16px" }}
        />
      </div>

      <button
        id="login-submit-btn"
        type="submit"
        disabled={isPending}
        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            로그인 중...
          </span>
        ) : (
          "로그인"
        )}
      </button>
    </form>
  );
}
