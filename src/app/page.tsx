import Link from "next/link";
import Header from "@/components/main/Header";
import HeroSection from "@/components/main/HeroSection";
import FeaturedArticle from "@/components/main/FeaturedArticle";
import ArticleGrid from "@/components/main/ArticleGrid";
import Footer from "@/components/main/Footer";
import { getPublishedIssues } from "@/lib/public-actions";

export default async function HomePage() {
  const publishedIssues = await getPublishedIssues();
  const currentIssue = publishedIssues.length > 0 ? publishedIssues[0] : null;

  const heroArticle = currentIssue?.articles.find((a) => a.order === 1) || currentIssue?.articles[0];
  const subArticles = currentIssue?.articles.filter((a) => a.id !== heroArticle?.id) || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5] text-slate-900">
      <Header issues={publishedIssues} currentIssue={currentIssue} />

      <main className="flex-1">
        {/* Pastoral Village Hero Section */}
        <HeroSection
          volume={currentIssue?.volume ?? 1}
          issueTitle={currentIssue?.title ?? "새로운 호 준비 중"}
          publishDate={currentIssue?.publishDate ?? new Date().toISOString()}
        />

        {/* Main Content Area */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {heroArticle ? (
            <>
              <FeaturedArticle article={heroArticle} />
              {subArticles.length > 0 && <ArticleGrid articles={subArticles} />}
            </>
          ) : (
            <div className="my-6 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-md">
              <div className="mb-4 text-5xl">📰</div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">발행된 회차가 없습니다</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                현재 등록되거나 발행된 회차가 없습니다. 관리자 페이지에서 새로운 회차와 기사를 작성하신 후 [즉시 발행하기]를 누르시면 이곳에 노출됩니다.
              </p>
              <Link
                href="/admin"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-amber-700 hover:to-amber-800"
              >
                <span>관리자 페이지로 이동</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
