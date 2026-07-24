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
    <div className="flex min-h-screen flex-col bg-[#0a0a14] text-slate-100">
      <Header />

      <main className="flex-1 pb-20 pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header Banner */}
          <div className="mb-10 text-center sm:text-left">
            <span className="font-cinzel text-xs font-semibold uppercase tracking-widest text-amber-400">
              ARCHIVE
            </span>
            <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              지난 호 보기
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              보편되고 거룩한 교회의 지나온 메시지와 기사들을 모아봅니다.
            </p>
          </div>

          {/* Grid Layout: PC 3-col / Mobile 1-col */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => {
              const heroArt = issue.articles.find((a) => a.order === 1) || issue.articles[0];
              const coverUrl = heroArt?.coverImageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

              return (
                <article
                  key={issue.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 hover:border-amber-500/40 hover:bg-white/8 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10">
                    <Image
                      src={coverUrl}
                      alt={issue.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-md">
                      Vol.{issue.volume}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-xs font-medium text-amber-200/90">
                      {new Date(issue.publishDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h2 className="font-serif text-xl font-bold leading-snug text-white transition duration-300 group-hover:text-amber-200">
                        {issue.title}
                      </h2>
                      <p className="mt-2 text-xs text-slate-400">
                        총 {issue.articles.length}개의 기사 수록
                      </p>
                    </div>

                    {/* Article Previews */}
                    {heroArt && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-300">
                        {heroArt.title}
                      </p>
                    )}

                    <div className="mt-5 border-t border-white/5 pt-4">
                      {heroArt ? (
                        <Link
                          href={`/article/${heroArt.id}`}
                          className="flex items-center justify-between text-xs font-semibold text-amber-400 transition group-hover:text-amber-300"
                        >
                          <span>이 호 읽어보기</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition group-hover:translate-x-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500">준비 중</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
