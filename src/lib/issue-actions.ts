"use server";

import { revalidatePath } from "next/cache";
import { readIssues, readIssue, upsertIssue } from "./data";
import type { Issue, ArticleInput, IssueInput } from "./types";

// ──────────────────────────────────────────────
// 회차 목록 조회
// ──────────────────────────────────────────────
export async function getIssues(): Promise<Issue[]> {
  return readIssues().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ──────────────────────────────────────────────
// 단건 회차 조회
// ──────────────────────────────────────────────
export async function getIssue(id: string): Promise<Issue | null> {
  return readIssue(id);
}

// ──────────────────────────────────────────────
// 새 회차 생성 (DRAFT 상태)
// ──────────────────────────────────────────────
export async function createIssue(): Promise<string> {
  const issues = readIssues();
  const maxVolume = issues.length > 0 ? Math.max(...issues.map((i) => i.volume)) : 0;
  const now = new Date().toISOString();

  const newIssue: Issue = {
    id: crypto.randomUUID(),
    volume: maxVolume + 1,
    title: `제${maxVolume + 1}호`,
    publishDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "DRAFT",
    articles: [],
    createdAt: now,
    updatedAt: now,
  };

  upsertIssue(newIssue);
  revalidatePath("/admin");
  return newIssue.id;
}

// ──────────────────────────────────────────────
// 회차 + 기사 저장 (임시 저장)
// ──────────────────────────────────────────────
export async function saveIssue(
  id: string,
  issueInput: IssueInput,
  articles: ArticleInput[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const existing = readIssue(id);
    if (!existing) return { ok: false, error: "회차를 찾을 수 없습니다." };

    const now = new Date().toISOString();
    const updatedArticles = articles.map((a) => ({
      ...a,
      id: a.id ?? crypto.randomUUID(),
      issueId: id,
      createdAt: existing.articles.find((ea) => ea.order === a.order)?.createdAt ?? now,
      updatedAt: now,
    }));

    upsertIssue({
      ...existing,
      ...issueInput,
      articles: updatedArticles,
      updatedAt: now,
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/issues/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ──────────────────────────────────────────────
// 회차 즉시 발행
// ──────────────────────────────────────────────
export async function publishIssue(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const existing = readIssue(id);
    if (!existing) return { ok: false, error: "회차를 찾을 수 없습니다." };

    upsertIssue({
      ...existing,
      status: "PUBLISHED",
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/issues/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ──────────────────────────────────────────────
// 회차 삭제
// ──────────────────────────────────────────────
export async function deleteIssue(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { readIssues, writeIssues } = await import("./data");
    const issues = readIssues();
    writeIssues(issues.filter((i) => i.id !== id));
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
