// 파일 기반 Mock 데이터 레이어 (Vercel Serverless / Read-Only FileSystem 안전 처리)

import fs from "fs";
import path from "path";
import os from "os";
import type { Issue } from "./types";

const PRIMARY_DATA_DIR = path.join(process.cwd(), "data");
const PRIMARY_DATA_FILE = path.join(PRIMARY_DATA_DIR, "issues.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "katholike_issues.json");

function getTargetFile(): string {
  if (fs.existsSync(PRIMARY_DATA_FILE)) {
    return PRIMARY_DATA_FILE;
  }
  if (fs.existsSync(TMP_DATA_FILE)) {
    return TMP_DATA_FILE;
  }
  return PRIMARY_DATA_FILE;
}

function ensureDataFile() {
  try {
    if (!fs.existsSync(PRIMARY_DATA_DIR)) {
      fs.mkdirSync(PRIMARY_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRIMARY_DATA_FILE)) {
      fs.writeFileSync(PRIMARY_DATA_FILE, JSON.stringify({ issues: [] }, null, 2), "utf-8");
    }
  } catch {
    // Primary path is read-only (e.g. Vercel deployment environment).
    try {
      if (!fs.existsSync(TMP_DATA_FILE)) {
        fs.writeFileSync(TMP_DATA_FILE, JSON.stringify({ issues: [] }, null, 2), "utf-8");
      }
    } catch {
      // Ignore write errors gracefully during static build phase
    }
  }
}

export function readIssues(): Issue[] {
  try {
    ensureDataFile();
    const target = getTargetFile();
    if (fs.existsSync(target)) {
      const raw = fs.readFileSync(target, "utf-8");
      return JSON.parse(raw).issues as Issue[];
    }
  } catch {
    // Fallback gracefully on read errors
  }
  return [];
}

export function readIssue(id: string): Issue | null {
  const issues = readIssues();
  return issues.find((i) => i.id === id) ?? null;
}

export function writeIssues(issues: Issue[]) {
  try {
    ensureDataFile();
    const target = getTargetFile();
    fs.writeFileSync(target, JSON.stringify({ issues }, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify({ issues }, null, 2), "utf-8");
    } catch {
      // Fallback
    }
  }
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
