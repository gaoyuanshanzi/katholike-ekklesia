"use server";

import { revalidatePath } from "next/cache";
import { readIssuesAsync, readIssueAsync, upsertIssueAsync, deleteIssueAsync } from "./data";
import type { Issue, ArticleInput, IssueInput } from "./types";

// ── 회차 목록 조회 ────────────────────────────────────────────────
export async function getIssues(): Promise<Issue[]> {
  const issues = await readIssuesAsync();
  return issues.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ── 단건 회차 조회 ────────────────────────────────────────────────
export async function getIssue(id: string): Promise<Issue> {
  const found = await readIssueAsync(id);
  if (found) return found;

  // 없으면 새 draft 반환
  const issues = await readIssuesAsync();
  const maxVolume = issues.length > 0 ? Math.max(...issues.map((i) => i.volume)) : 0;
  const now = new Date().toISOString();
  return {
    id,
    volume: maxVolume + 1,
    title: `제${maxVolume + 1}호`,
    publishDate: new Date().toISOString().split("T")[0],
    status: "DRAFT",
    articles: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ── 새 회차 생성 (DRAFT) ──────────────────────────────────────────
export async function createIssue(): Promise<string> {
  const issues = await readIssuesAsync();
  const maxVolume = issues.length > 0 ? Math.max(...issues.map((i) => i.volume)) : 0;
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

  await upsertIssueAsync(newIssue);
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
      views: a.views ?? existing.articles.find((ea) => ea.order === a.order)?.views ?? 0,
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

    await upsertIssueAsync(updatedIssue);
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

    await upsertIssueAsync(updatedIssue);
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
    await deleteIssueAsync(id);
    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
