import { NextResponse } from "next/server";
import prisma, { NEON_DATABASE_URL } from "@/lib/db";
import { getPublishedIssues } from "@/lib/public-actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const debugInfo: Record<string, unknown> = {
    envDatabaseUrlSet: !!process.env.DATABASE_URL,
    fallbackUrlUsed: NEON_DATABASE_URL.substring(0, 35) + "...",
  };

  try {
    const directPrismaIssues = await prisma.issue.findMany({
      include: { articles: true },
    });
    debugInfo.directPrismaCount = directPrismaIssues.length;
    debugInfo.directPrismaIssues = directPrismaIssues;
  } catch (err: unknown) {
    const errorObj = err as Error;
    debugInfo.directPrismaError = errorObj?.message || String(err);
    debugInfo.directPrismaStack = errorObj?.stack || "";
  }

  try {
    const published = await getPublishedIssues();
    debugInfo.getPublishedCount = published.length;
  } catch (err: unknown) {
    const errorObj = err as Error;
    debugInfo.getPublishedError = errorObj?.message || String(err);
  }

  return NextResponse.json(debugInfo);
}
