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
    <section className="relative overflow-hidden bg-[#faf9f5] py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main Pastoral Image & Card Overlay Container */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-900/10 shadow-2xl">
          {/* Background Pastoral Village Watercolor Image */}
          <div className="relative aspect-[16/9] min-h-[380px] w-full sm:min-h-[460px] md:min-h-[520px]">
            <Image
              src={PASTORAL_HERO_IMAGE}
              alt="첨부된 산골 마을 수채화 그림"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-center transition duration-1000"
            />
            {/* Soft Warm Sunlight Light Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent sm:via-slate-900/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14">
            <div className="max-w-2xl text-white">
              {/* Vol Badge */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/20 px-3.5 py-1 text-xs font-bold tracking-wider text-amber-200 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Vol.{volume} · {formattedDate}
              </div>

              {/* Main Title Typography */}
              <h1 className="font-cinzel text-3xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">
                Katholike Ekklesia
              </h1>

              {/* Subtitle / Theme */}
              <p className="mt-2 font-serif text-xl font-bold text-amber-200 drop-shadow-sm sm:text-2xl md:text-3xl">
                {issueTitle}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-slate-100 sm:text-sm md:text-base max-w-xl drop-shadow-sm">
                산기슭 아래 소박한 오두막집과 들판 속에서 들려오는 평화의 종소리.
                보편되고 거룩한 교회의 신앙과 삶을 나누는 공간입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
