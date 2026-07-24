import type { Metadata } from "next";
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

  return (
    <div className="min-h-screen bg-[#faf9f5]">
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
