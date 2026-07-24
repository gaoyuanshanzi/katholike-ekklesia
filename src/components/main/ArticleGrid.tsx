import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

export default function ArticleGrid({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-cinzel text-lg font-bold tracking-wider text-slate-900 sm:text-xl">
          주요 기사
        </h2>
        <span className="text-xs font-medium text-slate-500">{articles.length}개의 기사</span>
      </div>

      {/* PC: 2x2 Grid / Mobile: 1-col */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-lg active:scale-[0.99]"
          >
            <div>
              {/* Cover Image */}
              <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-100">
                <Image
                  src={article.coverImageUrl || "/images/pastoral_village.jpg"}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-3xs font-bold text-amber-300 backdrop-blur-md">
                  기사 {article.order}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.readTime}분 읽기</span>
              </div>

              <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-slate-900 transition duration-300 group-hover:text-amber-800">
                {article.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {article.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-amber-700 group-hover:text-amber-900">
              <span>읽어보기</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
