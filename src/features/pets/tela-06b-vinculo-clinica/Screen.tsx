import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";
export function ClinicLinkScreen() {
  return (
    <MobileShell>
      <PageHeader
        title="Vínculo com clínica"
        subtitle="Conecte o Balu à clínica veterinária"
        onBack={() => history.back()}
      />
      <section className="rounded-2xl border border-[#b2f5ea] bg-[#e6fffa] p-5">
        <b>Clínica Vet Mais</b>
        <p className="mt-2 text-sm text-[#4a5568]">
          Envie uma solicitação para sincronizar prescrições e carteira de saúde.
        </p>
      </section>
      <div className="mt-6">
        <PrimaryButton>Enviar solicitação</PrimaryButton>
      </div>
    </MobileShell>
  );
}
