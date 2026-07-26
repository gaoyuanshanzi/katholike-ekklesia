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
  const totalViews = issues.reduce(
    (acc, i) => acc + i.articles.reduce((aAcc, a) => aAcc + (a.views || 0), 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <AdminHeader />

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* 통계 그리드 */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "총 회차", value: issues.length, icon: "📰", bg: "bg-blue-50/60 border-blue-200" },
            { label: "발행됨", value: published, icon: "✅", bg: "bg-emerald-50/60 border-emerald-200" },
            { label: "임시저장", value: drafts, icon: "📝", bg: "bg-amber-50/60 border-amber-200" },
            { label: "총 기사", value: totalArticles, icon: "📄", bg: "bg-purple-50/60 border-purple-200" },
            { label: "총 누적 클릭수", value: `${totalViews}회`, icon: "👁️", bg: "bg-rose-50/60 border-rose-200" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.bg} p-4 backdrop-blur-sm shadow-xs sm:p-5`}
            >
              <div className="text-xl sm:text-2xl">{s.icon}</div>
              <div className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{s.value}</div>
              <div className="mt-0.5 text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 헤더 + 새 회차 버튼 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">회차별 기사 클릭수 현황</h1>
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
          <div className="space-y-6">
            {issues.map((issue) => {
              const issueTotalViews = issue.articles.reduce(
                (acc, a) => acc + (a.views || 0),
                0
              );

              return (
                <div
                  key={issue.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-slate-300"
                >
                  {/* Vol 헤더 영역 */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                      <span className="text-base font-extrabold text-amber-700">
                        Vol.{issue.volume}
                      </span>
                      <StatusBadge status={issue.status} />
                      <h2 className="text-base font-bold text-slate-900 truncate">
                        {issue.title}
                      </h2>
                      <span className="text-xs font-medium text-slate-500">
                        ({formatDate(issue.publishDate)})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 해당 Vol 전체 클릭수 배지 */}
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800 shadow-2xs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-emerald-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Vol.{issue.volume} 전체 클릭수: <strong className="text-emerald-950 font-black">{issueTotalViews}회</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
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
                  </div>

                  {/* 기사 목록 상세 테이블 */}
                  <div className="p-4 sm:p-6">
                    {issue.articles.length === 0 ? (
                      <p className="py-2 text-xs font-semibold text-slate-400">등록된 기사가 없습니다.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-bold uppercase tracking-wider">
                              <th className="px-4 py-2.5">구분</th>
                              <th className="px-4 py-2.5">기사 제목</th>
                              <th className="px-4 py-2.5">작성자</th>
                              <th className="px-4 py-2.5 text-right">클릭수 (조회수)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {issue.articles.map((art) => (
                              <tr key={art.id} className="hover:bg-slate-50/80 transition">
                                <td className="px-4 py-3 font-bold text-amber-700 whitespace-nowrap">
                                  {art.order === 1 ? (
                                    <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-2xs font-extrabold text-amber-900 border border-amber-300">
                                      대표기사
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 font-semibold">기사 {art.order}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900">
                                  {art.title || `기사 ${art.order}`}
                                </td>
                                <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                                  {art.author || "편집부"}
                                </td>
                                <td className="px-4 py-3 text-right font-extrabold text-emerald-700 whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-emerald-600">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    </svg>
                                    <span>{art.views || 0}회</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
