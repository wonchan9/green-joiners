import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// PUT /api/banners/upload → Vercel Blob에 이미지 업로드 후 URL 반환
export async function PUT(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const filename = `banners/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const blob = await put(filename, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
