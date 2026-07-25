"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ExportModal from "./ExportModal";
import type { Issue } from "@/lib/types";

type HeaderProps = {
  issues?: Issue[];
  currentIssue?: Issue | null;
};

export default function Header({ issues = [], currentIssue }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const navLinks = [
    { label: "이번 달 호", href: "/" },
    { label: "지난 호", href: "/archive" },
    { label: "어드민", href: "/admin" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-600/30 bg-amber-50 shadow-xs transition duration-300 hover:border-amber-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-amber-700 transition duration-300 hover:scale-110"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
              </svg>
            </Link>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <Link href="/" className="font-cinzel text-lg font-bold tracking-wider text-slate-900 sm:text-xl hover:text-amber-800 transition">
                  Katholike Ekklesia
                </Link>
                <span className="hidden text-xs font-semibold tracking-wider text-slate-500 sm:inline-block">
                  월간 보편교회 웹진
                </span>
              </div>
              <a
                href="https://cafe.naver.com/bopyun"
                target="_blank"
                rel="noopener noreferrer"
                id="naver-cafe-btn"
                className="mt-0.5 inline-flex items-center gap-1.5 self-start rounded-md border border-emerald-200 bg-emerald-50/80 px-2 py-0.5 text-xs font-bold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 hover:text-emerald-950 shadow-2xs active:scale-95"
              >
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-emerald-600 text-[9px] font-black text-white">
                  N
                </span>
                <span>보편교회 네이버 카페로 이동</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5m0-4.5L8.25 15.75" />
                </svg>
              </a>
            </div>
          </div>

          {/* PC Horizontal Nav + Export Button */}
          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-slate-700 transition hover:text-amber-800"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 내보내기 (Export) 버튼 */}
            <button
              id="export-btn"
              type="button"
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-600/30 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition hover:border-amber-600 hover:bg-amber-100 shadow-2xs active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-amber-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>내보내기</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu (Sheet) */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Export Button */}
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="flex h-10 items-center gap-1 rounded-xl border border-amber-600/30 bg-amber-50 px-2.5 text-xs font-bold text-amber-900 shadow-xs"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-amber-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>내보내기</span>
            </button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                id="mobile-menu-trigger"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-amber-600 hover:text-amber-900 active:scale-95 shadow-xs"
                aria-label="메뉴 열기"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </SheetTrigger>

              <SheetContent side="right" className="w-[280px] border-l border-slate-200 bg-white p-6 text-slate-900 shadow-xl">
                <SheetHeader className="text-left border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-600/30 bg-amber-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-amber-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                      </svg>
                    </div>
                    <SheetTitle className="font-cinzel text-base font-bold text-slate-900">
                      Katholike Ekklesia
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-800 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900"
                    >
                      <span>{link.label}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  ))}
                </nav>

                <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                  © Katholike Ekklesia Web Magazine
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        issues={issues}
        currentIssue={currentIssue}
      />
    </>
  );
}
