import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

type AdminHeaderProps = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
};

export default function AdminHeader({
  title = "Katholike Ekklesia",
  subtitle = "관리자 대시보드",
  backHref,
  backLabel,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* 왼쪽: 뒤로가기 또는 로고 */}
        <div className="flex items-center gap-3 min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              aria-label={backLabel ?? "뒤로가기"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <div className="flex items-center gap-2.5 min-w-0">
            {!backHref && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-600/30 bg-amber-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-amber-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{title}</p>
              <p className="truncate text-xs font-medium text-slate-500">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 로그아웃 */}
        <form action={logoutAdmin} className="shrink-0">
          <button
            id="logout-btn"
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-95 shadow-2xs"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            로그아웃
          </button>
        </form>
      </div>
    </header>
  );
}
