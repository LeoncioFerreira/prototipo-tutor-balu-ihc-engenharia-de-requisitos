import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";
export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);
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
          setSent(true);
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
        {sent && (
          <p role="status" className="rounded-2xl bg-[#e6fffa] p-4 text-sm">
            Se este e-mail existir, enviaremos as instruções de recuperação.
          </p>
        )}
        <PrimaryButton type="submit">Enviar instruções</PrimaryButton>
      </form>
    </MobileShell>
  );
}
