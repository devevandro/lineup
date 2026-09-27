import type { PlayerRow } from "../../types";
import { FORMATIONS } from "./formations";
import { displayName } from "./players";
import { pickKey, type LineupState } from "./state";

import { TEAM_SYMBOL } from "./symbol";

async function fetchBitmap(src: string): Promise<ImageBitmap | null> {
  try {
    const res = await fetch(src, { mode: "cors", cache: "no-cache" });
    if (!res.ok) return null;
    return await createImageBitmap(await res.blob());
  } catch {
    return null;
  }
}

async function loadImage(src: string): Promise<ImageBitmap | null> {
  // a cached opaque (no-cors) copy from a plain <img> makes the first fetch fail; retry with a distinct URL
  const first = await fetchBitmap(src);
  if (first) return first;
  return fetchBitmap(`${src}${src.includes("?") ? "&" : "?"}export=1`);
}

function wrapNames(ctx: CanvasRenderingContext2D, names: string[], maxW: number) {
  const lines: string[] = [];
  let cur = "";
  for (const n of names) {
    const next = cur ? `${cur}  ·  ${n}` : n;
    if (cur && ctx.measureText(next).width > maxW) {
      lines.push(cur);
      cur = n;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function buildImage(state: LineupState, playersById: Map<string, PlayerRow>, bench: PlayerRow[] = []) {
  const scale = 9;
  const fieldW = 100 * scale;
  const fieldH = 145 * scale;
  const headerH = Math.round(fieldW * 0.34);
  const W = fieldW;

  try {
    await Promise.all([
      document.fonts.load(`800 ${Math.round(fieldW * 0.09)}px "Permanent Marker"`),
      document.fonts.load('800 40px "Barlow Condensed"'),
      document.fonts.load('700 40px "Barlow Condensed"'),
    ]);
  } catch {}

  const slots = FORMATIONS[state.formation];
  const starters = slots.map((_, i) => playersById.get(state.picks[pickKey(state.formation, i)]));
  const symbol = await loadImage(TEAM_SYMBOL);
  const photos = await Promise.all(starters.map((p) => (p?.image ? loadImage(p.image) : Promise.resolve(null))));

  // footer: bench names (only when the lineup is closed)
  const nameFont = 34;
  const lineH = nameFont * 1.35;
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `700 ${nameFont}px "Barlow Condensed"`;
  const benchLines = wrapNames(measure, bench.map((p) => displayName(p).toUpperCase()), W - 80);
  const footerH = benchLines.length ? Math.round((1 + benchLines.length) * lineH + 60) : 0;
  const H = headerH + fieldH + footerH;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1f4a34");
  bg.addColorStop(1, "#0d2318");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // header
  const teamName = state.teamName.trim() || "Meu Time";
  const crestR = headerH * 0.3;
  const crestCx = W * 0.16;
  const crestCy = headerH * 0.5;
  if (symbol) {
    const size = crestR * 2.3;
    const k = Math.min(size / symbol.width, size / symbol.height);
    ctx.drawImage(symbol, crestCx - (symbol.width * k) / 2, crestCy - (symbol.height * k) / 2, symbol.width * k, symbol.height * k);
  }

  const textX = W * 0.16 + crestR + 30;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f4f1e6";
  ctx.font = `800 ${Math.round(headerH * 0.2)}px "Permanent Marker"`;
  let displayTeam = teamName;
  while (ctx.measureText(displayTeam).width > W - textX - 20 && displayTeam.length > 3) {
    displayTeam = displayTeam.slice(0, -1);
  }
  ctx.fillText(displayTeam, textX, headerH * 0.52);

  ctx.fillStyle = "rgba(244,241,230,.7)";
  ctx.font = `700 ${Math.round(headerH * 0.09)}px "Barlow Condensed"`;
  ctx.fillText(`Esquema ${state.formation}`, textX, headerH * 0.74);

  // pitch
  ctx.save();
  ctx.translate(0, headerH);
  for (let i = 0; i < 15; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#1f5138" : "#1a4630";
    ctx.fillRect(0, i * (fieldH / 15), fieldW, fieldH / 15 + 1);
  }
  ctx.strokeStyle = "rgba(244,241,230,.55)";
  ctx.lineWidth = Math.max(1, scale * 0.09);
  ctx.fillStyle = "rgba(244,241,230,.55)";

  const S = (v: number) => v * scale;
  const rect = (x: number, y: number, w: number, h: number) => ctx.strokeRect(S(x), S(y), S(w), S(h));
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(S(x1), S(y1));
    ctx.lineTo(S(x2), S(y2));
    ctx.stroke();
  };
  const circle = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.arc(S(cx), S(cy), S(r), 0, Math.PI * 2);
    ctx.stroke();
  };
  const dot = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.arc(S(cx), S(cy), S(r), 0, Math.PI * 2);
    ctx.fill();
  };
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
    ctx.beginPath();
    ctx.arc(S(cx), S(cy), S(r), a0, a1);
    ctx.stroke();
  };

  rect(4, 4, 92, 137);
  line(4, 72.5, 96, 72.5);
  circle(50, 72.5, 12);
  dot(50, 72.5, 0.8);
  rect(25, 4, 50, 22);
  rect(38, 4, 24, 8);
  dot(50, 20, 0.8);
  arc(50, 20, 10, 0.7297, 2.4119);
  rect(25, 119, 50, 22);
  rect(38, 133, 24, 8);
  dot(50, 125, 0.8);
  arc(50, 125, 10, 3.8715, 5.5537);
  ctx.restore();

  // slots
  ctx.textAlign = "center";
  slots.forEach((slot, i) => {
    const player = starters[i];
    const photo = photos[i];
    const cx = slot.x * scale;
    const cy = headerH + (slot.y / 100) * fieldH;
    const r = scale * 6.2;

    if (photo) {
      // transparent cutout: no jersey circle behind it
      const bw = r * 2.15;
      const bh = r * 2.8;
      const k = Math.min(bw / photo.width, bh / photo.height);
      const w = photo.width * k;
      const h = photo.height * k;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.45)";
      ctx.shadowBlur = scale * 0.8;
      ctx.shadowOffsetY = scale * 0.3;
      ctx.drawImage(photo, cx - w / 2, cy - h / 2, w, h);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy + scale * 0.25, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#DB4108";
      ctx.fill();
      ctx.lineWidth = scale * 0.22;
      ctx.strokeStyle = "#0d2016";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = `800 ${Math.round(r * 0.74)}px "Barlow Condensed"`;
      ctx.textBaseline = "middle";
      ctx.fillText(slot.p, cx, cy + r * 0.06);
    }

    const tapeW = scale * 20;
    const tapeH = scale * 7.4;
    ctx.save();
    ctx.translate(cx, cy + r + scale * 3.6);
    ctx.rotate((-1.1 * Math.PI) / 180);
    ctx.fillStyle = "#f4f1e6";
    ctx.beginPath();
    const rr = scale * 0.6;
    ctx.moveTo(-tapeW / 2 + rr, -tapeH / 2);
    ctx.arcTo(tapeW / 2, -tapeH / 2, tapeW / 2, tapeH / 2, rr);
    ctx.arcTo(tapeW / 2, tapeH / 2, -tapeW / 2, tapeH / 2, rr);
    ctx.arcTo(-tapeW / 2, tapeH / 2, -tapeW / 2, -tapeH / 2, rr);
    ctx.arcTo(-tapeW / 2, -tapeH / 2, tapeW / 2, -tapeH / 2, rr);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = player ? "#0d2016" : "#8a8577";
    ctx.font = `700 ${Math.round(tapeH * 0.5)}px "Barlow Condensed"`;
    ctx.textBaseline = "middle";
    let label = (player ? displayName(player) : "a escalar").toUpperCase();
    while (ctx.measureText(label).width > tapeW - scale * 2 && label.length > 3) {
      label = label.slice(0, -1);
    }
    ctx.fillText(label, 0, tapeH * 0.06);
    ctx.restore();
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let y = headerH + fieldH + 30 + lineH / 2;
  const section = (title: string, lines: string[]) => {
    ctx.fillStyle = "#DB4108";
    ctx.font = `700 ${Math.round(nameFont * 0.8)}px "Barlow Condensed"`;
    ctx.fillText(title, W / 2, y);
    y += lineH;
    ctx.fillStyle = "#f4f1e6";
    ctx.font = `700 ${nameFont}px "Barlow Condensed"`;
    for (const l of lines) {
      ctx.fillText(l, W / 2, y);
      y += lineH;
    }
  };
  if (benchLines.length) section("RESERVAS", benchLines);

  return canvas.toDataURL("image/png");
}
