import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader } from "../../../components/ui/ScreenPrimitives";
const cards = [
  [
    "Rotina do pet",
    "Cadastre alimentação, passeios e banho com lembretes.",
    "Hoje",
    "Abrir rotina",
  ],
  [
    "Medicamentos",
    "Veja prescrições da clínica, doses em andamento e próximos horários.",
    "Em uso",
    "Abrir remédios",
  ],
  [
    "Carteira de saúde",
    "Consulte vacinas, exames e prontuário do pet.",
    "Saúde",
    "Abrir carteira de saúde",
  ],
];
export function PetProfileScreen() {
  return (
    <MobileShell>
      <PageHeader title="Perfil do Pet" onBack={() => history.back()} />
      <section className="rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white p-4 text-center shadow-[0_8px_16px_rgba(26,54,93,.04)]">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-4xl">
          🐾
        </div>
        <h2 className="mt-2 text-lg font-bold">Balu</h2>
        <div className="mt-3 flex justify-center gap-3 text-[11px] font-semibold text-[#4a5568]">
          <span>Samoieda</span>
          <span>2 anos</span>
          <span>22 kg</span>
        </div>
      </section>
      <nav className="mt-5 flex gap-2 overflow-auto text-[10px]">
        <button className="rounded-full border border-[#b2f5ea] px-3 py-2 font-bold">
          Visão geral
        </button>
        <button className="rounded-full border border-[#e2e8f0] px-3 py-2">Ver rotina</button>
        <button className="rounded-full border border-[#e2e8f0] px-3 py-2">Ver remédios</button>
        <button className="rounded-full border border-[#e2e8f0] px-3 py-2">Ver carteira</button>
      </nav>
      <div className="mt-4 space-y-4">
        {cards.map(([title, text, status, action]) => (
          <article key={title} className="rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-3">
            <div className="flex justify-between">
              <h3 className="font-bold">{title}</h3>
              <span className="rounded-full bg-[#e6f7f4] px-3 py-1 text-[10px] font-bold">
                {status}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#4a5568]">{text}</p>
            <button className="mt-3 rounded-full bg-[#002045] px-3 py-2 text-[11px] font-bold text-white">
              {action}
            </button>
          </article>
        ))}
      </div>
      <button className="mt-4 w-full rounded-full bg-[#002045] py-3 text-sm font-bold text-white">
        Gerenciar cuidadores
      </button>
    </MobileShell>
  );
}
