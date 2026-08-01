import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

const cards = [
  [
    "Rotina do pet",
    "Cadastre alimentação, passeios e banho com lembretes.",
    "Hoje",
    "Abrir rotina",
    "9",
  ],
  [
    "Medicamentos",
    "Veja prescrições da clínica, doses em andamento e próximos horários.",
    "Em uso",
    "Abrir remédios",
    "10",
  ],
  [
    "Carteira de saúde",
    "Consulte vacinas, exames e prontuário do pet.",
    "Saúde",
    "Abrir carteira de saúde",
    "11",
  ],
] as const;

export function PetProfileScreen({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen?: (screen: string) => void;
}) {
  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="pet-profile-screen">
        <header className="mt-1 flex items-center gap-3">
          <button type="button" aria-label="Voltar" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-[20px] font-bold leading-[25px]">Perfil do Pet</h1>
        </header>
        <section className="mt-[27px] h-[170px] rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white pt-[15px] text-center shadow-[0_8px_16px_rgba(26,54,93,.04)]">
          <img src="/assets/figma/pets/pet-avatar.svg" alt="" className="mx-auto h-20 w-20" />
          <h2 className="mt-1 text-[18px] font-bold leading-6">Balu</h2>
          <div className="mt-2 flex justify-center gap-[31px] text-[11px] font-semibold leading-3 text-[#4a5568]">
            <span className="rounded-full bg-[#f2f4f5] px-2.5 py-[6px]">Samoieda</span>
            <span className="rounded-full bg-[#f2f4f5] px-5 py-[6px]">2 anos</span>
            <span className="rounded-full bg-[#f2f4f5] px-[22px] py-[6px]">22 kg</span>
          </div>
        </section>
        <nav className="mt-5 flex h-11 items-start justify-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => onOpen?.("8")}
            className="h-[30px] rounded-full border-[1.25px] border-[#b2f5ea] bg-white px-3 font-bold"
          >
            Visão geral
          </button>
          <button
            type="button"
            onClick={() => onOpen?.("9")}
            className="h-[30px] rounded-full border border-[#e2e8f0] bg-white px-3 text-[#717e91]"
          >
            Ver rotina
          </button>
          <button
            type="button"
            onClick={() => onOpen?.("10")}
            className="h-[30px] rounded-full border border-[#e2e8f0] bg-white px-3 text-[#717e91]"
          >
            Ver remédios
          </button>
          <button
            type="button"
            onClick={() => onOpen?.("11")}
            className="h-[30px] rounded-full border border-[#e2e8f0] bg-white px-3 text-[#717e91]"
          >
            Ver carteira
          </button>
        </nav>
        <div className="mt-4 space-y-4">
          {cards.map(([title, text, status, action, screen], index) => (
            <article
              key={title}
              className={`rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-3 ${index === 2 ? "h-[106px]" : "h-[116px]"}`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[14px] font-bold leading-[18px]">{title}</h3>
                <span className="rounded-full bg-[#e6f7f4] px-4 py-[6px] text-[10px] font-bold leading-[10px] text-[#ed8936]">
                  {status}
                </span>
              </div>
              <p className="mt-2 max-w-[300px] text-[12px] font-semibold leading-[15px] text-[#4a5568]">
                {text}
              </p>
              <button
                onClick={() => onOpen?.(screen)}
                className="mt-2 rounded-full bg-[#183a78] px-3 py-[7px] text-[11px] font-bold leading-[14px] text-white"
              >
                {action}
              </button>
            </article>
          ))}
        </div>
        <button
          onClick={() => onOpen?.("12")}
          className="mt-2 h-12 w-full rounded-full bg-[#183a78] text-sm font-bold text-white"
        >
          Gerenciar cuidadores
        </button>
      </div>
    </MobileShell>
  );
}
