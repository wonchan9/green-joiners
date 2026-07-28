import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const banners = db.prepare("SELECT * FROM banners WHERE visible = 1").all();
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const { image_url, link_url } = await req.json();
  const db = getDb();
  db.prepare("INSERT INTO banners (image_url, link_url) VALUES (?, ?)").run(image_url, link_url ?? "");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM banners WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
