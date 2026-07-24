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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a14]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo & Title */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent shadow-md shadow-amber-500/10 transition duration-300 group-hover:border-amber-400 group-hover:shadow-amber-500/25">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 text-amber-400 transition duration-300 group-hover:scale-110"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <div>
            <span className="font-cinzel text-lg font-bold tracking-wider text-transparent bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text sm:text-xl">
              Katholike Ekklesia
            </span>
            <span className="ml-2 hidden text-2xs uppercase tracking-widest text-slate-400 sm:inline-block">
              월간 가톨릭 웹진
            </span>
          </div>
        </Link>

        {/* PC Horizontal Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-amber-300"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-amber-500/40 hover:text-white active:scale-95"
              aria-label="메뉴 열기"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] border-l border-white/10 bg-[#0c0c18] p-6 text-slate-100 backdrop-blur-2xl">
              <SheetHeader className="text-left border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-amber-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                    </svg>
                  </div>
                  <SheetTitle className="font-cinzel text-base font-bold text-amber-200">
                    Katholike Ekklesia
                  </SheetTitle>
                </div>
              </SheetHeader>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-base font-medium text-slate-200 transition hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-300"
                  >
                    <span>{link.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </nav>

              <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
                © Katholike Ekklesia Web Magazine
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
