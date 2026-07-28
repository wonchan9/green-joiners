import Database from "better-sqlite3";
import path from "path";

const DB_PATH =
  process.env.NODE_ENV === "production"
    ? "/tmp/campaign.db"
    : path.join(process.cwd(), "campaign.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_key TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT '테스트유저',
      points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- receipt | basket | tumbler | reals | daily
      title TEXT NOT NULL,
      description TEXT,
      points INTEGER NOT NULL DEFAULT 100,
      daily_limit INTEGER DEFAULT 1,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS participations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mission_id INTEGER NOT NULL,
      status TEXT DEFAULT 'completed', -- completed | rejected
      photo_path TEXT,
      earned_points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (mission_id) REFERENCES missions(id)
    );

    CREATE TABLE IF NOT EXISTS point_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- earn | use
      amount INTEGER NOT NULL,
      description TEXT,
      ref_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT,
      required_points INTEGER NOT NULL,
      stock INTEGER DEFAULT 99,
      visible INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reward_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      reward_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending', -- pending | completed
      used_points INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reward_id) REFERENCES rewards(id)
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      link_url TEXT,
      visible INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // 기본 데이터 시드
  const missionCount = (db.prepare("SELECT COUNT(*) as cnt FROM missions").get() as { cnt: number }).cnt;
  if (missionCount === 0) {
    db.exec(`
      INSERT INTO missions (type, title, description, points) VALUES
        ('receipt', '모바일 영수증 미션', '롯데백화점에서 구매 후 모바일 영수증을 발급받으세요!', 100),
        ('basket', '장바구니 미션', '롯데백화점 장바구니를 사용하고 QR코드를 촬영하세요!', 150),
        ('tumbler', '다회용기/텀블러 미션', '다회용기나 텀블러를 사용하고 QR코드를 촬영하세요!', 150),
        ('reals', '리얼스 미션', '리얼스에서 제품을 판매하고 포인트를 적립하세요!', 200),
        ('daily', '데일리 일상 미션', '오늘의 친환경 활동을 사진으로 인증하세요!', 50);

      INSERT INTO rewards (title, required_points, stock) VALUES
        ('스타벅스 아메리카노', 500, 50),
        ('롯데백화점 상품권 1만원', 1000, 20),
        ('에코백', 300, 100);

      INSERT INTO banners (image_url, link_url, visible) VALUES
        ('/banner-placeholder.png', '', 1);

      INSERT INTO admin_users (username, password) VALUES
        ('admin', 'admin1234');
    `);
  }
}
