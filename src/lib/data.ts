// Prisma DB 기반 데이터 레이어
// DATABASE_URL이 없을 때는 로컬 파일 스토리지로 fallback

import type { Issue } from "./types";

const USE_DB = !!process.env.DATABASE_URL;

// ── Prisma helpers ────────────────────────────────────────────────
async function getPrisma() {
  const { default: prisma } = await import("./db");
  return prisma;
}

function toIssue(raw: {
  id: string;
  volume: number;
  title: string;
  publishDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  articles: {
    id: string;
    issueId: string;
    order: number;
    title: string;
    description: string;
    content: string;
    coverImageUrl: string;
    author: string;
    readTime: number;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}): Issue {
  return {
    id: raw.id,
    volume: raw.volume,
    title: raw.title,
    publishDate: raw.publishDate.toISOString().split("T")[0],
    status: raw.status as "DRAFT" | "PUBLISHED",
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    articles: raw.articles
      .sort((a, b) => a.order - b.order)
      .map((a) => ({
        id: a.id,
        issueId: a.issueId,
        order: a.order,
        title: a.title,
        description: a.description,
        content: a.content,
        coverImageUrl: a.coverImageUrl,
        author: a.author,
        readTime: a.readTime,
        isFeatured: a.isFeatured,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
  };
}

// ── DB 기반 함수들 ────────────────────────────────────────────────
async function dbReadIssues(): Promise<Issue[]> {
  const prisma = await getPrisma();
  const rows = await prisma.issue.findMany({
    include: { articles: true },
    orderBy: { volume: "desc" },
  });
  return rows.map(toIssue);
}

async function dbReadIssue(id: string): Promise<Issue | null> {
  const prisma = await getPrisma();
  const row = await prisma.issue.findUnique({
    where: { id },
    include: { articles: true },
  });
  if (!row) return null;
  return toIssue(row);
}

async function dbUpsertIssue(issue: Issue): Promise<void> {
  const prisma = await getPrisma();
  await prisma.$transaction(async (tx) => {
    await tx.issue.upsert({
      where: { id: issue.id },
      create: {
        id: issue.id,
        volume: issue.volume,
        title: issue.title,
        publishDate: new Date(issue.publishDate),
        status: issue.status,
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
      },
      update: {
        volume: issue.volume,
        title: issue.title,
        publishDate: new Date(issue.publishDate),
        status: issue.status,
        updatedAt: new Date(issue.updatedAt),
      },
    });

    // 기존 기사 삭제 후 재삽입
    await tx.article.deleteMany({ where: { issueId: issue.id } });
    if (issue.articles.length > 0) {
      await tx.article.createMany({
        data: issue.articles.map((a) => ({
          id: a.id,
          issueId: issue.id,
          order: a.order,
          title: a.title,
          description: a.description,
          content: a.content,
          coverImageUrl: a.coverImageUrl,
          author: a.author,
          readTime: a.readTime,
          isFeatured: a.isFeatured,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        })),
      });
    }
  });
}

async function dbDeleteIssue(id: string): Promise<void> {
  const prisma = await getPrisma();
  await prisma.issue.delete({ where: { id } });
}

// ── 파일 스토리지 Fallback (로컬 개발용) ─────────────────────────
import fs from "fs";
import path from "path";
import os from "os";

const PRIMARY_DATA_DIR = path.join(process.cwd(), "data");
const PRIMARY_DATA_FILE = path.join(PRIMARY_DATA_DIR, "issues.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "katholike_issues.json");

function getTargetFile(): string {
  if (fs.existsSync(PRIMARY_DATA_FILE)) return PRIMARY_DATA_FILE;
  if (fs.existsSync(TMP_DATA_FILE)) return TMP_DATA_FILE;
  return PRIMARY_DATA_FILE;
}

function ensureDataFile() {
  try {
    if (!fs.existsSync(PRIMARY_DATA_DIR))
      fs.mkdirSync(PRIMARY_DATA_DIR, { recursive: true });
    if (!fs.existsSync(PRIMARY_DATA_FILE))
      fs.writeFileSync(PRIMARY_DATA_FILE, JSON.stringify({ issues: [] }, null, 2), "utf-8");
  } catch {
    try {
      if (!fs.existsSync(TMP_DATA_FILE))
        fs.writeFileSync(TMP_DATA_FILE, JSON.stringify({ issues: [] }, null, 2), "utf-8");
    } catch { /* ignore */ }
  }
}

function fileReadIssues(): Issue[] {
  try {
    ensureDataFile();
    const target = getTargetFile();
    if (fs.existsSync(target)) {
      const raw = fs.readFileSync(target, "utf-8");
      return JSON.parse(raw).issues as Issue[];
    }
  } catch { /* ignore */ }
  return [];
}

function fileWriteIssues(issues: Issue[]) {
  try {
    ensureDataFile();
    const target = getTargetFile();
    fs.writeFileSync(target, JSON.stringify({ issues }, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify({ issues }, null, 2), "utf-8");
    } catch { /* ignore */ }
  }
}

// ── 공개 API (DB 또는 파일 자동 선택) ────────────────────────────
export async function readIssuesAsync(): Promise<Issue[]> {
  if (USE_DB) return dbReadIssues();
  return fileReadIssues();
}

export async function readIssueAsync(id: string): Promise<Issue | null> {
  if (USE_DB) return dbReadIssue(id);
  const issues = fileReadIssues();
  return issues.find((i) => i.id === id) ?? null;
}

export async function upsertIssueAsync(issue: Issue): Promise<void> {
  if (USE_DB) {
    await dbUpsertIssue(issue);
    return;
  }
  const issues = fileReadIssues();
  const idx = issues.findIndex((i) => i.id === issue.id);
  if (idx >= 0) issues[idx] = issue;
  else issues.unshift(issue);
  fileWriteIssues(issues);
}

export async function deleteIssueAsync(id: string): Promise<void> {
  if (USE_DB) {
    await dbDeleteIssue(id);
    return;
  }
  const issues = fileReadIssues();
  fileWriteIssues(issues.filter((i) => i.id !== id));
}

// ── 동기 호환 레이어 (기존 코드와의 호환성 유지) ─────────────────
export function readIssues(): Issue[] {
  return fileReadIssues();
}

export function writeIssues(issues: Issue[]) {
  fileWriteIssues(issues);
}

export function upsertIssue(issue: Issue) {
  const issues = fileReadIssues();
  const idx = issues.findIndex((i) => i.id === issue.id);
  if (idx >= 0) issues[idx] = issue;
  else issues.unshift(issue);
  fileWriteIssues(issues);
}
