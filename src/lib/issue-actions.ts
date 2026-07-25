"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { readIssues, readIssue, upsertIssue } from "./data";
import type { Issue, ArticleInput, IssueInput } from "./types";

// ──────────────────────────────────────────────
// 회차 목록 조회
// ──────────────────────────────────────────────
export async function getIssues(): Promise<Issue[]> {
  const issues = readIssues();

  // 쿠키에 보관된 발행 건이 있으면 병합
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("latest_published_issue")?.value;
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal) as Issue;
      if (parsed && !issues.some((i) => i.id === parsed.id)) {
        issues.unshift(parsed);
      }
    }
  } catch {
    // Ignore
  }

  return issues.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ──────────────────────────────────────────────
// 단건 회차 조회
// ──────────────────────────────────────────────
export async function getIssue(id: string): Promise<Issue> {
  const issue = readIssue(id);
  if (issue.articles.length > 0) return issue;

  // 쿠키 저장본에서 복원 시도
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("latest_published_issue")?.value;
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal) as Issue;
      if (parsed && parsed.id === id) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  return issue;
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
    const now = new Date().toISOString();
    const updatedArticles = articles.map((a) => ({
      ...a,
      id: a.id ?? crypto.randomUUID(),
      issueId: id,
      createdAt: existing.articles.find((ea) => ea.order === a.order)?.createdAt ?? now,
      updatedAt: now,
    }));

    const updatedIssue: Issue = {
      ...existing,
      ...issueInput,
      articles: updatedArticles,
      updatedAt: now,
    };

    upsertIssue(updatedIssue);

    // 발행 상태인 경우 쿠키 동기화
    if (updatedIssue.status === "PUBLISHED") {
      try {
        const cookieStore = await cookies();
        cookieStore.set("latest_published_issue", JSON.stringify(updatedIssue), {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
        });
      } catch {
        // Ignore
      }
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

// ──────────────────────────────────────────────
// 회차 즉시 발행 (캐시 갱신 + 쿠키 동기화)
// ──────────────────────────────────────────────
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

    // Vercel 서버리스 람다 간 동기화를 위한 쿠키 저장
    try {
      const cookieStore = await cookies();
      cookieStore.set("latest_published_issue", JSON.stringify(updatedIssue), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    } catch (e) {
      console.error("Cookie sync error:", e);
    }

    // 캐시 정화 (Revalidation)
    revalidatePath("/");
    revalidatePath("/archive");
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

    try {
      const cookieStore = await cookies();
      cookieStore.delete("latest_published_issue");
    } catch {
      // Ignore
    }

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
