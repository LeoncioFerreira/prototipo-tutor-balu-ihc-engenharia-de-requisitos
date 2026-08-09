import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import "../account-security/AccountSecurity.scss";
import { PasswordInput } from "../account-security/PasswordInput";

export function ChangeEmailScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useErrorFeedback();

  const save = () => {
    if (!email.trim() || !confirmation.trim() || !password) {
      showToast("Preencha todos os campos para alterar o e-mail.");
      return;
    }
    if (email.trim() !== confirmation.trim()) {
      showToast("Os novos e-mails não coincidem.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      showToast("Informe um novo e-mail válido.");
      return;
    }
    localStorage.setItem("balu-account-email", email.trim());
    showToast("E-mail alterado com sucesso.", "success");
    onBack();
  };

  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <main className="account-security-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>Alterar e-mail</h1>
        </header>
        <p className="account-security-screen__intro">
          Confirme sua identidade antes de atualizar o acesso à conta.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
          noValidate
        >
          <label>
            <span>E-mail atual</span>
            <input
              value={localStorage.getItem("balu-account-email") || "leoncio@email.com"}
              disabled
            />
          </label>
          <label>
            <span>
              Novo e-mail <span aria-hidden="true">*</span>
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            <span>
              Confirmar novo e-mail <span aria-hidden="true">*</span>
            </span>
            <input
              type="email"
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </label>
          <PasswordInput label="Senha atual" value={password} onChange={setPassword} />
          <button type="submit">Salvar novo e-mail</button>
        </form>
      </main>
    </MobileShell>
  );
}
