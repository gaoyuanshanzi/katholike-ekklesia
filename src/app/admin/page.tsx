import type { Metadata } from "next";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getIssues } from "@/lib/issue-actions";
import type { Issue } from "@/lib/types";

export const metadata: Metadata = {
  title: "관리자 대시보드 | Katholike Ekklesia",
};

// 상태 배지 컴포넌트
function StatusBadge({ status }: { status: Issue["status"] }) {
  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        발행됨
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/30">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
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
    <div className="min-h-screen bg-[#0a0a14]">
      {/* 배경 장식 */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-600/10 to-transparent blur-3xl" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <AdminHeader />

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* 통계 그리드 */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "총 회차", value: issues.length, icon: "📰", color: "from-blue-500/10" },
            { label: "발행됨", value: published, icon: "✅", color: "from-emerald-500/10" },
            { label: "임시저장", value: drafts, icon: "📝", color: "from-amber-500/10" },
            { label: "총 기사", value: totalArticles, icon: "📄", color: "from-purple-500/10" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${s.color} to-transparent p-4 backdrop-blur-sm sm:p-5`}
            >
              <div className="text-xl sm:text-2xl">{s.icon}</div>
              <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
              <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 헤더 + 새 회차 버튼 */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">회차 목록</h1>
          <form action="/admin/issues/new" method="POST">
            <button
              id="new-issue-btn"
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500 active:scale-95"
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <p className="text-base font-medium text-slate-300">아직 등록된 회차가 없습니다.</p>
            <p className="mt-1 text-sm text-slate-500">위의 버튼을 눌러 첫 번째 회차를 생성해 보세요.</p>
          </div>
        ) : (
          <>
            {/* PC: 테이블 */}
            <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Vol</th>
                    <th className="px-6 py-4">제목</th>
                    <th className="px-6 py-4">발행일</th>
                    <th className="px-6 py-4">기사</th>
                    <th className="px-6 py-4">상태</th>
                    <th className="px-6 py-4 text-right">편집</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {issues.map((issue) => (
                    <tr key={issue.id} className="group transition hover:bg-white/5">
                      <td className="px-6 py-4 text-sm font-bold text-amber-400">
                        Vol.{issue.volume}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{issue.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(issue.publishDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {issue.articles.length}개
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/issues/${issue.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                          편집
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일: 카드 목록 */}
            <div className="space-y-3 md:hidden">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/admin/issues/${issue.id}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition active:scale-[0.98] hover:border-amber-500/20 hover:bg-white/8"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">Vol.{issue.volume}</span>
                        <StatusBadge status={issue.status} />
                      </div>
                      <p className="mt-1 font-medium text-white truncate">{issue.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(issue.publishDate)} · 기사 {issue.articles.length}개
                      </p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 h-4 w-4 shrink-0 text-slate-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
