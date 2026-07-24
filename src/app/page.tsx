import Header from "@/components/main/Header";
import HeroSection from "@/components/main/HeroSection";
import FeaturedArticle from "@/components/main/FeaturedArticle";
import ArticleGrid from "@/components/main/ArticleGrid";
import Footer from "@/components/main/Footer";
import { getLatestPublishedIssue } from "@/lib/public-actions";

export default async function HomePage() {
  const currentIssue = await getLatestPublishedIssue();

  // Find Hero Article (#1) and Sub-articles (#2..#5)
  const heroArticle =
    currentIssue.articles.find((a) => a.order === 1) ||
    currentIssue.articles[0];
  const subArticles = currentIssue.articles.filter(
    (a) => a.id !== heroArticle?.id
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a14] text-slate-100">
      <Header />

      <main className="flex-1">
        {/* Pastoral Village Hero Section */}
        <HeroSection
          volume={currentIssue.volume}
          issueTitle={currentIssue.title}
          publishDate={currentIssue.publishDate}
        />

        {/* Main Content Area */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {heroArticle && <FeaturedArticle article={heroArticle} />}
          {subArticles.length > 0 && <ArticleGrid articles={subArticles} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
