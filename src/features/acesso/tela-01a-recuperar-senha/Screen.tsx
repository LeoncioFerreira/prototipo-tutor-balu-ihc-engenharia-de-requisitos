import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";
export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const { showToast } = useErrorFeedback();

  return (
    <MobileShell>
      <PageHeader
        title="Recuperar senha"
        subtitle="Informe seu e-mail para receber as instruções."
        onBack={onBack}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          showToast("Instruções enviadas no e-mail.", "success");
        }}
        className="space-y-5"
      >
        <label className="block text-sm font-semibold">
          E-mail
          <input
            required
            type="email"
            placeholder="voce@email.com"
            className="mt-2 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 font-normal"
          />
        </label>
        <PrimaryButton type="submit">Enviar instruções</PrimaryButton>
      </form>
    </MobileShell>
  );
}
