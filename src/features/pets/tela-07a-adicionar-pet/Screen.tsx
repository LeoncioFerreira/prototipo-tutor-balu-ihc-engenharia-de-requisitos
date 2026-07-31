import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";

export function AddPetScreen() {
  const fields = [
    ["Nome do pet", "Ex: Balu"],
    ["Raça", "Ex: Samoieda"],
    ["Sexo", "Macho ou fêmea"],
    ["Idade", "Ex: 2 anos"],
  ];
  return (
    <MobileShell>
      <PageHeader
        title="Adicionar pet"
        subtitle="Cadastre um novo pet sem sair da sua área principal."
        onBack={() => history.back()}
      />
      <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-4xl">
        🐾
      </div>
      <section>
        <h2 className="text-sm font-extrabold text-[#183a78]">Dados do pet</h2>
        <div className="mt-2 space-y-3">
          {fields.map(([label, placeholder]) => (
            <label key={label} className="block text-xs font-semibold text-[#4a5568]">
              {label}
              <input
                placeholder={placeholder}
                className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
              />
            </label>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="text-[15px] font-extrabold text-[#183a78]">Cuidado compartilhado</h2>
        <div className="mt-3 rounded-[18px] border border-[#b2f5ea] bg-[#e6fffa] p-3">
          <b className="text-sm text-[#183a78]">Vincular outros tutores</b>
          <p className="mt-1 text-[13px] leading-[18px] text-[#4a5568]">
            Convide outra pessoa responsável para acompanhar lembretes, rotinas e histórico do pet.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-full bg-[#183a78] px-3.5 py-2 text-[13px] font-semibold text-white">
              Convidar tutor
            </button>
            <button className="rounded-full border border-[#c2cad9] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#4a5568]">
              Adicionar depois
            </button>
          </div>
        </div>
      </section>
      <div className="mt-6">
        <PrimaryButton>Continuar</PrimaryButton>
      </div>
    </MobileShell>
  );
}
