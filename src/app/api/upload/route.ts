import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    // 업로드 디렉토리 확인 및 생성
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다." }, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });
    }

    // 고유 파일명 생성
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // 파일 저장
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "업로드에 실패했습니다." }, { status: 500 });
  }
}
