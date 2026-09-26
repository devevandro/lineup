import { useEffect, useState } from "react";
import type { PlayerRow } from "../../types";

export function displayName(p: PlayerRow) {
  return (p.nickname || p.name || "").trim();
}

function isCampo(p: PlayerRow) {
  const m = p.modality;
  if (!m) return true;
  return Array.isArray(m) ? m.includes("campo") : String(m).includes("campo");
}

export function usePlayers() {
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/players")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((rows: PlayerRow[]) => {
        if (cancelled) return;
        setPlayers(rows.filter(isCampo));
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  return { players, status };
}
