import { fetchPlayers } from "../database.js";

export async function GET() {
  try {
    return Response.json(await fetchPlayers());
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Falha ao carregar jogadores" }, { status: 500 });
  }
}
