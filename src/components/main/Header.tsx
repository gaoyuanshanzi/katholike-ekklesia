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

export default function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "이번 달 호", href: "/" },
    { label: "지난 호", href: "/archive" },
    { label: "어드민", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo & Title */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-600/30 bg-amber-500/10 shadow-xs transition duration-300 group-hover:border-amber-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 text-amber-700 transition duration-300 group-hover:scale-110"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <div>
            <span className="font-cinzel text-lg font-bold tracking-wider text-slate-900 sm:text-xl">
              Katholike Ekklesia
            </span>
            <span className="ml-2 hidden text-2xs uppercase tracking-widest text-slate-500 sm:inline-block">
              월간 보편교회 웹진
            </span>
          </div>
        </Link>

        {/* PC Horizontal Nav */}
        <nav className="hidden items-center gap-8 md:flex">
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

        {/* Mobile Hamburger Menu (Sheet) */}
        <div className="md:hidden">
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
  );
}
