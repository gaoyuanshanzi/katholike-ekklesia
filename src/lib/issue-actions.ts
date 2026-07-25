"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { readIssues, readIssue, upsertIssue, writeIssues } from "./data";
import { syncPublishedIssuesToCookie, syncArticleToCookie } from "./public-actions";
import type { Issue, ArticleInput, IssueInput } from "./types";

const COOKIE_NAME = "ke_published_issues";

// ── 쿠키에서 발행 회차 배열 읽기 ─────────────────────────────────
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

// ── 회차 목록 조회 (파일 + 쿠키 병합) ────────────────────────────
export async function getIssues(): Promise<Issue[]> {
  // 1. 파일 스토리지에서 읽기
  const fromFile = readIssues();

  // 2. 쿠키에서 발행 회차 읽기 (Vercel 람다 인스턴스 간 동기화)
  const fromCookie = await getPublishedFromCookie();

  // 3. 병합: 파일에 없는 쿠키 항목을 추가
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

// ── 단건 회차 조회 ────────────────────────────────────────────────
export async function getIssue(id: string): Promise<Issue> {
  // 파일에서 먼저 조회
  const fromFile = readIssues();
  const found = fromFile.find((i) => i.id === id);
  if (found) return found;

  // 쿠키에서 조회
  const fromCookie = await getPublishedFromCookie();
  const fromCookieItem = fromCookie.find((i) => i.id === id);
  if (fromCookieItem) return fromCookieItem;

  // 없으면 빈 draft 반환
  return readIssue(id);
}

// ── 새 회차 생성 (DRAFT) ──────────────────────────────────────────
export async function createIssue(): Promise<string> {
  const allIssues = await getIssues();
  const maxVolume =
    allIssues.length > 0 ? Math.max(...allIssues.map((i) => i.volume)) : 0;
  const now = new Date().toISOString();

  const newIssue: Issue = {
    id: crypto.randomUUID(),
    volume: maxVolume + 1,
    title: `제${maxVolume + 1}호`,
    publishDate: new Date().toISOString().split("T")[0],
    status: "DRAFT",
    articles: [],
    createdAt: now,
    updatedAt: now,
  };

  upsertIssue(newIssue);
  revalidatePath("/admin");
  return newIssue.id;
}

// ── 회차 + 기사 저장 (임시 저장) ─────────────────────────────────
export async function saveIssue(
  id: string,
  issueInput: IssueInput,
  articles: ArticleInput[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const existing = await getIssue(id);
    const now = new Date().toISOString();

    const updatedArticles = articles.map((a) => ({
      ...a,
      id: a.id ?? crypto.randomUUID(),
      issueId: id,
      createdAt:
        existing.articles.find((ea) => ea.order === a.order)?.createdAt ?? now,
      updatedAt: now,
    }));

    const updatedIssue: Issue = {
      ...existing,
      ...issueInput,
      articles: updatedArticles,
      updatedAt: now,
    };

    upsertIssue(updatedIssue);

    // 발행 상태면 쿠키도 갱신
    if (updatedIssue.status === "PUBLISHED") {
      const allIssues = await getIssues();
      // 현재 수정된 것으로 교체
      const merged = allIssues.map((i) => i.id === updatedIssue.id ? updatedIssue : i);
      await syncPublishedIssuesToCookie(merged);
      await syncArticleToCookie(updatedIssue);
    }

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    revalidatePath(`/admin/issues/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── 회차 즉시 발행 ────────────────────────────────────────────────
export async function publishIssue(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const existing = await getIssue(id);
    const updatedIssue: Issue = {
      ...existing,
      status: "PUBLISHED",
      updatedAt: new Date().toISOString(),
    };

    upsertIssue(updatedIssue);

    // 전체 발행 회차 배열을 쿠키에 동기화
    const allIssues = await getIssues();
    const merged = allIssues.map((i) => i.id === updatedIssue.id ? updatedIssue : i);
    await syncPublishedIssuesToCookie(merged);
    await syncArticleToCookie(updatedIssue);

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    revalidatePath(`/admin/issues/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── 회차 삭제 ─────────────────────────────────────────────────────
export async function deleteIssue(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    // 파일에서 삭제
    const fileIssues = readIssues();
    writeIssues(fileIssues.filter((i) => i.id !== id));

    // 쿠키에서도 제거 후 재동기화
    const allIssues = await getIssues();
    const remaining = allIssues.filter((i) => i.id !== id);
    await syncPublishedIssuesToCookie(remaining);

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
