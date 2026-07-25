import { readIssues } from "./data";
import type { Issue, Article } from "./types";

// ──────────────────────────────────────────────
// 첨부된 목가적 시골 마을 수채화 이미지
// ──────────────────────────────────────────────
export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

// ──────────────────────────────────────────────
// 공개 액션 함수들 (임시 더미 데이터 모두 제거)
// ──────────────────────────────────────────────
export async function getLatestPublishedIssue(): Promise<Issue | null> {
  const allIssues = readIssues();
  const published = allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (published.length > 0) {
    return published[0];
  }

  // 발행된 호가 없으면 null 반환 (더미 데이터 제거)
  return null;
}

export async function getPublishedIssues(): Promise<Issue[]> {
  const allIssues = readIssues();
  return allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getArticleById(id: string): Promise<{ article: Article; issue: Issue } | null> {
  const allIssues = readIssues();

  for (const issue of allIssues) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) {
      return { article: found, issue };
    }
  }

  return null;
}
