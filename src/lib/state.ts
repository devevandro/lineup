import { useEffect, useState } from "react";
import { DEFAULT_FORMATION, FORMATIONS } from "./formations";

const STORE_KEY = "escale-seu-time:v3";

export type LineupState = {
  formation: string;
  teamName: string;
  /** ids of the players called up for the team */
  squad: string[];
  squadClosed: boolean;
  lineupClosed: boolean;
  /** "formation:slotIndex" -> player id */
  picks: Record<string, string>;
};

export const pickKey = (formation: string, i: number) => `${formation}:${i}`;

function load(): LineupState {
  let s: Partial<LineupState> | null = null;
  try {
    s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
  } catch {}
  return {
    formation: s?.formation && FORMATIONS[s.formation] ? s.formation : DEFAULT_FORMATION,
    teamName: typeof s?.teamName === "string" ? s.teamName : "",
    squad: Array.isArray(s?.squad) ? s.squad : [],
    squadClosed: !!s?.squadClosed,
    lineupClosed: !!s?.lineupClosed,
    picks: s?.picks && typeof s.picks === "object" ? s.picks : {},
  };
}

export function useLineupState() {
  const [state, setState] = useState<LineupState>(load);
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);
  return [state, setState] as const;
}
