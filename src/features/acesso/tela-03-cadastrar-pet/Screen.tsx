import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";

export function RegisterPetScreen({
  onComplete,
  onBack,
}: {
  onComplete?: () => void;
  onBack?: () => void;
}) {
  const [name, setName] = useState("");
  return (
    <MobileShell>
      <PageHeader
        title="
    Cadastrar pet"
        subtitle="Conte um pouco sobre o seu companheiro"
        onBack={onBack}
      />
      <div className="mb-6 grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-[#92ddd2] bg-[#e6fffa] text-3xl">
        🐾
      </div>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete?.();
        }}
      >
        <label className="block text-[13px] font-semibold">
          Nome do pet
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Balu"
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c9d7e2] bg-white px-4 font-normal outline-[#35ba8d]"
          />
        </label>
        <label className="block text-[13px] font-semibold">
          Espécie
          <select className="mt-1.5 h-12 w-full rounded-2xl border border-[#c9d7e2] bg-white px-4 font-normal">
            <option>Cachorro</option>
            <option>Gato</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-[13px] font-semibold">
            Raça
            <input
              placeholder="Samoieda"
              className="mt-1.5 h-12 w-full rounded-2xl border border-[#c9d7e2] bg-white px-4 font-normal"
            />
          </label>
          <label className="text-[13px] font-semibold">
            Nascimento
            <input
              placeholder="01/06/2024"
              className="mt-1.5 h-12 w-full rounded-2xl border border-[#c9d7e2] bg-white px-4 font-normal"
            />
          </label>
        </div>
        <div className="pt-3">
          <PrimaryButton type="submit">Continuar</PrimaryButton>
        </div>
      </form>
    </MobileShell>
  );
}
