import Image from "next/image";
import { PASTORAL_HERO_IMAGE } from "@/lib/public-actions";

type HeroProps = {
  volume: number;
  issueTitle: string;
  publishDate: string;
};

export default function HeroSection({ volume, issueTitle, publishDate }: HeroProps) {
  const formattedDate = new Date(publishDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  return (
    <section className="relative overflow-hidden bg-[#090912] text-white">
      {/* Background Image Container with Soft Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src={PASTORAL_HERO_IMAGE}
          alt="목가적인 시골 마을과 푸른 들판"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.75] contrast-[1.05] transition-transform duration-1000 scale-105"
        />
        {/* Multi-layered Warm Pastoral Dark Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/65 to-[#0a0a14]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14]/80 via-transparent to-[#0a0a14]/60" />
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 md:py-36">
        <div className="max-w-2xl">
          {/* Issue Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Vol.{volume} · {formattedDate}
          </div>

          {/* Main Title Typography */}
          <h1 className="font-cinzel text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Katholike Ekklesia
          </h1>

          {/* Subtitle / Theme */}
          <p className="mt-3 font-serif text-xl font-medium text-amber-200/90 sm:text-2xl md:text-3xl">
            {issueTitle}
          </p>

          <p className="mt-4 text-sm font-normal leading-relaxed text-slate-300 sm:text-base md:text-lg">
            산기슭 아래 소박한 마을과 들판 속에서 들려오는 저녁 종소리.
            보편되고 거룩한 교회의 신앙과 삶을 나누는 공간입니다.
          </p>

          {/* Decorative Divider */}
          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-amber-400 to-transparent" />
            <span className="font-cinzel text-xs font-semibold tracking-widest text-amber-400/80">
              MONTHLY CATHOLIC WEB MAGAZINE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
