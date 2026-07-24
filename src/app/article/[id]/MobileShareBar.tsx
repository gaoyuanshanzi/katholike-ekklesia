"use client";

import { useState } from "react";

export default function MobileShareBar({
  title,
  onFontScale,
}: {
  title: string;
  onFontScale?: (scale: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [fontScaleIndex, setFontScaleIndex] = useState(1);
  const fontScales = [16, 18, 20];

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function toggleFont() {
    const nextIdx = (fontScaleIndex + 1) % fontScales.length;
    setFontScaleIndex(nextIdx);
    if (onFontScale) {
      onFontScale(fontScales[nextIdx]);
    }
  }

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <aside
      aria-label="기사 독서 도구"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md md:hidden text-slate-900"
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-slate-600 max-w-[160px]">
          {title}
        </span>

        <div className="flex items-center gap-2">
          {/* 폰트 크기 변경 */}
          <button
            type="button"
            onClick={toggleFont}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition active:scale-95"
            title="글자 크기 변경"
          >
            <span className="font-serif">가</span>
            <span className="text-3xs text-amber-700">{fontScales[fontScaleIndex]}px</span>
          </button>

          {/* 공유 버튼 */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-amber-600/40 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-amber-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0 10.628a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
            </svg>
            {copied ? "복사됨!" : "공유"}
          </button>

          {/* 맨 위로 */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition active:scale-95"
            aria-label="맨 위로 스크롤"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
