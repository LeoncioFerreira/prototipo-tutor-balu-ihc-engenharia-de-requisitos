import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader } from "../../../components/ui/ScreenPrimitives";
const tasks = [
  ["08:00 • Alimentação", "Ração premium e água trocada para o Balu.", "Feito"],
  ["14:00 • Vermífugo Chemital", "1/2 comprimido via oral agendado para esta tarde.", "Hoje"],
  ["18:00 • Passeio diário", "Passeio curto no fim da tarde para manter a rotina.", "20 min"],
];
export function RoutineScreen() {
  return (
    <MobileShell>
      <PageHeader title="Ver rotina" onBack={() => history.back()} />
      <section className="rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white p-4 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e6fffa] text-3xl">
          🐾
        </div>
        <h2 className="mt-1 text-lg font-bold">Balu</h2>
        <p className="text-xs text-[#4a5568]">Samoieda • 2 anos • 22 kg</p>
      </section>
      <nav className="mt-5 flex gap-2">
        <button className="rounded-full border border-[#b2f5ea] bg-[#e6f7f4] px-4 py-2 text-xs font-bold">
          Hoje
        </button>
        <button className="rounded-full border px-4 py-2 text-xs">Semanal</button>
        <button className="rounded-full border px-4 py-2 text-xs">Banho</button>
        <button className="rounded-full border px-4 py-2 text-xs">Histórico</button>
      </nav>
      <div className="mt-4 space-y-3">
        {tasks.map(([title, text, status], index) => (
          <article key={title} className="rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-3">
            <div className="flex justify-between">
              <b className="text-sm">{title}</b>
              <span className="rounded-full bg-[#e6f7f4] px-3 py-1 text-[10px] font-bold">
                {status}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#4a5568]">{text}</p>
            {index > 0 && (
              <input aria-label={title} type="checkbox" className="mt-3 h-6 w-6 accent-[#24b09c]" />
            )}
          </article>
        ))}
      </div>
      <button className="mt-4 w-full rounded-full border-2 border-[#002045] py-3 text-sm font-bold">
        Cadastrar nova rotina
      </button>
    </MobileShell>
  );
}
