import { cookies } from "next/headers";
import { readIssues } from "./data";
import type { Issue, Article } from "./types";

export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

// ── 쿠키 키 설계 ─────────────────────────────────────────────────
// ke_pub_index : [{id, volume, title, publishDate, status, createdAt, updatedAt}] (슬림 인덱스)
// ke_pub_{id}  : 회차별 전체 데이터 (이미지 base64 제거, 내용 1000자 truncate)
const COOKIE_INDEX = "ke_pub_index";
const COOKIE_ISSUE_PREFIX = "ke_pub_";
const COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
  httpOnly: false,
};

// ── 이미지 URL 정리 (base64는 기본 이미지로 대체) ─────────────────
function cleanImageUrl(url: string | undefined): string {
  if (!url) return PASTORAL_HERO_IMAGE;
  if (url.startsWith("data:")) return PASTORAL_HERO_IMAGE; // base64 제거
  return url;
}

// ── 슬림 인덱스에서 읽기 ─────────────────────────────────────────
async function getIndexFromCookie(): Promise<Array<{ id: string; volume: number; title: string; publishDate: string; status: string; createdAt: string; updatedAt: string }>> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(COOKIE_INDEX)?.value;
    if (!val) return [];
    return JSON.parse(val);
  } catch {
    return [];
  }
}

// ── 개별 회차 쿠키에서 읽기 ──────────────────────────────────────
async function getIssueFromCookie(id: string): Promise<Issue | null> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(`${COOKIE_ISSUE_PREFIX}${id}`)?.value;
    if (!val) return null;
    return JSON.parse(val) as Issue;
  } catch {
    return null;
  }
}

// ── 전체 발행 회차 배열 + 개별 쿠키에 저장 ───────────────────────
export async function syncPublishedIssuesToCookie(allIssues: Issue[]) {
  try {
    const cookieStore = await cookies();
    const published = allIssues.filter((i) => i.status === "PUBLISHED");

    // 1. 슬림 인덱스 저장 (작은 크기 유지)
    const index = published.map((i) => ({
      id: i.id,
      volume: i.volume,
      title: i.title,
      publishDate: i.publishDate,
      status: i.status,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));
    cookieStore.set(COOKIE_INDEX, JSON.stringify(index), COOKIE_OPTS);

    // 2. 회차별 개별 쿠키 저장 (base64 이미지 제거, 본문 1000자 제한)
    for (const issue of published) {
      const stripped: Issue = {
        ...issue,
        articles: issue.articles.map((a) => ({
          ...a,
          coverImageUrl: cleanImageUrl(a.coverImageUrl),
          content:
            a.content.length > 1000
              ? a.content.slice(0, 1000) + "…"
              : a.content,
        })),
      };
      const val = JSON.stringify(stripped);
      // 4KB 제한 내에서만 저장
      if (val.length < 3900) {
        cookieStore.set(
          `${COOKIE_ISSUE_PREFIX}${issue.id}`,
          val,
          COOKIE_OPTS
        );
      } else {
        // 기사 본문 제거하고 메타만 저장
        const metaOnly: Issue = {
          ...issue,
          articles: issue.articles.map((a) => ({
            ...a,
            coverImageUrl: cleanImageUrl(a.coverImageUrl),
            content: "",
          })),
        };
        cookieStore.set(
          `${COOKIE_ISSUE_PREFIX}${issue.id}`,
          JSON.stringify(metaOnly),
          COOKIE_OPTS
        );
      }
    }
  } catch (e) {
    console.error("[syncPublishedIssuesToCookie] error:", e);
  }
}

export async function syncArticleToCookie(_issue: Issue) {
  // 개별 기사 쿠키는 syncPublishedIssuesToCookie로 통합 처리
}

// ── 쿠키에서 모든 발행 회차 읽기 ─────────────────────────────────
async function getAllPublishedFromCookie(): Promise<Issue[]> {
  const index = await getIndexFromCookie();
  if (index.length === 0) return [];

  const results: Issue[] = [];
  for (const meta of index) {
    const full = await getIssueFromCookie(meta.id);
    if (full) {
      results.push(full);
    } else {
      // 개별 쿠키가 없으면 인덱스 메타만으로 구성
      results.push({
        id: meta.id,
        volume: meta.volume,
        title: meta.title,
        publishDate: meta.publishDate,
        status: meta.status as "PUBLISHED" | "DRAFT",
        articles: [],
        createdAt: meta.createdAt,
        updatedAt: meta.updatedAt,
      });
    }
  }
  return results;
}

// ── 발행된 전체 회차 목록 조회 ────────────────────────────────────
export async function getPublishedIssues(): Promise<Issue[]> {
  // 1. 파일 스토리지
  const allIssues = readIssues();
  const fromFile = allIssues.filter((i) => i.status === "PUBLISHED");

  // 2. 쿠키
  const fromCookie = await getAllPublishedFromCookie();

  // 3. 병합 (파일 우선, 쿠키는 보완)
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
  // 1. 파일 스토리지
  const allIssues = readIssues();
  for (const issue of allIssues) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) return { article: found, issue };
  }

  // 2. 쿠키 (인덱스에서 각 회차별 쿠키 순회)
  const fromCookie = await getAllPublishedFromCookie();
  for (const issue of fromCookie) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) return { article: found, issue };
  }

  return null;
}
