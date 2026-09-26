import type { ReactNode } from "react";
import { TEAM_SYMBOL } from "../lib/symbol";

export default function Header({ children }: { teamName?: string; children: ReactNode }) {
  return (
    <header className="flex items-center gap-3">
      <img src={TEAM_SYMBOL} alt="Símbolo do time" className="flex-none size-[52px] select-none object-contain drop-shadow-[0_6px_10px_rgb(0_0_0/.45)]" />
      <div className="flex-1 min-w-0">
        <p className="m-0 mb-0.5 text-xs font-bold uppercase leading-none tracking-[.14em] text-amber">Escale seu time</p>
        {children}
      </div>
    </header>
  );
}
