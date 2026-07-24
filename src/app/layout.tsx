import type { Metadata, Viewport } from "next";
import { Cinzel, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Katholike Ekklesia | 월간 가톨릭 웹진",
  description: "Katholike Ekklesia - 보편되고 거룩한 교회의 신앙과 삶을 나누는 월간 웹진",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${cinzel.variable} ${notoSerifKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a14] text-slate-100">{children}</body>
    </html>
  );
}
