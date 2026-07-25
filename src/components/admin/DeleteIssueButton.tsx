"use client";

import { useState, useTransition } from "react";
import { deleteIssue } from "@/lib/issue-actions";

interface Props {
  issueId: string;
  volume: number;
  title: string;
}

export default function DeleteIssueButton({ issueId, volume, title }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteIssue(issueId);
      if (!result.ok) {
        setError(result.error ?? "삭제 중 오류가 발생했습니다.");
        setShowConfirm(false);
      }
      // 성공 시 revalidatePath가 페이지를 자동 갱신
    });
  }

  return (
    <>
      {/* 제거 버튼 */}
      <button
        id={`delete-issue-btn-${issueId}`}
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:border-red-400 hover:bg-red-100 hover:text-red-900 shadow-2xs"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        제거
      </button>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      {/* 확인 다이얼로그 오버레이 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* 아이콘 */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            {/* 제목 & 설명 */}
            <h2 className="text-center text-base font-bold text-slate-900 mb-1">
              Vol.{volume} 제거
            </h2>
            <p className="text-center text-sm text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">"{title}"</span>
            </p>
            <p className="text-center text-sm text-slate-500 mb-6">
              이 호의 모든 기사가 영구적으로 삭제됩니다.<br />
              <span className="font-bold text-red-600">다른 호의 번호는 변경되지 않습니다.</span>
            </p>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-red-700 hover:to-red-800 active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    삭제 중...
                  </span>
                ) : (
                  "영구 삭제"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
