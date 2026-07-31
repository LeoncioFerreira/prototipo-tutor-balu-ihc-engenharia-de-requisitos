import { useState } from "react";

export function RegisterPetScreen({
  onComplete,
}: {
  onComplete?: () => void;
  onBack?: () => void;
}) {
  const [name, setName] = useState("");
  const [addLater, setAddLater] = useState(false);
  return (
    <main className="min-h-[100dvh] bg-[#202124]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onComplete?.();
        }}
        className="mx-auto flex min-h-[100dvh] w-full max-w-[393px] flex-col gap-3 bg-white px-5 py-7 text-[#183a78]"
      >
        <header>
          <h1 className="text-[24px] font-extrabold">Cadastrar pet</h1>
          <p className="mt-1 w-[290px] text-[14px] font-medium text-[#4a5568]">
            Agora vamos registrar as informações iniciais do seu pet
          </p>
        </header>
        <div className="flex h-24 items-center justify-center">
          <img src="/assets/figma/logo-balu.png" alt="Balu" className="h-24 w-32 object-contain" />
        </div>
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold">Dados do pet</h2>
          <label className="block text-xs font-semibold text-[#4a5568]">
            Nome do pet
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Balu"
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
            />
          </label>
          <label className="block text-xs font-semibold text-[#4a5568]">
            Raça
            <input
              placeholder="Ex: Samoieda"
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
            />
          </label>
          <label className="block text-xs font-semibold text-[#4a5568]">
            Sexo
            <input
              placeholder="Macho ou fêmea"
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
            />
          </label>
          <label className="block text-xs font-semibold text-[#4a5568]">
            Idade
            <input
              placeholder="Ex: 2 anos"
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
            />
          </label>
        </section>
        <section className="space-y-2">
          <h2 className="text-[15px] font-extrabold">Cuidado compartilhado</h2>
          <div className="rounded-[18px] border border-[#b2f5ea] bg-[#e6fffa] px-3 py-2.5">
            <div className="flex gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white">👥</span>
              <div>
                <b className="text-sm">Vincular outros tutores</b>
                <p className="mt-1 text-[13px] leading-[18px] text-[#4a5568]">
                  Convide outra pessoa responsável para acompanhar lembretes, rotinas e histórico do
                  pet.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-[#183a78] px-3.5 py-2 text-[13px] font-semibold text-white"
              >
                Convidar tutor
              </button>
              <button
                type="button"
                aria-pressed={addLater}
                onClick={() => setAddLater((current) => !current)}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold ${addLater ? "border-[#183a78] bg-[#183a78] text-white" : "border-[#c2cad9] bg-white text-[#4a5568]"}`}
              >
                Adicionar depois
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-[#c2cad9] bg-white px-3.5 py-2 text-left text-[13px] font-semibold text-[#4a5568]"
              >
                Entrar com código da família
              </button>
            </div>
          </div>
        </section>
        <button
          type="submit"
          className="mt-auto h-14 w-full rounded-[28px] bg-[#183a78] text-base font-extrabold text-white shadow-[0_4px_20px_rgba(26,54,93,.08)]"
        >
          Continuar
        </button>
      </form>
    </main>
  );
}
