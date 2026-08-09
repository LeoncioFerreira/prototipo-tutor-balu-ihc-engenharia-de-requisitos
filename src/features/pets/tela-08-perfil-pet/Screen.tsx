import { MobileShell } from "../../../components/ui/MobileShell";
import { PetSectionHeader } from "../../../components/ui/PetSectionHeader";

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
        <PetSectionHeader title="Perfil do Pet" active="overview" onBack={onBack} onOpen={onOpen} />
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
