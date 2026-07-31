import { sql } from "./db";

export interface Mission {
  id: number;
  type: string;
  title: string;
  description: string;
  points: number;
  daily_limit: number;
  active?: number;
}

export interface MissionWithStatus extends Mission {
  completed_today: boolean;
}

export async function getMissionsWithStatus(userId: number, all = false): Promise<MissionWithStatus[]> {
  const missions = (all
    ? await sql`SELECT * FROM missions ORDER BY id`
    : await sql`SELECT * FROM missions WHERE active = 1 ORDER BY id`) as Mission[];

  const today = new Date().toISOString().slice(0, 10);

  return Promise.all(
    missions.map(async (m) => {
      const rows = await sql`
        SELECT COUNT(*) as cnt FROM participations
        WHERE user_id = ${userId} AND mission_id = ${m.id} AND created_at::date = ${today}::date
      `;
      const cnt = Number(rows[0].cnt);
      return { ...m, completed_today: cnt >= Number(m.daily_limit) } as MissionWithStatus;
    })
  );
}
