import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

export default function ArticleGrid({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-cinzel text-lg font-bold tracking-wider text-amber-200 sm:text-xl">
          이번 달 주요 기사
        </h2>
        <span className="text-xs text-slate-500">{articles.length}개의 기사</span>
      </div>

      {/* PC: 2x2 Grid / Mobile: 1-col */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:bg-white/8 hover:shadow-xl hover:shadow-amber-500/5 active:scale-[0.99]"
          >
            <div>
              {/* Cover Image */}
              <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={article.coverImageUrl || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-3xs font-semibold text-amber-300 backdrop-blur-md">
                  기사 {article.order}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.readTime}분 읽기</span>
              </div>

              <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-white transition duration-300 group-hover:text-amber-200">
                {article.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                {article.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs font-semibold text-amber-400/90 group-hover:text-amber-300">
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
