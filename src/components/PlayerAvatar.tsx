import type { PlayerRow } from "../../types";
import { displayName } from "../lib/players";

export default function PlayerAvatar({ player, className = "size-12" }: { player: PlayerRow; className?: string }) {
  return (
    <span className={`${className} flex-none rounded-full overflow-hidden ${player.image ? "" : "bg-amber"} text-amber-ink flex items-center justify-center font-extrabold text-lg`}>
      {player.image ? <img src={player.image} alt="" className="size-full object-cover object-top" /> : displayName(player).charAt(0).toUpperCase()}
    </span>
  );
}
