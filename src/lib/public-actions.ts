import { readIssuesAsync, readIssueAsync } from "./data";
import type { Issue, Article } from "./types";

export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

// ── 발행된 전체 회차 목록 조회 ────────────────────────────────────
export async function getPublishedIssues(): Promise<Issue[]> {
  const allIssues = await readIssuesAsync();
  return allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

// ── 쿠키 동기화 함수 (DB 전환 후 더 이상 필요 없음, 호환성 유지) ─
export async function syncPublishedIssuesToCookie(_issues: Issue[]) {
  // DB 사용 시 쿠키 동기화 불필요
}
export async function syncArticleToCookie(_issue: Issue) {
  // DB 사용 시 쿠키 동기화 불필요
}
