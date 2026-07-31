import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";
export function AddTutorScreen() {
  return (
    <MobileShell>
      <PageHeader
        title="Adicionar tutor"
        subtitle="Convide alguém para acompanhar os cuidados do Balu."
        onBack={() => history.back()}
      />
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-4xl">
        👤
      </div>
      <form className="mt-7 space-y-4">
        <label className="block text-xs font-semibold text-[#4a5568]">
          Nome do tutor
          <input
            placeholder="Ex: Paulo Silva"
            className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
          />
        </label>
        <label className="block text-xs font-semibold text-[#4a5568]">
          E-mail do tutor
          <input
            type="email"
            placeholder="tutor@email.com"
            className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal"
          />
        </label>
        <section className="rounded-[18px] border border-[#b2f5ea] bg-[#e6fffa] p-4">
          <b className="text-sm">O que o tutor poderá fazer?</b>
          <p className="mt-2 text-xs text-[#4a5568]">
            Ver a rotina, receber lembretes e registrar cuidados do pet.
          </p>
        </section>
        <PrimaryButton type="submit">Enviar convite</PrimaryButton>
      </form>
    </MobileShell>
  );
}
