import { OnboardingProgress } from "../../../components/ui/OnboardingProgress";

export function CreateAccountScreen({
  onEnter,
  onLogin,
}: {
  onEnter: () => void;
  onLogin?: () => void;
}) {
  const fields = [
    ["Nome", "Seu nome completo", "text"],
    ["E-mail", "voce@email.com", "email"],
    ["Senha", "Crie uma senha", "password"],
    ["Confirmar senha", "Digite novamente", "password"],
  ] as const;

  return (
    <main className="create-account-screen">
      <section className="create-account-screen__canvas" data-figma-node="175:2">
        <OnboardingProgress currentStep={1} label="Criar sua conta" />
        <header>
          <h1>Criar conta</h1>
          <p>Crie seu acesso para depois cadastrar seu pet</p>
        </header>
        <div className="create-account-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onEnter();
          }}
        >
          <div className="create-account-screen__form-heading">
            <strong>Cadastro</strong>
            <small>* indica campo obrigatório</small>
          </div>
          {fields.map(([label, placeholder, type]) => (
            <label key={label}>
              <span>
                {label}{" "}
                <b className="create-account-screen__required" aria-hidden="true">
                  *
                </b>
              </span>
              <input aria-label={label} required type={type} placeholder={placeholder} />
            </label>
          ))}
          <button type="submit">Criar conta</button>
        </form>
        <div className="create-account-screen__login">
          <span>Já tem conta?</span>
          <button type="button" onClick={onLogin}>
            Entrar
          </button>
        </div>
        <div className="create-account-screen__divider">
          <i />
          <b>OU</b>
          <i />
        </div>
        <button className="create-account-screen__social" type="button" onClick={onEnter}>
          <span className="is-google">G</span>
          Continuar com Google
        </button>
        <button className="create-account-screen__social" type="button" onClick={onEnter}>
          <span className="is-apple">
            <img src="/assets/figma/access/apple.svg" alt="" />
          </span>
          Continuar com Apple
        </button>
      </section>
    </main>
  );
}
