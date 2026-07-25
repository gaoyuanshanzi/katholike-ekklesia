import { readIssuesAsync } from "./data";
import type { Issue, Article } from "./types";

export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

// ── 발행된 전체 회차 목록 조회 ────────────────────────────────────
export async function getPublishedIssues(): Promise<Issue[]> {
  const allIssues = await readIssuesAsync();
  const published = allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (published.length > 0) {
    return published;
  }

  // 예외 방어: 만약 기사가 1개 이상 등록된 회차가 있으면 해당 회차를 기본 반환
  const withArticles = allIssues
    .filter((i) => i.articles && i.articles.length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (withArticles.length > 0) {
    return withArticles;
  }

  return [];
}

// ── 최신 발행 회차 1건 조회 ───────────────────────────────────────
export async function getLatestPublishedIssue(): Promise<Issue | null> {
  const issues = await getPublishedIssues();
  return issues.length > 0 ? issues[0] : null;
}

// ── 기사 단건 조회 ────────────────────────────────────────────────
export async function getArticleById(
  id: string
): Promise<{ article: Article; issue: Issue } | null> {
  const allIssues = await readIssuesAsync();
  for (const issue of allIssues) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) return { article: found, issue };
  }
  return null;
}

// ── 호환성 유지용 빈 함수 ─────────────────────────────────────────
export async function syncPublishedIssuesToCookie(_issues: Issue[]) {}
export async function syncArticleToCookie(_issue: Issue) {}
