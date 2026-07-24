"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { saveIssue, publishIssue } from "@/lib/issue-actions";
import type { Issue, ArticleInput } from "@/lib/types";

// ──────────────────────────────────────────────
// 기본 빈 기사 생성기
// ──────────────────────────────────────────────
function emptyArticle(order: number): ArticleInput {
  return {
    order,
    title: "",
    description: "",
    content: "",
    coverImageUrl: "",
    author: "",
    readTime: 5,
    isFeatured: order === 1,
  };
}

function buildInitialArticles(existing: Issue["articles"]): ArticleInput[] {
  return Array.from({ length: 5 }, (_, i) => {
    const order = i + 1;
    const found = existing.find((a) => a.order === order);
    return found
      ? {
          id: found.id,
          order: found.order,
          title: found.title,
          description: found.description,
          content: found.content,
          coverImageUrl: found.coverImageUrl,
          author: found.author,
          readTime: found.readTime,
          isFeatured: found.isFeatured,
        }
      : emptyArticle(order);
  });
}

// ──────────────────────────────────────────────
// 피드백 토스트
// ──────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-xl transition-all ${
        type === "success"
          ? "bg-emerald-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {message}
    </div>
  );
}

// ──────────────────────────────────────────────
// 이미지 입력 (URL + 파일 업로드)
// ──────────────────────────────────────────────
function ImageInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-400">{label}</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
          style={{ fontSize: "16px" }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:border-amber-500/30 hover:text-amber-400 disabled:opacity-50"
        >
          {uploading ? (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
          {uploading ? "업로드 중" : "파일"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="커버 미리보기" className="h-24 w-full rounded-xl object-cover" />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// 개별 기사 폼 (아코디언 항목)
// ──────────────────────────────────────────────
function ArticleForm({
  article,
  isOpen,
  onToggle,
  onChange,
}: {
  article: ArticleInput;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (updated: ArticleInput) => void;
}) {
  const isHero = article.order === 1;
  const label = isHero
    ? "기사 1 — Hero 대표기사 ★"
    : `기사 ${article.order}`;

  function update(field: keyof ArticleInput, value: string | number | boolean) {
    onChange({ ...article, [field]: value });
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition ${
        isOpen
          ? isHero
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-white/15 bg-white/5"
          : "border-white/10 bg-white/3"
      }`}
    >
      {/* 아코디언 헤더 */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              isHero
                ? "bg-amber-500 text-white"
                : "border border-white/20 bg-white/10 text-slate-300"
            }`}
          >
            {article.order}
          </span>
          <div>
            <span className={`text-sm font-semibold ${isHero ? "text-amber-400" : "text-white"}`}>
              {label}
            </span>
            {!isOpen && article.title && (
              <p className="mt-0.5 truncate text-xs text-slate-500">{article.title}</p>
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 아코디언 본문 */}
      {isOpen && (
        <div className="border-t border-white/10 px-5 pb-6 pt-5 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">기사 제목 *</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="기사 제목을 입력하세요"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
              style={{ fontSize: "16px" }}
            />
          </div>

          {/* 저자 + 읽기 시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">저자</label>
              <input
                type="text"
                value={article.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="이름"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">읽기 시간 (분)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={article.readTime}
                onChange={(e) => update("readTime", Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          {/* 커버 이미지 */}
          <ImageInput
            label="커버 이미지"
            value={article.coverImageUrl}
            onChange={(url) => update("coverImageUrl", url)}
          />

          {/* 한 줄 설명 */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">한 줄 설명</label>
            <input
              type="text"
              value={article.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="기사에 대한 간략한 설명"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
              style={{ fontSize: "16px" }}
            />
          </div>

          {/* 본문 */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              본문 내용
              <span className="ml-2 text-slate-600">(HTML 또는 텍스트)</span>
            </label>
            <textarea
              value={article.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="본문을 작성하세요..."
              rows={8}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
              style={{ fontSize: "16px", minHeight: "200px" }}
            />
            <p className="mt-1 text-right text-xs text-slate-600">{article.content.length}자</p>
          </div>

          {/* 대표기사 체크 */}
          <label className="flex cursor-pointer items-center gap-3 select-none">
            <div className="relative">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={article.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
              />
              <div className="h-5 w-9 rounded-full border border-white/20 bg-white/10 transition peer-checked:border-amber-500/50 peer-checked:bg-amber-500" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-slate-300">대표기사로 설정</span>
          </label>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// 메인 에디터
// ──────────────────────────────────────────────
export default function IssueEditor({ issue }: { issue: Issue }) {
  const [volume, setVolume] = useState(issue.volume);
  const [title, setTitle] = useState(issue.title);
  const [publishDate, setPublishDate] = useState(
    issue.publishDate ? issue.publishDate.split("T")[0] : ""
  );
  const [articles, setArticles] = useState<ArticleInput[]>(() =>
    buildInitialArticles(issue.articles)
  );
  const [openIdx, setOpenIdx] = useState<number>(0); // 열린 아코디언 인덱스
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isPublished, setIsPublished] = useState(issue.status === "PUBLISHED");

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function updateArticle(idx: number, updated: ArticleInput) {
    setArticles((prev) => prev.map((a, i) => (i === idx ? updated : a)));
  }

  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await saveIssue(
        issue.id,
        { volume, title, publishDate },
        articles
      );
      if (result.ok) {
        showToast("✅ 임시 저장되었습니다.", "success");
      } else {
        showToast(`❌ 저장 실패: ${result.error}`, "error");
      }
    });
  }, [issue.id, volume, title, publishDate, articles]);

  const handlePublish = useCallback(() => {
    if (!confirm("즉시 발행하시겠습니까? 발행 후에도 수정은 가능합니다.")) return;
    startTransition(async () => {
      // 먼저 현재 내용 저장
      await saveIssue(issue.id, { volume, title, publishDate }, articles);
      const result = await publishIssue(issue.id);
      if (result.ok) {
        setIsPublished(true);
        showToast("🚀 발행되었습니다!", "success");
      } else {
        showToast(`❌ 발행 실패: ${result.error}`, "error");
      }
    });
  }, [issue.id, volume, title, publishDate, articles]);

  return (
    <>
      {/* 토스트 알림 */}
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* 에디터 본문 */}
      <main className="relative mx-auto max-w-3xl px-4 pb-36 pt-6 sm:px-6">
        {/* 발행 상태 배너 */}
        {isPublished && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            이 회차는 현재 발행된 상태입니다. 수정 후 저장하면 즉시 반영됩니다.
          </div>
        )}

        {/* 회차 기본 정보 */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            회차 정보
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* Vol 번호 */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Vol 번호
              </label>
              <input
                type="number"
                min={1}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                style={{ fontSize: "16px" }}
              />
            </div>
            {/* 이번 달 주제 */}
            <div className="col-span-2 sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                이번 달 주제 (제목)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 2025년 1월호 - 회개와 쇄신"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                style={{ fontSize: "16px" }}
              />
            </div>
            {/* 발행일 */}
            <div className="col-span-2 sm:col-span-3">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                발행일
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 [color-scheme:dark]"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>
        </section>

        {/* 기사 5개 아코디언 */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            기사 목록
          </h2>
          <div className="space-y-3">
            {articles.map((article, idx) => (
              <ArticleForm
                key={article.order}
                article={article}
                isOpen={openIdx === idx}
                onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                onChange={(updated) => updateArticle(idx, updated)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 스티키 하단 액션 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0a0a14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="truncate text-xs text-slate-500">
            {isPublished ? "발행된 상태" : "임시저장 상태"} · 기사 {articles.filter((a) => a.title).length}/5개 작성됨
          </p>
          <div className="flex shrink-0 gap-2">
            {/* 임시 저장 */}
            <button
              id="save-draft-btn"
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/12 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              )}
              임시 저장
            </button>

            {/* 즉시 발행 */}
            <button
              id="publish-btn"
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
              즉시 발행하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
