/**
 * Neon PostgreSQL 스키마 초기화 스크립트
 * 실행: DATABASE_URL=<neon_url> npx tsx scripts/init-db.ts
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("스키마 초기화 시작...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      member_key TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT '그린조이너',
      points INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS missions (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      points INTEGER NOT NULL DEFAULT 100,
      daily_limit INTEGER DEFAULT 1,
      active INTEGER DEFAULT 1
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS participations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      mission_id INTEGER NOT NULL REFERENCES missions(id),
      status TEXT DEFAULT 'completed',
      photo_path TEXT,
      earned_points INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS point_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT,
      ref_id INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rewards (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT,
      required_points INTEGER NOT NULL,
      stock INTEGER DEFAULT 99,
      visible INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reward_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      reward_id INTEGER NOT NULL REFERENCES rewards(id),
      status TEXT DEFAULT 'pending',
      used_points INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS banners (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      link_url TEXT,
      visible INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `;

  console.log("테이블 생성 완료. 시드 데이터 삽입...");

  // 기존 데이터 없을 때만 시드
  const missionCount = await sql`SELECT COUNT(*) as cnt FROM missions`;
  if (Number(missionCount[0].cnt) === 0) {
    await sql`
      INSERT INTO missions (type, title, description, points) VALUES
        ('receipt', '모바일 영수증 미션', '롯데백화점에서 구매 후 모바일 영수증을 발급받으세요!', 100),
        ('basket', '장바구니 미션', '롯데백화점 장바구니를 사용하고 QR코드를 촬영하세요!', 150),
        ('tumbler', '다회용기/텀블러 미션', '다회용기나 텀블러를 사용하고 QR코드를 촬영하세요!', 150),
        ('reals', '리얼스 미션', '리얼스에서 제품을 판매하고 포인트를 적립하세요!', 200),
        ('daily', '데일리 일상 미션', '오늘의 친환경 활동을 사진으로 인증하세요!', 50)
    `;
    await sql`
      INSERT INTO rewards (title, required_points, stock) VALUES
        ('스타벅스 아메리카노', 500, 50),
        ('롯데백화점 상품권 1만원', 1000, 20),
        ('에코백', 300, 100)
    `;
    await sql`
      INSERT INTO banners (image_url, link_url, visible) VALUES ('/banner-placeholder.png', '', 1)
    `;
    await sql`
      INSERT INTO admin_users (username, password) VALUES ('admin', 'admin1234')
      ON CONFLICT (username) DO NOTHING
    `;
    console.log("시드 데이터 삽입 완료.");
  } else {
    console.log("데이터 이미 존재. 시드 건너뜀.");
  }

  console.log("초기화 완료!");
}

main().catch((e) => { console.error(e); process.exit(1); });
