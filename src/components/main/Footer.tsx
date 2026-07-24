import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070710] py-12 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
              </svg>
            </div>
            <div>
              <span className="font-cinzel text-base font-bold text-white">Katholike Ekklesia</span>
              <p className="text-xs text-slate-500">월간 가톨릭 웹진</p>
            </div>
          </div>

          <div className="flex gap-6 text-xs text-slate-400">
            <Link href="/" className="hover:text-amber-300">이번 달 호</Link>
            <Link href="/archive" className="hover:text-amber-300">지난 호 보기</Link>
            <Link href="/admin" className="hover:text-amber-300">관리자</Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Katholike Ekklesia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
