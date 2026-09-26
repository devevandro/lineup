export default function ResultModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-5 bg-[rgb(6_14_10/.82)]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] max-h-[90vh] flex flex-col gap-3 p-4 rounded-2xl border border-line bg-board-dark shadow-card">
        <div className="overflow-auto rounded-[10px]">
          <img src={src} alt="Imagem da escalação" className="block w-full rounded-[10px] shadow-[0_4px_20px_rgb(0_0_0/.4)]" />
        </div>
        <p className="m-0 text-center text-sm font-semibold leading-snug text-chalk-dim">
          Fica salvo? Não por aqui.
          <br />
          <b className="text-amber">Toque e segure a imagem</b> (ou clique com o botão direito) para salvar e compartilhar.
        </p>
        <button type="button" onClick={onClose} className="self-center px-4 py-2 text-sm font-bold uppercase tracking-widest cursor-pointer">
          Fechar
        </button>
      </div>
    </div>
  );
}
