"use client";

import { useActionState } from "react";
import { loginAdmin, type ActionResponse } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    loginAdmin,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-xs font-bold text-slate-700 mb-1.5">
          관리자 ID
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="off"
          placeholder="아이디 입력"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
          style={{ fontSize: "16px" }}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="비밀번호 입력"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
          style={{ fontSize: "16px" }}
        />
      </div>

      <button
        id="login-submit-btn"
        type="submit"
        disabled={isPending}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 py-3.5 text-sm font-bold text-white shadow-md transition hover:from-amber-700 hover:to-amber-800 active:scale-95 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>로그인 중...</span>
          </>
        ) : (
          <span>로그인</span>
        )}
      </button>
    </form>
  );
}
