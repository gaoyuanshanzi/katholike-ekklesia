import type { Metadata } from "next";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteIssueButton from "@/components/admin/DeleteIssueButton";
import { getIssues } from "@/lib/issue-actions";
import type { Issue } from "@/lib/types";

// 쿠키 기반 데이터를 매 요청마다 읽기 위해 강제 동적 렌더링
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 대시보드 | Katholike Ekklesia",
};

function StatusBadge({ status }: { status: Issue["status"] }) {
  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 ring-1 ring-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        발행됨
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 ring-1 ring-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
      임시저장
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default async function AdminDashboardPage() {
  const issues = await getIssues();
  const published = issues.filter((i) => i.status === "PUBLISHED").length;
  const drafts = issues.filter((i) => i.status === "DRAFT").length;
  const totalArticles = issues.reduce((acc, i) => acc + i.articles.length, 0);

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <AdminHeader />

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* 통계 그리드 */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "총 회차", value: issues.length, icon: "📰", bg: "bg-blue-50/60 border-blue-200" },
            { label: "발행됨", value: published, icon: "✅", bg: "bg-emerald-50/60 border-emerald-200" },
            { label: "임시저장", value: drafts, icon: "📝", bg: "bg-amber-50/60 border-amber-200" },
            { label: "총 기사", value: totalArticles, icon: "📄", bg: "bg-purple-50/60 border-purple-200" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.bg} p-4 backdrop-blur-sm shadow-xs sm:p-5`}
            >
              <div className="text-xl sm:text-2xl">{s.icon}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{s.value}</div>
              <div className="mt-0.5 text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 헤더 + 새 회차 버튼 */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">회차 목록</h1>
          <form action="/admin/issues/new" method="POST">
            <button
              id="new-issue-btn"
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-amber-700 hover:to-amber-800 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              새 회차 생성
            </button>
          </form>
        </div>

        {issues.length === 0 ? (
          /* 빈 상태 */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-xs">
            <div className="mb-4 text-5xl">📭</div>
            <p className="text-base font-bold text-slate-800">아직 등록된 회차가 없습니다.</p>
            <p className="mt-1 text-sm text-slate-500">위의 버튼을 눌러 첫 번째 회차를 생성해 보세요.</p>
          </div>
        ) : (
          <>
            {/* PC: 테이블 */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">VOL</th>
                    <th className="px-6 py-4">제목</th>
                    <th className="px-6 py-4">발행일</th>
                    <th className="px-6 py-4">기사</th>
                    <th className="px-6 py-4">상태</th>
                    <th className="px-6 py-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => (
                    <tr key={issue.id} className="group transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-extrabold text-amber-700">
                        Vol.{issue.volume}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{issue.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {formatDate(issue.publishDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {issue.articles.length}개
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/issues/${issue.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 shadow-2xs"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                            편집
                          </Link>
                          <DeleteIssueButton issueId={issue.id} volume={issue.volume} title={issue.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일: 카드 목록 */}
            <div className="space-y-3 md:hidden">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-amber-700">Vol.{issue.volume}</span>
                        <StatusBadge status={issue.status} />
                      </div>
                      <p className="mt-1 font-bold text-slate-900 truncate">{issue.title}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {formatDate(issue.publishDate)} · 기사 {issue.articles.length}개
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <Link
                      href={`/admin/issues/${issue.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 shadow-2xs"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                      편집
                    </Link>
                    <DeleteIssueButton issueId={issue.id} volume={issue.volume} title={issue.title} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
