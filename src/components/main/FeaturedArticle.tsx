import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section className="mb-12">
      <Link
        href={`/article/${article.id}`}
        className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl sm:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Cover Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm lg:col-span-6">
            <Image
              src={article.coverImageUrl || "/images/pastoral_village.jpg"}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition duration-700 group-hover:scale-105"
            />
            <span className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-white shadow-sm">
              Hero 대표기사
            </span>
          </div>

          {/* Right: Typography & Meta */}
          <div className="flex flex-col justify-between lg:col-span-6 lg:py-2">
            <div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.readTime}분 읽기</span>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-bold leading-snug text-slate-900 transition duration-300 group-hover:text-amber-800 sm:text-3xl lg:text-3xl">
                {article.title}
              </h2>

              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {article.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-amber-700 transition group-hover:translate-x-1 group-hover:text-amber-900">
              <span>기사 전체 읽기</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
