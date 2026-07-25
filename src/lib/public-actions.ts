import { cookies } from "next/headers";
import { readIssues } from "./data";
import type { Issue, Article } from "./types";

export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

export async function getLatestPublishedIssue(): Promise<Issue | null> {
  // 1. 메모리/파일 스토리지 조회
  const allIssues = readIssues();
  const published = allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (published.length > 0) {
    return published[0];
  }

  // 2. Vercel 서버리스 람다 간 인스턴스 전환 대응 쿠키 복원
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("latest_published_issue")?.value;
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal) as Issue;
      if (parsed && parsed.status === "PUBLISHED" && parsed.articles?.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore cookie read errors
  }

  return null;
}

export async function getPublishedIssues(): Promise<Issue[]> {
  const allIssues = readIssues();
  const published = allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (published.length > 0) {
    return published;
  }

  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("latest_published_issue")?.value;
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal) as Issue;
      if (parsed && parsed.status === "PUBLISHED" && parsed.articles?.length > 0) {
        return [parsed];
      }
    }
  } catch {
    // Ignore
  }

  return [];
}

export async function getArticleById(id: string): Promise<{ article: Article; issue: Issue } | null> {
  const allIssues = readIssues();

  for (const issue of allIssues) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) {
      return { article: found, issue };
    }
  }

  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("latest_published_issue")?.value;
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal) as Issue;
      const found = parsed.articles?.find((a) => a.id === id);
      if (found) {
        return { article: found, issue: parsed };
      }
    }
  } catch {
    // Ignore
  }

  return null;
}
