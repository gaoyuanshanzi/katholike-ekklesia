"use server";

import { revalidatePath } from "next/cache";
import { readIssues, readIssue, upsertIssue, writeIssues } from "./data";
import { syncPublishedIssuesToCookie, syncArticleToCookie } from "./public-actions";
import type { Issue, ArticleInput, IssueInput } from "./types";

// ── 회차 목록 조회 ────────────────────────────────────────────────
export async function getIssues(): Promise<Issue[]> {
  const issues = readIssues();
  return issues.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ── 단건 회차 조회 ────────────────────────────────────────────────
export async function getIssue(id: string): Promise<Issue> {
  return readIssue(id);
}

// ── 새 회차 생성 (DRAFT) ──────────────────────────────────────────
export async function createIssue(): Promise<string> {
  const issues = readIssues();
  const maxVolume =
    issues.length > 0 ? Math.max(...issues.map((i) => i.volume)) : 0;
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
    const existing = readIssue(id);
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

    // 이미 발행된 상태라면 쿠키도 갱신
    if (updatedIssue.status === "PUBLISHED") {
      const allIssues = readIssues();
      await syncPublishedIssuesToCookie(allIssues);
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
    const existing = readIssue(id);
    const updatedIssue: Issue = {
      ...existing,
      status: "PUBLISHED",
      updatedAt: new Date().toISOString(),
    };

    upsertIssue(updatedIssue);

    // 전체 발행 회차 배열을 쿠키에 동기화 (핵심 수정)
    const allIssues = readIssues();
    await syncPublishedIssuesToCookie(allIssues);
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
    const issues = readIssues();
    writeIssues(issues.filter((i) => i.id !== id));

    // 삭제 후 남은 발행 회차로 쿠키 갱신
    const remaining = readIssues();
    await syncPublishedIssuesToCookie(remaining);

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
