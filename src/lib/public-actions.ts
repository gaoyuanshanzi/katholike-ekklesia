import { cookies } from "next/headers";
import { readIssues } from "./data";
import type { Issue, Article } from "./types";

export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

// 쿠키 이름 (모든 발행 회차 배열을 직렬화하여 저장)
const COOKIE_NAME = "ke_published_issues";

// ── 쿠키에서 발행 회차 배열 읽기 ──────────────────────────────────
async function getPublishedFromCookie(): Promise<Issue[]> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(COOKIE_NAME)?.value;
    if (!val) return [];
    const parsed = JSON.parse(val);
    if (!Array.isArray(parsed)) return [];
    return parsed as Issue[];
  } catch {
    return [];
  }
}

// ── 발행 회차 배열을 쿠키에 쓰기 (서버 액션에서만 호출됨) ─────────
export async function syncPublishedIssuesToCookie(issues: Issue[]) {
  try {
    const cookieStore = await cookies();
    // 발행된 것만 필터링하여 저장 (전체 기사 본문 포함)
    const published = issues.filter((i) => i.status === "PUBLISHED");
    // 쿠키 크기 제한(4KB)을 초과할 수 있으므로 기사 본문은 500자로 truncate
    const lite = published.map((issue) => ({
      ...issue,
      articles: issue.articles.map((a) => ({
        ...a,
        content: a.content.length > 500 ? a.content.slice(0, 500) + "…" : a.content,
      })),
    }));
    cookieStore.set(COOKIE_NAME, JSON.stringify(lite), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false,
    });
  } catch (e) {
    console.error("[syncPublishedIssuesToCookie] error:", e);
  }
}

// ── 기사 전문 쿠키 (기사 읽기 전용 - content full) ────────────────
const ARTICLE_COOKIE_PREFIX = "ke_article_";

export async function syncArticleToCookie(issue: Issue) {
  try {
    const cookieStore = await cookies();
    // 각 기사를 개별 쿠키로 저장 (4KB 제한 회피)
    for (const article of issue.articles) {
      const key = `${ARTICLE_COOKIE_PREFIX}${article.id}`;
      const val = JSON.stringify({ article, issueId: issue.id });
      if (val.length < 3800) {
        cookieStore.set(key, val, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
          httpOnly: false,
        });
      }
    }
  } catch (e) {
    console.error("[syncArticleToCookie] error:", e);
  }
}

// ── 발행된 전체 회차 목록 조회 ────────────────────────────────────
export async function getPublishedIssues(): Promise<Issue[]> {
  // 1. 파일 스토리지에서 조회
  const allIssues = readIssues();
  const fromFile = allIssues.filter((i) => i.status === "PUBLISHED");

  // 2. 쿠키에서 조회
  const fromCookie = await getPublishedFromCookie();

  // 3. 병합 (파일에 없는 것만 쿠키에서 추가)
  const merged = [...fromFile];
  for (const ci of fromCookie) {
    if (!merged.some((m) => m.id === ci.id)) {
      merged.push(ci);
    }
  }

  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
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
  // 1. 파일 스토리지에서 조회
  const allIssues = readIssues();
  for (const issue of allIssues) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) return { article: found, issue };
  }

  // 2. 쿠키에서 전체 회차 배열 조회
  const fromCookie = await getPublishedFromCookie();
  for (const issue of fromCookie) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) return { article: found, issue };
  }

  // 3. 개별 기사 쿠키 조회 (전문 저장본)
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(`${ARTICLE_COOKIE_PREFIX}${id}`)?.value;
    if (val) {
      const { article, issueId } = JSON.parse(val);
      // 해당 issue 메타 찾기
      const issue = fromCookie.find((i) => i.id === issueId) || allIssues.find((i) => i.id === issueId);
      if (issue && article) return { article, issue };
    }
  } catch {
    // ignore
  }

  return null;
}
