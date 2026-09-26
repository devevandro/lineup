import { useMemo, useState } from "react";
import type { PlayerRow } from "../../types";
import { displayName } from "../lib/players";

type Props = {
  slotLabel: string;
  players: PlayerRow[];
  status: "loading" | "ready" | "error";
  currentId?: string;
  takenIds: Set<string>;
  onPick: (id: string | null) => void;
  onClose: () => void;
};

export default function PlayerPicker({ slotLabel, players, status, currentId, takenIds, onPick, onClose }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => `${p.name} ${p.nickname}`.toLowerCase().includes(q));
  }, [players, query]);

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-5 bg-[rgb(6_14_10/.82)]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] max-h-[85vh] flex flex-col gap-3 p-4 rounded-2xl border border-line bg-board-dark shadow-card">
        <div className="flex items-baseline justify-between">
          <h2 className="m-0 font-marker text-xl">Escolha o {slotLabel}</h2>
          <button type="button" onClick={onClose} className="text-chalk-dim font-bold uppercase tracking-widest text-sm cursor-pointer">
            Fechar
          </button>
        </div>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar jogador"
          className="w-full rounded-lg border border-line bg-chalk/5 px-3 py-2 text-lg outline-none focus:border-amber placeholder:text-chalk-dim"
        />

        <div className="overflow-auto flex flex-col gap-1.5 min-h-0">
          {status === "loading" && <p className="text-center text-chalk-dim">Carregando jogadores…</p>}
          {status === "error" && <p className="text-center text-[#ff8a65]">Não foi possível carregar os jogadores.</p>}
          {status === "ready" && filtered.length === 0 && <p className="text-center text-chalk-dim">Nenhum jogador encontrado.</p>}

          {filtered.map((p) => {
            const taken = takenIds.has(p.id) && p.id !== currentId;
            return (
              <button
                key={p.id}
                type="button"
                disabled={taken}
                onClick={() => onPick(p.id)}
                className={`flex items-center gap-3 rounded-lg border px-2.5 py-2 text-left cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                  p.id === currentId ? "border-amber bg-amber/15" : "border-line/40 bg-chalk/5 hover:bg-chalk/10"
                }`}
              >
                <span className={`size-10 flex-none rounded-full overflow-hidden ${p.image ? "" : "bg-amber"} text-amber-ink flex items-center justify-center font-extrabold`}>
                  {p.image ? <img src={p.image} alt="" className="size-full object-cover object-top" /> : p.number_campo ?? "–"}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-lg leading-tight truncate">{displayName(p)}</span>
                  <span className="block text-sm text-chalk-dim truncate">
                    {[p.position_campo, p.number_campo && `#${p.number_campo}`].filter(Boolean).join(" · ") || p.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {currentId && (
          <button
            type="button"
            onClick={() => onPick(null)}
            className="rounded-lg border border-line px-3 py-2 font-bold cursor-pointer hover:bg-chalk/10"
          >
            Remover jogador
          </button>
        )}
      </div>
    </div>
  );
}
