import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader } from "../../../components/ui/ScreenPrimitives";
export function WalletScreen() {
  return (
    <MobileShell>
      <PageHeader title="Carteira do Pet" onBack={() => history.back()} />
      <section className="rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white p-4 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-4xl">
          🐾
        </div>
        <h2 className="mt-2 text-lg font-bold">Balu</h2>
        <p className="text-xs text-[#4a5568]">Samoieda • 2 anos • 22 kg</p>
      </section>
      <nav className="mt-5 flex gap-2 overflow-auto">
        <button className="rounded-full border border-[#b2f5ea] bg-[#e6f7f4] px-4 py-2 text-xs font-bold">
          Vacinas
        </button>
        <button className="rounded-full border px-4 py-2 text-xs">Consultas</button>
        <button className="rounded-full border px-4 py-2 text-xs">Exames</button>
        <button className="rounded-full border px-4 py-2 text-xs">Docs</button>
      </nav>
      <article className="mt-5 rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-4">
        <div className="flex justify-between">
          <h3 className="font-bold">Carteira sincronizada</h3>
          <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-[10px] font-bold text-[#48bb78]">
            No app
          </span>
        </div>
        <p className="mt-2 text-xs text-[#4a5568]">
          Vacinas e registros recentes do Balu em um só lugar.
        </p>
        <span className="mt-3 inline-block rounded-full bg-[#e6f7f4] px-3 py-1 text-[10px] font-bold text-[#24b09c]">
          Vacinação em dia
        </span>
      </article>
      <article className="mt-3 rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-4">
        <b>Vacina antirrábica</b>
        <p className="mt-2 text-xs text-[#4a5568]">
          Aplicada em 12/08/2025 • Próxima dose em agosto.
        </p>
      </article>
    </MobileShell>
  );
}
