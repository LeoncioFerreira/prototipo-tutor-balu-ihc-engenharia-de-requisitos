import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader } from "../../../components/ui/ScreenPrimitives";
export function SharedCareScreen() {
  const people = [
    ["L", "Leôncio"],
    ["P", "Paulo"],
    ["A", "André"],
  ];
  return (
    <MobileShell>
      <PageHeader title="Cuidado Compartilhado" onBack={() => history.back()} />
      <h2 className="text-sm font-bold">Cuidadores de Balu</h2>
      <div className="mt-4 flex justify-between">
        {people.map(([initial, name]) => (
          <div key={name} className="w-[74px] text-center">
            <span className="mx-auto grid h-[52px] w-[52px] place-items-center rounded-full border border-[#b2f5ea] bg-[#e6fffa] font-bold">
              {initial}
            </span>
            <b className="mt-2 block text-[11px]">{name}</b>
          </div>
        ))}
        <button className="w-[74px] text-center">
          <span className="mx-auto grid h-[52px] w-[52px] place-items-center rounded-full border border-dashed text-xl">
            +
          </span>
          <b className="mt-2 block text-[11px] text-[#4a5568]">Convidar</b>
        </button>
      </div>
      <h2 className="mt-8 text-sm font-bold">Histórico de Atividades</h2>
      <div className="mt-3 space-y-3">
        {[
          ["Paulo • Deu Vermífugo Chemital", "Hoje às 14:05"],
          ["Leôncio • Confirmou a alimentação", "Hoje às 08:12"],
          ["André • Registrou passeio diário", "Ontem às 18:25"],
        ].map(([title, time]) => (
          <article key={title} className="rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-4">
            <b className="text-xs">{title}</b>
            <p className="mt-1 text-[11px] text-[#4a5568]">{time}</p>
          </article>
        ))}
      </div>
      <button className="mt-5 w-full rounded-full bg-[#002045] py-3 text-sm font-bold text-white">
        Convidar tutor
      </button>
    </MobileShell>
  );
}
