import { useRef, useState } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { OnboardingProgress } from "../../../components/ui/OnboardingProgress";
import { BackButton } from "../../../components/ui/ScreenPrimitives";

const initialFields = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

type FieldName = keyof typeof initialFields;

export function CreateAccountScreen({
  onEnter,
  onLogin,
  onBack,
  onGoogleUnavailable,
  onAppleUnavailable,
}: {
  onEnter: () => void;
  onLogin?: () => void;
  onBack: () => void;
  onGoogleUnavailable?: () => void;
  onAppleUnavailable?: () => void;
}) {
  const { showToast, showModal } = useErrorFeedback();
  const [values, setValues] = useState(initialFields);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const fields = [
    ["name", "Nome", "Seu nome completo", "text", "Informe o nome."],
    ["email", "E-mail", "voce@email.com", "email", "Informe o e-mail."],
    ["password", "Senha", "Crie uma senha", "password", "Informe a senha."],
    [
      "passwordConfirmation",
      "Confirmar senha",
      "Digite novamente",
      "password",
      "Confirme a senha.",
    ],
  ] as const;

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <main className="create-account-screen">
      <section className="create-account-screen__canvas" data-figma-node="175:2">
        <OnboardingProgress currentStep={1} label="Criar sua conta" />
        <header>
          <BackButton onClick={onBack} />
          <div>
            <h1>Criar conta</h1>
            <p>Crie seu acesso para depois cadastrar seu pet</p>
          </div>
        </header>
        <div className="create-account-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>
        <form
          ref={formRef}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();

            const nextErrors: Partial<Record<FieldName, string>> = {};
            for (const [name, , , , message] of fields) {
              if (!values[name].trim()) nextErrors[name] = message;
            }
            setErrors(nextErrors);

            if (Object.keys(nextErrors).length) {
              showToast("Preencha os campos obrigatórios para continuar.");
              const firstInvalidField = fields.find(([name]) => nextErrors[name]);
              if (firstInvalidField) {
                formRef.current
                  ?.querySelector<HTMLInputElement>(`#create-account-${firstInvalidField[0]}`)
                  ?.focus();
              }
              return;
            }

            onEnter();
          }}
        >
          <div className="create-account-screen__form-heading">
            <strong>Cadastro</strong>
            <small>* indica campo obrigatório</small>
          </div>
          {fields.map(([name, label, placeholder, type]) => (
            <label key={name}>
              <span>
                {label}{" "}
                <b className="create-account-screen__required" aria-hidden="true">
                  *
                </b>
              </span>
              <input
                id={`create-account-${name}`}
                aria-label={label}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `create-account-${name}-error` : undefined}
                required
                type={type}
                placeholder={placeholder}
                value={values[name]}
                onChange={(event) => updateField(name, event.target.value)}
              />
              {errors[name] && (
                <small id={`create-account-${name}-error`} className="create-account-screen__error">
                  {errors[name]}
                </small>
              )}
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
        <button
          className="create-account-screen__social"
          type="button"
          onClick={
            onGoogleUnavailable ??
            (() =>
              showModal({
                title: "Login indisponível",
                message: "O login com Google ainda não está disponível.",
                singleLineMessage: true,
              }))
          }
        >
          <span className="is-google">G</span>
          Continuar com Google
        </button>
        <button
          className="create-account-screen__social"
          type="button"
          onClick={
            onAppleUnavailable ??
            (() =>
              showModal({
                title: "Login indisponível",
                message: "O login com Apple ainda não está disponível.",
              }))
          }
        >
          <span className="is-apple">
            <img src="/assets/figma/access/apple.svg" alt="" />
          </span>
          Continuar com Apple
        </button>
      </section>
    </main>
  );
}
