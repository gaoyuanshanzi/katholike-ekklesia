import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section className="mb-14">
      <Link
        href={`/article/${article.id}`}
        className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:bg-white/8 hover:shadow-2xl hover:shadow-amber-500/10 sm:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Cover Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 shadow-md lg:col-span-6">
            <Image
              src={article.coverImageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-amber-500/90 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-black backdrop-blur-md">
              Hero 대표기사
            </span>
          </div>

          {/* Right: Typography & Meta */}
          <div className="flex flex-col justify-between lg:col-span-6 lg:py-2">
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.readTime}분 읽기</span>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-bold leading-snug text-white transition duration-300 group-hover:text-amber-200 sm:text-3xl lg:text-3xl">
                {article.title}
              </h2>

              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                {article.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-amber-400 transition group-hover:translate-x-1 group-hover:text-amber-300">
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
