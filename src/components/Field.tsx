import type { PlayerRow } from "../../types";
import { FORMATIONS } from "../lib/formations";
import { displayName } from "../lib/players";
import { pickKey } from "../lib/state";

type Props = {
  formation: string;
  picks: Record<string, string>;
  playersById: Map<string, PlayerRow>;
  onSlotClick: (index: number) => void;
};

export default function Field({ formation, picks, playersById, onSlotClick }: Props) {
  return (
    <div className="pitch-stripes relative w-full aspect-[100/145] rounded-[14px] overflow-hidden shadow-card [container-type:inline-size]">
      <svg viewBox="0 0 100 145" preserveAspectRatio="none" className="absolute inset-0 block size-full">
        <rect className="field-lines" x="4" y="4" width="92" height="137" />
        <line className="field-lines" x1="4" y1="72.5" x2="96" y2="72.5" />
        <circle className="field-lines" cx="50" cy="72.5" r="12" />
        <circle className="field-dot" cx="50" cy="72.5" r="0.8" />
        <rect className="field-lines" x="25" y="4" width="50" height="22" />
        <rect className="field-lines" x="38" y="4" width="24" height="8" />
        <circle className="field-dot" cx="50" cy="20" r="0.8" />
        <path className="field-lines" d="M 42 26 A 10 10 0 0 0 58 26" />
        <rect className="field-lines" x="44" y="2" width="12" height="2" />
        <rect className="field-lines" x="25" y="119" width="50" height="22" />
        <rect className="field-lines" x="38" y="133" width="24" height="8" />
        <circle className="field-dot" cx="50" cy="125" r="0.8" />
        <path className="field-lines" d="M 42 119 A 10 10 0 0 1 58 119" />
        <rect className="field-lines" x="44" y="141" width="12" height="2" />
        <path className="field-lines" d="M 4 7 A 3 3 0 0 0 7 4" />
        <path className="field-lines" d="M 93 4 A 3 3 0 0 0 96 7" />
        <path className="field-lines" d="M 96 138 A 3 3 0 0 0 93 141" />
        <path className="field-lines" d="M 7 141 A 3 3 0 0 0 4 138" />
      </svg>

      {FORMATIONS[formation].map((slot, i) => {
        const player = playersById.get(picks[pickKey(formation, i)]);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSlotClick(i)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[4cqw] w-[24cqw] cursor-pointer bg-transparent border-0 p-0 text-inherit"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            {player?.image ? (
              <img src={player.image} alt="" className="h-[17cqw] w-[13cqw] select-none object-contain drop-shadow-[0_3px_4px_rgb(0_0_0/.45)]" />
            ) : (
              <span className="size-[12cqw] min-w-[30px] min-h-[30px] rounded-full bg-amber border-2 border-ink flex items-center justify-center text-amber-ink font-extrabold select-none shadow-[0_2px_0_rgb(0_0_0/.35),inset_0_-3px_0_rgb(0_0_0/.15)]">
                <span className="text-[clamp(10px,4.6cqw,15px)] leading-none">{slot.p}</span>
              </span>
            )}
            <span
              className={`w-full text-center rounded-[3px] px-0.5 py-[3px] font-bold leading-[1.1] uppercase -rotate-[1.1deg] shadow-[0_2px_0_rgb(0_0_0/.25)] bg-chalk text-[clamp(9px,3.7cqw,13px)] truncate ${
                player ? "text-ink" : "text-[#8a8577] normal-case font-semibold"
              }`}
            >
              {player ? displayName(player) : slot.p}
            </span>
          </button>
        );
      })}
    </div>
  );
}
