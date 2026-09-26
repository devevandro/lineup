import { useState } from "react";

async function toFile(src: string) {
  const blob = await (await fetch(src)).blob();
  return new File([blob], "escalacao.png", { type: "image/png" });
}

export default function ResultModal({ src, onClose }: { src: string; onClose: () => void }) {
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const file = await toFile(src);
      // iOS: the share sheet offers "Salvar imagem"
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      // user cancelled the share sheet
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-5 bg-[rgb(6_14_10/.82)]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] max-h-[90vh] flex flex-col gap-3 p-4 rounded-2xl border border-line bg-board-dark shadow-card">
        <div className="overflow-auto rounded-[10px]">
          <img src={src} alt="Imagem da escalação" className="block w-full rounded-[10px] shadow-[0_4px_20px_rgb(0_0_0/.4)]" />
        </div>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="px-4 py-3 text-sm font-bold uppercase tracking-widest cursor-pointer bg-amber text-white rounded-xl disabled:opacity-60"
        >
          Baixar imagem
        </button>
        <button type="button" onClick={onClose} className="self-center px-4 py-2 text-sm font-bold uppercase tracking-widest cursor-pointer">
          Fechar
        </button>
      </div>
    </div>
  );
}
