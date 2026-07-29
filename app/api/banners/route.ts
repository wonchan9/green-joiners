import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const banners = await sql`SELECT * FROM banners WHERE visible = 1`;
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const { image_url, link_url } = await req.json();
  await sql`INSERT INTO banners (image_url, link_url) VALUES (${image_url}, ${link_url ?? ""})`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM banners WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
