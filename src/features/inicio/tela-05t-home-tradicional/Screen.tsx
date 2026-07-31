import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";

export function TraditionalHomeScreen() {
  const [medicine, setMedicine] = useState(false);
  const [walk, setWalk] = useState(false);
  return (
    <MobileShell>
      <header className="flex items-center justify-between">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#b2f5ea] font-bold">
            L
          </span>
          <div>
            <small className="text-[#4a5568]">Bom dia!</small>
            <h1 className="text-lg font-extrabold">Olá, Leôncio!</h1>
          </div>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-[#e6f7f4]">🔔</button>
      </header>
      <section className="mt-5 flex gap-4 text-center text-xs">
        <span>
          🐶<b className="mt-1 block">Balu</b>
        </span>
        <span>
          🐾<b className="mt-1 block">Pipoca</b>
        </span>
        <span>
          🐾<b className="mt-1 block">Pretinha</b>
        </span>
        <span>
          ＋<b className="mt-1 block">Adicionar</b>
        </span>
      </section>
      <h2 className="mt-7 text-base font-extrabold">Rotina de Hoje</h2>
      <div className="mt-3 space-y-3">
        <article className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
          <b>08:00 • Alimentação</b>
          <p className="text-xs text-[#4a5568]">Ração Seca Premier • Feito por Leôncio</p>
          <span className="mt-2 inline-block rounded-lg bg-[#dcfce7] px-2 py-1 text-[10px] text-[#48bb78]">
            Concluído
          </span>
        </article>
        <label className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4">
          <span>
            <b>14:00 • Vermífugo Chemital</b>
            <small className="block text-[#4a5568]">Dar 1/2 comprimido via oral</small>
          </span>
          <input
            aria-label="Vermífugo Chemital"
            checked={medicine}
            onChange={() => setMedicine(!medicine)}
            type="checkbox"
            className="h-7 w-7 accent-[#24b09c]"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4">
          <span>
            <b>18:00 • Passeio Diário</b>
            <small className="block text-[#4a5568]">Meta diária: 20 min de caminhada</small>
          </span>
          <input
            aria-label="Passeio Diário"
            checked={walk}
            onChange={() => setWalk(!walk)}
            type="checkbox"
            className="h-7 w-7 accent-[#24b09c]"
          />
        </label>
      </div>
    </MobileShell>
  );
}
