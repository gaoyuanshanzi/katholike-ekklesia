import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { getPublishedIssues } from "@/lib/public-actions";

export const metadata: Metadata = {
  title: "지난 호 보기 (Archive) | Katholike Ekklesia",
  description: "Katholike Ekklesia 웹진의 지난 회차 모음",
};

export default async function ArchivePage() {
  const issues = await getPublishedIssues();

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5] text-slate-900">
      <Header issues={issues} />

      <main className="flex-1 pb-20 pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header Banner */}
          <div className="mb-10 text-center sm:text-left">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-800">
              ARCHIVE
            </span>
            <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              지난 호 보기
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600">
              보편되고 거룩한 교회의 지나온 메시지와 기사들을 모아봅니다.
            </p>
          </div>

          {issues.length === 0 ? (
            <div className="my-10 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-md">
              <div className="mb-4 text-5xl">📭</div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">아직 발행된 호가 없습니다</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                현재 등록되거나 발행된 회차가 존재하지 않습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {issues.map((issue) => {
                const heroArt = issue.articles.find((a) => a.order === 1) || issue.articles[0];
                const coverUrl = heroArt?.coverImageUrl || "/images/pastoral_village.jpg";

                return (
                  <article
                    key={issue.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:border-amber-400 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100">
                      <Image
                        src={coverUrl}
                        alt={issue.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                        Vol.{issue.volume}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-white drop-shadow-sm">
                        {new Date(issue.publishDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h2 className="font-serif text-xl font-bold leading-snug text-slate-900 transition duration-300 group-hover:text-amber-800">
                          {issue.title}
                        </h2>
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          총 {issue.articles.length}개의 기사 수록
                        </p>
                      </div>

                      {heroArt && (
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                          {heroArt.title}
                        </p>
                      )}

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        {heroArt ? (
                          <Link
                            href={`/article/${heroArt.id}`}
                            className="flex items-center justify-between text-xs font-bold text-amber-700 transition group-hover:text-amber-900"
                          >
                            <span>이 호 읽어보기</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition group-hover:translate-x-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">준비 중</span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
