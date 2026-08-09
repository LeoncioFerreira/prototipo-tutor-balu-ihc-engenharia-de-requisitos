import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import "../account-security/AccountSecurity.scss";
import { PasswordInput } from "../account-security/PasswordInput";

export function ChangePasswordScreen({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { showToast } = useErrorFeedback();

  const save = () => {
    if (!current || !next || !confirmation) {
      showToast("Preencha todos os campos para alterar a senha.");
      return;
    }
    if (next.length < 8) {
      showToast("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (next !== confirmation) {
      showToast("A confirmação da nova senha não coincide.");
      return;
    }
    showToast("Senha alterada com sucesso.", "success");
    onBack();
  };

  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <main className="account-security-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>Alterar senha</h1>
        </header>
        <p className="account-security-screen__intro">
          Use uma senha nova com pelo menos oito caracteres.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
          noValidate
        >
          <PasswordInput label="Senha atual" value={current} onChange={setCurrent} />
          <PasswordInput label="Nova senha" value={next} minLength={8} onChange={setNext} />
          <PasswordInput
            label="Confirmar nova senha"
            value={confirmation}
            minLength={8}
            onChange={setConfirmation}
          />
          <button type="submit">Salvar nova senha</button>
        </form>
      </main>
    </MobileShell>
  );
}
