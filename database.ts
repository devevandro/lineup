import { neon } from "@neondatabase/serverless";
import type { PlayerRow } from "./types";

let sql: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL!);
  }
  return sql;
}

export async function fetchPlayers() {
  const sql = getDb();
  return (await sql`
      SELECT id, name, nickname, number_campo, position_campo, modality, birthday, dominant_foot, quote, social_media, image
      FROM players
      ORDER BY trim(name)
    `) as unknown as PlayerRow[];
}
