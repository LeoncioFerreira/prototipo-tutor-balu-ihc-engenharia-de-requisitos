import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

const fields = [
  ["Nome do pet", "Ex: Balu"],
  ["Raça", "Ex: Samoieda"],
  ["Sexo", "Macho ou fêmea"],
  ["Idade", "Ex: 2 anos"],
] as const;

export function AddPetScreen({ onBack }: { onBack: () => void }) {
  return (
    <MobileShell padded={false}>
      <div className="add-pet-screen min-h-[100dvh] bg-white px-5 pb-8 pt-11 text-[#183a78]">
        <header className="flex h-[70px] items-start gap-3">
          <button type="button" aria-label="Voltar" onClick={onBack} className="mt-0.5">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold leading-[30px]">Adicionar pet</h1>
            <p className="mt-1 text-[13px] font-medium leading-[18px] text-[#4a5668]">
              Cadastre um novo pet sem sair da sua área principal.
            </p>
          </div>
        </header>

        <div className="mt-1 grid h-24 place-items-center">
          <img src="/assets/figma/home/11.svg" alt="" className="h-20 w-20" />
        </div>

        <section className="mt-3">
          <h2 className="text-[14px] font-extrabold text-[#183a78]">Dados do pet</h2>
          <p className="required-note">* indica campo obrigatório</p>
          <div className="mt-2 space-y-2">
            {fields.map(([label, placeholder]) => (
              <label
                key={label}
                className="block text-[12px] font-semibold leading-[15px] text-[#4a5568]"
              >
                {label} <span className="required-mark">*</span>
                <input
                  aria-label={label}
                  placeholder={placeholder}
                  required
                  className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-[14px] font-normal text-[#183a78] placeholder:text-[#737885]"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="mt-3">
          <h2 className="text-[15px] font-extrabold leading-[18px] text-[#183a78]">
            Cuidado compartilhado
          </h2>
          <div className="mt-[14px] rounded-[18px] border border-[#b2f5ea] bg-[#e6fffa] p-3">
            <div className="flex gap-3">
              <img className="h-9 w-9 shrink-0" src="/assets/figma/pets/shared-care.svg" alt="" />
              <div>
                <b className="block text-[14px] font-semibold leading-[18px] text-[#183a78]">
                  Vincular outros tutores
                </b>
                <p className="mt-1 text-[13px] leading-[18px] text-[#4a5568]">
                  Convide outra pessoa responsável para acompanhar lembretes, rotinas e histórico do
                  pet.
                </p>
              </div>
            </div>
            <div className="mt-2.5 flex gap-2.5">
              <button className="rounded-full bg-[#183a78] px-3.5 py-[9px] text-[13px] font-semibold leading-4 text-white">
                Convidar tutor
              </button>
              <button className="rounded-full border border-[#e2e8f0] bg-white px-3.5 py-[9px] text-[13px] font-semibold leading-4 text-[#4a5568]">
                Adicionar depois
              </button>
            </div>
          </div>
        </section>

        <button className="mt-6 h-14 w-full rounded-[28px] bg-[#183a78] text-[16px] font-extrabold text-white shadow-[0_4px_20px_rgba(26,54,93,.08)]">
          Continuar
        </button>
      </div>
    </MobileShell>
  );
}
