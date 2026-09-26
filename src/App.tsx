import { useMemo, useState } from "react";
import BenchPage from "./components/BenchPage";
import Field from "./components/Field";
import Header from "./components/Header";
import PlayerPicker from "./components/PlayerPicker";
import ResultModal from "./components/ResultModal";
import SquadPage from "./components/SquadPage";
import { buildImage } from "./lib/buildImage";
import { FORMATIONS } from "./lib/formations";
import { usePlayers } from "./lib/players";
import { pickKey, useLineupState } from "./lib/state";

const btn =
  "flex-1 flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-line bg-chalk/[.06] px-2.5 py-3 text-base font-bold tracking-wide cursor-pointer hover:bg-chalk/[.12] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45";
const btnPrimary = `${btn} !border-amber !bg-amber !text-amber-ink`;

type View = "squad" | "lineup" | "bench";

export default function App() {
  const [state, setState] = useLineupState();
  const { players, status } = usePlayers();
  const [view, setView] = useState<View>(state.squadClosed ? "lineup" : "squad");
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [resultImg, setResultImg] = useState<string | null>(null);

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
  const slots = FORMATIONS[state.formation];
  const squadSet = new Set(state.squad);
  const squadPlayers = players.filter((p) => squadSet.has(p.id));

  const starterIds = slots.map((_, i) => state.picks[pickKey(state.formation, i)]).filter((id) => playersById.has(id));
  const starterSet = new Set(starterIds);
  const filled = starterIds.length;
  const bench = squadPlayers.filter((p) => !starterSet.has(p.id));
  const lineupFull = filled === slots.length;

  const starterSlots = slots.flatMap((slot, i) => {
    const player = playersById.get(state.picks[pickKey(state.formation, i)]);
    return player ? [{ slotIndex: i, label: slot.p, player }] : [];
  });

  // Substitution: the reserve takes the slot; the player who leaves goes to the bench automatically.
  const substitute = (slotIndex: number, benchPlayerId: string) =>
    setState((s) => ({ ...s, picks: { ...s.picks, [pickKey(s.formation, slotIndex)]: benchPlayerId } }));

  const toggleSquad = (id: string) =>
    setState((s) => ({
      ...s,
      lineupClosed: false,
      squad: s.squad.includes(id) ? s.squad.filter((x) => x !== id) : [...s.squad, id],
    }));

  const closeSquad = () => {
    setState((s) => {
      const picks = Object.fromEntries(Object.entries(s.picks).filter(([, id]) => s.squad.includes(id)));
      return { ...s, picks, squadClosed: true };
    });
    setView("lineup");
  };

  const pick = (id: string | null) => {
    if (activeSlot === null) return;
    const key = pickKey(state.formation, activeSlot);
    setState((s) => {
      const picks = { ...s.picks };
      if (id) picks[key] = id;
      else delete picks[key];
      return { ...s, picks, lineupClosed: false };
    });
    setActiveSlot(null);
  };

  const reset = () =>
    setState((s) => {
      const picks = { ...s.picks };
      slots.forEach((_, i) => delete picks[pickKey(s.formation, i)]);
      return { ...s, picks, lineupClosed: false };
    });

  if (view === "squad") {
    return (
      <div className="mx-auto w-full max-w-[480px]">
        <SquadPage
          teamName={state.teamName}
          onTeamName={(teamName) => setState((s) => ({ ...s, teamName }))}
          players={players}
          status={status}
          squad={state.squad}
          onToggle={toggleSquad}
          onClose={closeSquad}
          minPlayers={FORMATIONS[state.formation].length}
        />
      </div>
    );
  }

  if (view === "bench") {
    return (
      <div className="mx-auto w-full max-w-[480px]">
        <BenchPage teamName={state.teamName} bench={bench} starters={starterSlots} closed={state.lineupClosed} onSubstitute={substitute} onBack={() => setView("lineup")} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-[18px] px-4 pt-6 pb-10">
      <Header teamName={state.teamName}>
        <p className="m-0 font-marker text-[clamp(22px,7vw,30px)] leading-[1.15] truncate">{state.teamName.trim() || "Meu Time"}</p>
      </Header>

      <div role="group" aria-label="Esquema tático" className="no-scrollbar flex gap-2 overflow-x-auto pt-0.5 pb-1">
        {Object.keys(FORMATIONS).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={key === state.formation}
            onClick={() => setState((s) => ({ ...s, formation: key, lineupClosed: false }))}
            className="flex-none cursor-pointer rounded-full border-[1.5px] border-line bg-chalk/[.06] px-3.5 py-2 text-[15px] font-bold leading-none tracking-wide transition active:scale-95 aria-pressed:border-amber aria-pressed:bg-amber aria-pressed:text-amber-ink"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-chalk/[.14]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber to-[#EE6A3A] transition-[width] duration-200"
            style={{ width: `${(filled / slots.length) * 100}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-sm font-bold leading-none tabular-nums text-chalk-dim">
          {filled}/{slots.length} escalados
        </span>
      </div>

      <Field formation={state.formation} picks={state.picks} playersById={playersById} onSlotClick={setActiveSlot} />

      <div className="flex gap-2.5">
        <button type="button" onClick={() => setView("bench")} className={btn}>
          Ver reservas ({state.lineupClosed ? bench.length : 0})
        </button>
        {state.lineupClosed ? (
          <button type="button" onClick={() => setState((s) => ({ ...s, lineupClosed: false }))} className={btn}>
            Reabrir escalação
          </button>
        ) : (
          <button type="button" disabled={!lineupFull} onClick={() => setState((s) => ({ ...s, lineupClosed: true }))} className={btnPrimary}>
            Fechar escalação
          </button>
        )}
      </div>

      <div className="flex gap-2.5">
        <button type="button" onClick={() => setView("squad")} className={btn}>
          Editar time
        </button>
        <button type="button" onClick={reset} className={btn}>
          Nova escalação
        </button>
      </div>
      <button
        type="button"
        onClick={async () => setResultImg(await buildImage(state, playersById, state.lineupClosed ? bench : []))}
        className={`${btnPrimary} flex-none`}
      >
        Gerar imagem
      </button>

      <p className="m-0 text-center text-[13px] font-semibold leading-normal tracking-wide text-chalk-dim">
        Toque em cada camisa pra escolher o jogador. Ao escalar os {slots.length}, feche a escalação: os demais vão para o banco de reservas.
      </p>

      {activeSlot !== null && (
        <PlayerPicker
          slotLabel={slots[activeSlot].p}
          players={squadPlayers}
          status={status}
          currentId={state.picks[pickKey(state.formation, activeSlot)]}
          takenIds={starterSet}
          onPick={pick}
          onClose={() => setActiveSlot(null)}
        />
      )}
      {resultImg && <ResultModal src={resultImg} onClose={() => setResultImg(null)} />}
    </div>
  );
}
