import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { getIssue } from "@/lib/issue-actions";
import IssueEditor from "./IssueEditor";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const issue = await getIssue(id);
  return {
    title: issue
      ? `Vol.${issue.volume} 편집 | Katholike Ekklesia`
      : "편집 | Katholike Ekklesia",
  };
}

export default async function IssueEditorPage({ params }: Props) {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-600/8 to-transparent blur-3xl" />
      </div>

      <AdminHeader
        title={`Vol.${issue.volume} 편집 중`}
        subtitle={issue.status === "PUBLISHED" ? "✅ 발행됨" : "📝 임시저장"}
        backHref="/admin"
        backLabel="대시보드로"
      />

      <IssueEditor issue={issue} />
    </div>
  );
}
