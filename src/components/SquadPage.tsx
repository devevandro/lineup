import { useMemo, useState } from "react";
import type { PlayerRow } from "../../types";
import { displayName } from "../lib/players";
import Header from "./Header";
import PlayerAvatar from "./PlayerAvatar";

type Props = {
  teamName: string;
  onTeamName: (v: string) => void;
  players: PlayerRow[];
  status: "loading" | "ready" | "error";
  squad: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
  minPlayers: number;
};

export default function SquadPage({ teamName, onTeamName, players, status, squad, onToggle, onClose, minPlayers }: Props) {
  const [query, setQuery] = useState("");
  const selected = new Set(squad);
  const count = players.filter((p) => selected.has(p.id)).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? players.filter((p) => `${p.name} ${p.nickname}`.toLowerCase().includes(q)) : players;
  }, [players, query]);

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-6">
      <Header teamName={teamName}>
        <input
          value={teamName}
          onChange={(e) => onTeamName(e.target.value)}
          placeholder="Nome do seu time"
          maxLength={26}
          autoComplete="off"
          className="w-full bg-transparent py-0.5 font-marker text-[clamp(22px,7vw,30px)] leading-[1.15] outline-none border-b-2 border-dashed border-transparent focus:border-line placeholder:text-chalk-dim"
        />
      </Header>

      <h1 className="mt-5 mb-2 text-2xl font-extrabold uppercase tracking-wide">Escolha os jogadores</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar jogador"
        className="mb-3 w-full rounded-lg border border-line bg-chalk/5 px-3 py-2 text-lg outline-none focus:border-amber placeholder:text-chalk-dim"
      />

      <div className="flex flex-col gap-2 pb-4">
        {status === "loading" && <p className="text-center text-chalk-dim">Carregando jogadores…</p>}
        {status === "error" && <p className="text-center text-[#ff8a65]">Não foi possível carregar os jogadores.</p>}
        {status === "ready" && filtered.length === 0 && <p className="text-center text-chalk-dim">Nenhum jogador encontrado.</p>}

        {filtered.map((p) => {
          const on = selected.has(p.id);
          return (
            <label
              key={p.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 ${
                on ? "border-amber bg-amber/15" : "border-line/40 bg-chalk/5"
              }`}
            >
              <PlayerAvatar player={p} className="size-14" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xl font-bold leading-tight">{displayName(p)}</span>
                <span className="block truncate text-sm text-chalk-dim">
                  {[p.position_campo, p.number_campo && `#${p.number_campo}`].filter(Boolean).join(" · ") || p.name}
                </span>
              </span>
              <input type="checkbox" checked={on} onChange={() => onToggle(p.id)} className="peer sr-only" />
              <span
                aria-hidden
                className={`flex size-7 flex-none items-center justify-center rounded-md border-2 ${
                  on ? "border-amber bg-amber text-amber-ink" : "border-line"
                }`}
              >
                {on && (
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-auto bg-gradient-to-t from-board-dark via-board-dark/95 to-transparent px-4 pt-4 pb-5">
        <button
          type="button"
          disabled={count < minPlayers}
          onClick={onClose}
          className="w-full cursor-pointer rounded-[10px] bg-amber px-3 py-3.5 text-lg font-extrabold uppercase tracking-wide text-amber-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          Fechar time ({count})
        </button>
        {count < minPlayers && <p className="m-0 mt-1.5 text-center text-sm font-semibold text-chalk-dim">Selecione ao menos {minPlayers} jogadores</p>}
      </div>
    </div>
  );
}
