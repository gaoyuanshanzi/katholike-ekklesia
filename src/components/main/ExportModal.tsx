"use client";

import { useState } from "react";
import type { Issue } from "@/lib/types";

type ExportFormat = "txt" | "doc" | "html" | "pdf";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  issues: Issue[];
  currentIssue?: Issue | null;
};

export default function ExportModal({
  isOpen,
  onClose,
  issues,
  currentIssue,
}: Props) {
  const [selectedIssueId, setSelectedIssueId] = useState<string>(
    currentIssue?.id || (issues.length > 0 ? issues[0].id : "")
  );
  const [format, setFormat] = useState<ExportFormat>("doc");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const targetIssue =
    issues.find((i) => i.id === selectedIssueId) || currentIssue || issues[0];

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    if (!targetIssue) return;
    setIsExporting(true);

    try {
      const issueTitle = `Vol.${targetIssue.volume} ${targetIssue.title}`;
      const sanitizeName = issueTitle.replace(/[/\\?%*:|"<>]/g, "_");

      if (format === "txt") {
        // Plain TXT Format
        let txt = `==================================================\n`;
        txt += `Katholike Ekklesia - ${issueTitle}\n`;
        txt += `발행일: ${targetIssue.publishDate}\n`;
        txt += `==================================================\n\n`;

        targetIssue.articles.forEach((art, idx) => {
          txt += `[기사 ${idx + 1}] ${art.title}\n`;
          txt += `작성자: ${art.author || "편집부"} | 읽기 시간: ${art.readTime}분\n`;
          txt += `설명: ${art.description}\n`;
          txt += `--------------------------------------------------\n`;
          // Strip HTML tags for TXT format
          const plainContent = art.content
            .replace(/<[^>]+>/g, "\n")
            .replace(/\n\s*\n/g, "\n")
            .trim();
          txt += `${plainContent}\n\n`;
          txt += `==================================================\n\n`;
        });

        const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
        triggerDownload(blob, `${sanitizeName}.txt`);
      } else if (format === "doc" || format === "html") {
        // MS Word (.doc) or HTML Format
        let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${issueTitle}</title>
<style>
  body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #111827; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { text-align: center; color: #92400e; font-size: 28px; margin-bottom: 5px; }
  .issue-meta { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; }
  .article-card { margin-bottom: 50px; page-break-after: always; border-bottom: 1px solid #f3f4f6; padding-bottom: 30px; }
  .article-title { color: #111827; font-size: 22px; margin-bottom: 8px; }
  .article-meta { color: #b45309; font-size: 13px; font-weight: bold; margin-bottom: 15px; }
  .article-desc { font-style: italic; color: #4b5563; background: #fffbeb; padding: 12px; border-left: 4px solid #f59e0b; margin-bottom: 20px; }
  .content { font-size: 16px; color: #1f2937; }
</style>
</head>
<body>
  <h1>Katholike Ekklesia — ${issueTitle}</h1>
  <div class="issue-meta">발행일: ${targetIssue.publishDate} | 수록 기사 ${targetIssue.articles.length}개</div>
`;

        targetIssue.articles.forEach((art, idx) => {
          html += `
  <div class="article-card">
    <h2 class="article-title">[기사 ${idx + 1}] ${art.title}</h2>
    <div class="article-meta">작성자: ${art.author || "편집부"} · 읽기 시간: ${art.readTime}분</div>
    ${art.description ? `<div class="article-desc">${art.description}</div>` : ""}
    <div class="content">${art.content}</div>
  </div>`;
        });

        html += `</body></html>`;

        if (format === "doc") {
          const blob = new Blob(["\ufeff" + html], { type: "application/msword;charset=utf-8" });
          triggerDownload(blob, `${sanitizeName}.doc`);
        } else {
          const blob = new Blob([html], { type: "text/html;charset=utf-8" });
          triggerDownload(blob, `${sanitizeName}.html`);
        }
      } else if (format === "pdf") {
        // PDF Format via Print Window
        const printWin = window.open("", "_blank");
        if (printWin) {
          let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${issueTitle}</title>
<style>
  body { font-family: sans-serif; line-height: 1.6; color: #111827; padding: 20px; }
  h1 { text-align: center; color: #92400e; font-size: 26px; }
  .meta { text-align: center; color: #6b7280; font-size: 13px; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
  .article { margin-bottom: 40px; page-break-inside: avoid; }
  .title { color: #111827; font-size: 20px; margin-bottom: 6px; }
  .author { color: #b45309; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
  .content { font-size: 15px; color: #374151; }
</style>
</head>
<body>
  <h1>Katholike Ekklesia — ${issueTitle}</h1>
  <div class="meta">발행일: ${targetIssue.publishDate} | 수록 기사 ${targetIssue.articles.length}개</div>
`;
          targetIssue.articles.forEach((art, idx) => {
            html += `
  <div class="article">
    <h2 class="title">[기사 ${idx + 1}] ${art.title}</h2>
    <div class="author">작성자: ${art.author || "편집부"} · 읽기 시간: ${art.readTime}분</div>
    <div class="content">${art.content}</div>
  </div>`;
          });
          html += `<script>window.onload = function() { window.print(); };</script></body></html>`;
          printWin.document.write(html);
          printWin.document.close();
        }
      }
    } finally {
      setIsExporting(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">기사 내보내기 (Export)</h3>
              <p className="text-xs text-slate-500">회차별 모든 기사를 파일로 다운로드합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* 회차 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              내보낼 회차 선택
            </label>
            <select
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500"
            >
              {issues.map((i) => (
                <option key={i.id} value={i.id}>
                  Vol.{i.volume} {i.title} ({i.articles.length}개 기사)
                </option>
              ))}
            </select>
          </div>

          {/* 포맷 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              다운로드 파일 포맷 선택
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "doc", label: "MS Word", desc: ".doc 파일", icon: "📝" },
                { id: "txt", label: "텍스트", desc: ".txt 텍스트 파일", icon: "📄" },
                { id: "html", label: "HTML 웹", desc: ".html 서식 파일", icon: "🌐" },
                { id: "pdf", label: "PDF 문서", desc: ".pdf 인쇄/저장", icon: "🖨️" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id as ExportFormat)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                    format === item.id
                      ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="mt-0.5 text-xs text-slate-500">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || !targetIssue}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>{isExporting ? "다운로드 중..." : "다운로드"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
