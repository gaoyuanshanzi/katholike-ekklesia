import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import MobileShareBar from "./MobileShareBar";
import { getArticleById } from "@/lib/public-actions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getArticleById(id);
  if (!result) return { title: "기사를 찾을 수 없습니다 | Katholike Ekklesia" };
  return {
    title: `${result.article.title} | Katholike Ekklesia`,
    description: result.article.description,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getArticleById(id);

  if (!result) {
    notFound();
  }

  const { article, issue } = result;

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5] text-slate-900">
      <Header />

      <main className="flex-1 pb-24">
        {/* Sub Header Navigation */}
        <div className="border-b border-slate-200 bg-white py-3 shadow-xs">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 text-xs font-semibold text-slate-600">
            <Link
              href="/"
              className="flex items-center gap-1.5 transition hover:text-amber-800"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>이번 달 호로 돌아가기</span>
            </Link>
            <span className="font-bold text-amber-800">
              Vol.{issue.volume} · {issue.title}
            </span>
          </div>
        </div>

        {/* Reading Container: Restricted to Max Width 768px */}
        <article className="mx-auto max-w-[768px] px-4 pt-10 sm:px-6 sm:pt-14">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                기사 {article.order}
              </span>
              {article.isFeatured && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
                  대표기사
                </span>
              )}
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[40px] md:leading-[1.25]">
              {article.title}
            </h1>

            {/* Author & Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-slate-200 py-4 text-xs text-slate-600 sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-serif font-bold text-amber-900 border border-amber-200">
                  {article.author ? article.author[0] : "K"}
                </div>
                <span className="font-bold text-slate-800">{article.author || "편집부"}</span>
              </div>
              <span>·</span>
              <span>{article.readTime}분 읽기</span>
              <span>·</span>
              <span>{new Date(issue.publishDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </header>

          {/* Featured Cover Image */}
          {article.coverImageUrl && (
            <figure className="mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover object-center"
                />
              </div>
              {article.description && (
                <figcaption className="bg-slate-100 px-4 py-3 text-center text-xs font-medium text-slate-600 border-t border-slate-200">
                  {article.description}
                </figcaption>
              )}
            </figure>
          )}

          {/* Body Content (Font size 17.5px, line-height 1.75 for maximum reading comfort) */}
          <div
            className="prose prose-slate max-w-none font-serif text-[17.5px] leading-[1.75] text-slate-800 prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:mb-6 prose-blockquote:border-amber-600 prose-blockquote:bg-amber-50/50 prose-blockquote:p-4 prose-blockquote:text-amber-950"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* End Divider */}
          <div className="my-14 flex items-center justify-center gap-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600/40" />
            <div className="h-2 w-2 rotate-45 border border-amber-600 bg-amber-100" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600/40" />
          </div>

          {/* Next / Previous Article Navigation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              {issue.title} 다른 기사 읽기
            </h3>
            <div className="space-y-2">
              {issue.articles
                .filter((a) => a.id !== article.id)
                .map((a) => (
                  <Link
                    key={a.id}
                    href={`/article/${a.id}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                  >
                    <span className="truncate">
                      {a.order}. {a.title}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </main>

      {/* Mobile Sticky Share Bar */}
      <MobileShareBar title={article.title} />

      <Footer />
    </div>
  );
}
