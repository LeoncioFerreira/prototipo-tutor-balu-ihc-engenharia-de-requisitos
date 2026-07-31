import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader } from "../../../components/ui/ScreenPrimitives";

export function MedicinesScreen() {
  return (
    <MobileShell>
      <PageHeader title="Medicamentos do Pet" onBack={() => history.back()} />
      <section className="rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white p-4 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-4xl">
          🐾
        </div>
        <h2 className="mt-2 text-lg font-bold">Balu</h2>
        <p className="text-xs text-[#4a5568]">Samoieda • 2 anos • 22 kg</p>
      </section>
      <nav className="mt-5 flex gap-2 overflow-auto">
        <button className="rounded-full border border-[#b2f5ea] px-3 py-2 text-[10px] font-bold">
          Ver remédios
        </button>
        <button className="rounded-full border px-3 py-2 text-[10px]">Ver rotina</button>
        <button className="rounded-full border px-3 py-2 text-[10px]">Ver carteira</button>
      </nav>
      <nav className="mt-4 flex gap-2">
        <button className="rounded-full border border-[#b2f5ea] bg-[#e6f7f4] px-4 py-2 text-xs font-bold">
          Agora
        </button>
        <button className="rounded-full border px-4 py-2 text-xs">Próximos</button>
        <button className="rounded-full border px-4 py-2 text-xs">Hoje</button>
        <button className="rounded-full border px-4 py-2 text-xs">Histórico</button>
      </nav>
      <article className="mt-4 rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-4">
        <div className="flex justify-between">
          <h3 className="font-bold">Vermífugo Chemital</h3>
          <span className="rounded-full bg-[#feebc8] px-3 py-1 text-[10px] font-bold">Hoje</span>
        </div>
        <p className="mt-2 text-xs text-[#4a5568]">Dar 1/2 comprimido via oral às 14:00.</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-[#718096]">Prescrição ativa</span>
          <input
            aria-label="Confirmar Vermífugo Chemital"
            type="checkbox"
            className="h-6 w-6 accent-[#24b09c]"
          />
        </div>
      </article>
      <article className="mt-3 rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-4">
        <div className="flex justify-between">
          <h3 className="font-bold">Antipulgas</h3>
          <span className="rounded-full bg-[#e6f7f4] px-3 py-1 text-[10px] font-bold">Próximo</span>
        </div>
        <p className="mt-2 text-xs text-[#4a5568]">
          Aplicação mensal programada para 12 de agosto.
        </p>
      </article>
      <button className="mt-5 w-full rounded-full border-2 border-[#002045] py-3 text-sm font-bold">
        Adicionar medicamento
      </button>
    </MobileShell>
  );
}
