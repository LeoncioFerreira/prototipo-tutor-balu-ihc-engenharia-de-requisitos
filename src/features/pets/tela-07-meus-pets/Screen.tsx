import { MobileShell } from "../../../components/ui/MobileShell";

const pets = [
  ["B", "Balu", "Samoieda • 2 anos • 22 kg", ["Carteira atualizada", "Cuidado compartilhado"]],
  ["P", "Pipoca", "SRD • 4 anos • 12 kg", ["Próxima vacina em agosto"]],
  ["P", "Pretinha", "SRD • 3 anos • 9 kg", ["Carteira atualizada"]],
] as const;

export function MyPetsScreen() {
  return (
    <MobileShell>
      <h1 className="text-[20px] font-bold">Meus pets</h1>
      <section className="mt-10 rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white p-4 text-center shadow-[0_8px_16px_rgba(26,54,93,.04)]">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-4xl">
          🐾
        </div>
        <h2 className="mt-2 text-[18px] font-bold">Escolha um pet</h2>
        <div className="mt-3 flex justify-center gap-2 text-[11px] font-semibold text-[#4a5568]">
          <span className="rounded-full bg-[#f2f4f5] px-3 py-1.5">3 cadastrados</span>
          <span className="rounded-full bg-[#f2f4f5] px-3 py-1.5">1 principal</span>
          <span className="rounded-full bg-[#f2f4f5] px-3 py-1.5">2 compartilhados</span>
        </div>
      </section>
      <div className="mt-7 space-y-5">
        {pets.map(([initial, name, detail, badges]) => (
          <article key={name} className="rounded-[18px] border border-[#c2cad9] bg-white p-[13px]">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#b2f5ea] bg-[#e6fffa] text-[18px] font-extrabold text-[#183a78]">
                {initial}
              </span>
              <div>
                <h2 className="text-[16px] font-semibold text-[#183a78]">{name}</h2>
                <p className="mt-1 text-[13px] text-[#4a5568]">{detail}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-[#e6fffa] px-2.5 py-1.5 text-[12px] font-semibold text-[#183a78]"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button className="rounded-full bg-[#183a78] px-3 py-2 text-[13px] font-semibold text-white">
                Ver perfil
              </button>
              <button className="rounded-full border border-[#c2cad9] bg-[#e6fffa] px-3 py-2 text-[13px] font-semibold text-[#183a78]">
                Marcar Consulta
              </button>
            </div>
          </article>
        ))}
      </div>
      <button className="mt-5 w-full rounded-full border-2 border-[#002045] py-3 text-sm font-bold">
        Adicionar pet
      </button>
    </MobileShell>
  );
}
