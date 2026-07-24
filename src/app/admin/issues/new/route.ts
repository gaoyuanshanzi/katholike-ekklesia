import { NextRequest, NextResponse } from "next/server";
import { createIssue } from "@/lib/issue-actions";

export async function POST(request: NextRequest) {
  const id = await createIssue();
  return NextResponse.redirect(new URL(`/admin/issues/${id}`, request.url));
}
