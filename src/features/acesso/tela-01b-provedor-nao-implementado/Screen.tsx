import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";
export function ProviderUnavailableScreen({
  provider,
  onBack,
}: {
  provider: string;
  onBack: () => void;
}) {
  return (
    <MobileShell>
      <PageHeader title="Autenticação não implementada" onBack={onBack} />
      <section className="rounded-[18px] border border-[#b2f5ea] bg-[#e6fffa] p-5 text-center">
        <div className="text-4xl">{provider === "Google" ? "G" : "●"}</div>
        <h2 className="mt-3 font-bold">Entrar com {provider}</h2>
        <p className="mt-2 text-sm text-[#4a5568]">
          Este método de autenticação ainda não está disponível neste protótipo.
        </p>
      </section>
      <div className="mt-6">
        <PrimaryButton onClick={onBack}>Voltar para login</PrimaryButton>
      </div>
    </MobileShell>
  );
}
