export type Slot = { p: string; x: number; y: number };

const RAW: Record<string, Slot[]> = {
  "4-3-3": [
    { p: "GOL", x: 50, y: 94 },
    { p: "LE", x: 14, y: 78 }, { p: "ZAG", x: 36, y: 82 }, { p: "ZAG", x: 64, y: 82 }, { p: "LD", x: 86, y: 78 },
    { p: "VOL", x: 50, y: 60 },
    { p: "MEI", x: 26, y: 44 }, { p: "MEI", x: 74, y: 44 },
    { p: "PE", x: 14, y: 20 }, { p: "ATA", x: 50, y: 12 }, { p: "PD", x: 86, y: 20 },
  ],
  "4-4-2": [
    { p: "GOL", x: 50, y: 94 },
    { p: "LE", x: 14, y: 78 }, { p: "ZAG", x: 36, y: 82 }, { p: "ZAG", x: 64, y: 82 }, { p: "LD", x: 86, y: 78 },
    { p: "ME", x: 14, y: 52 }, { p: "MC", x: 38, y: 56 }, { p: "MC", x: 62, y: 56 }, { p: "MD", x: 86, y: 52 },
    { p: "ATA", x: 36, y: 16 }, { p: "ATA", x: 64, y: 16 },
  ],
  "3-5-2": [
    { p: "GOL", x: 50, y: 94 },
    { p: "ZAG", x: 28, y: 82 }, { p: "ZAG", x: 50, y: 86 }, { p: "ZAG", x: 72, y: 82 },
    { p: "ME", x: 12, y: 54 }, { p: "MC", x: 33, y: 60 }, { p: "VOL", x: 50, y: 64 }, { p: "MC", x: 67, y: 60 }, { p: "MD", x: 88, y: 54 },
    { p: "ATA", x: 38, y: 18 }, { p: "ATA", x: 62, y: 18 },
  ],
  "4-2-3-1": [
    { p: "GOL", x: 50, y: 94 },
    { p: "LE", x: 14, y: 78 }, { p: "ZAG", x: 36, y: 82 }, { p: "ZAG", x: 64, y: 82 }, { p: "LD", x: 86, y: 78 },
    { p: "VOL", x: 38, y: 60 }, { p: "VOL", x: 62, y: 60 },
    { p: "PE", x: 14, y: 38 }, { p: "MEI", x: 50, y: 34 }, { p: "PD", x: 86, y: 38 },
    { p: "ATA", x: 50, y: 14 },
  ],
  "3-4-3": [
    { p: "GOL", x: 50, y: 94 },
    { p: "ZAG", x: 28, y: 82 }, { p: "ZAG", x: 50, y: 86 }, { p: "ZAG", x: 72, y: 82 },
    { p: "ME", x: 14, y: 54 }, { p: "MC", x: 36, y: 58 }, { p: "MC", x: 64, y: 58 }, { p: "MD", x: 86, y: 54 },
    { p: "PE", x: 18, y: 20 }, { p: "ATA", x: 50, y: 12 }, { p: "PD", x: 82, y: 20 },
  ],
};

export const DEFAULT_FORMATION = "4-3-3";

// Goalkeeper sits inside the own goal area; outfield lines are compressed
// upward so nothing overlaps the keeper.
export const FORMATIONS: Record<string, Slot[]> = Object.fromEntries(
  Object.entries(RAW).map(([key, slots]) => [
    key,
    slots.map((s) =>
      s.p === "GOL" ? { ...s, y: 86 } : { ...s, y: Math.round(11 + ((s.y - 12) * 61) / 74) },
    ),
  ]),
);
