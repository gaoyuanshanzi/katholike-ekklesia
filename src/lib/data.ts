// 파일 기반 Mock 데이터 레이어
// DATABASE_URL이 없을 때 JSON 파일에 데이터를 저장합니다.
// DB 연결 시 Prisma 클라이언트로 교체 가능한 구조입니다.

import fs from "fs";
import path from "path";
import type { Issue } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "issues.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ issues: [] }, null, 2), "utf-8");
  }
}

export function readIssues(): Issue[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw).issues as Issue[];
  } catch {
    return [];
  }
}

export function readIssue(id: string): Issue | null {
  const issues = readIssues();
  return issues.find((i) => i.id === id) ?? null;
}

export function writeIssues(issues: Issue[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ issues }, null, 2), "utf-8");
}

export function upsertIssue(issue: Issue) {
  const issues = readIssues();
  const idx = issues.findIndex((i) => i.id === issue.id);
  if (idx >= 0) {
    issues[idx] = issue;
  } else {
    issues.unshift(issue);
  }
  writeIssues(issues);
}
