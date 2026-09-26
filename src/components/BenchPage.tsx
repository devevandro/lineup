import { useState } from "react";
import type { PlayerRow } from "../../types";
import { displayName } from "../lib/players";
import Header from "./Header";
import PlayerAvatar from "./PlayerAvatar";

export type Starter = { slotIndex: number; label: string; player: PlayerRow };

type Props = {
  teamName: string;
  bench: PlayerRow[];
  starters: Starter[];
  closed: boolean;
  onSubstitute: (slotIndex: number, benchPlayerId: string) => void;
  onBack: () => void;
};

export default function BenchPage({ teamName, bench, starters, closed, onSubstitute, onBack }: Props) {
  const [incoming, setIncoming] = useState<PlayerRow | null>(null);

  return (
    <div className="flex min-h-dvh flex-col gap-4 px-4 pt-6 pb-8">
      <Header teamName={teamName}>
        <p className="m-0 font-marker text-[clamp(22px,7vw,30px)] leading-[1.15] truncate">{teamName.trim() || "Meu Time"}</p>
      </Header>

      <h1 className="m-0 text-2xl font-extrabold uppercase tracking-wide">Banco de reservas</h1>

      <div className="flex flex-col gap-2">
        {!closed && <p className="text-center text-chalk-dim">Feche a escalação para definir os reservas.</p>}
        {closed && bench.length === 0 && <p className="text-center text-chalk-dim">Não há jogadores no banco.</p>}
        {closed &&
          bench.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-line/40 bg-chalk/5 px-3 py-2.5">
              <PlayerAvatar player={p} className="size-14" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xl font-bold leading-tight">{displayName(p)}</span>
                <span className="block truncate text-sm text-chalk-dim">
                  {[p.position_campo, p.number_campo && `#${p.number_campo}`].filter(Boolean).join(" · ") || p.name}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIncoming(p)}
                className="cursor-pointer rounded-lg bg-amber px-3 py-2 text-sm font-extrabold uppercase tracking-wide text-amber-ink"
              >
                Substituir
              </button>
            </div>
          ))}
      </div>

      <button type="button" onClick={onBack} className="mt-auto w-full cursor-pointer rounded-[10px] border-[1.5px] border-line bg-chalk/[.06] px-3 py-3 text-base font-bold">
        Voltar à escalação
      </button>

      {incoming && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center p-5 bg-[rgb(6_14_10/.82)]"
          onClick={(e) => e.target === e.currentTarget && setIncoming(null)}
        >
          <div className="flex max-h-[85vh] w-full max-w-[420px] flex-col gap-3 rounded-2xl border border-line bg-board-dark p-4 shadow-card">
            <h2 className="m-0 font-marker text-xl">Quem sai para {displayName(incoming)} entrar?</h2>
            <div className="flex min-h-0 flex-col gap-1.5 overflow-auto">
              {starters.map((st) => (
                <button
                  key={st.slotIndex}
                  type="button"
                  onClick={() => {
                    onSubstitute(st.slotIndex, incoming.id);
                    setIncoming(null);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-line/40 bg-chalk/5 px-2.5 py-2 text-left"
                >
                  <PlayerAvatar player={st.player} className="size-10" />
                  <span className="min-w-0 flex-1 truncate text-lg font-bold">{displayName(st.player)}</span>
                  <span className="text-sm font-bold text-amber">{st.label}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setIncoming(null)} className="cursor-pointer text-sm font-bold uppercase tracking-widest text-chalk-dim">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
