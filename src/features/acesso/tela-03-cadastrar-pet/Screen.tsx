import { useRef, useState } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { OnboardingProgress } from "../../../components/ui/OnboardingProgress";

const initialFields = {
  name: "",
  breed: "",
  sex: "",
  age: "",
};

type FieldName = keyof typeof initialFields;
type SharedCareChoice = "invite" | "later" | "code";

export function RegisterPetScreen({
  onComplete,
}: {
  onComplete?: () => void;
  onBack?: () => void;
}) {
  const { showToast } = useErrorFeedback();
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [sharedCareChoice, setSharedCareChoice] = useState<SharedCareChoice | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inviteButtonRef = useRef<HTMLButtonElement>(null);

  const updateField = (field: FieldName, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <main className="register-pet-screen">
      <form
        ref={formRef}
        className="register-pet-screen__canvas"
        data-figma-node="177:2"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();

          const nextErrors: Partial<Record<FieldName, string>> = {};
          if (!fields.name.trim()) nextErrors.name = "Informe o nome do pet.";
          if (!fields.breed.trim()) nextErrors.breed = "Informe a raça do pet.";
          if (!fields.sex.trim()) nextErrors.sex = "Informe o sexo do pet.";
          if (!fields.age.trim()) nextErrors.age = "Informe a idade do pet.";
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            showToast("Preencha os campos obrigatórios para continuar.");
            formRef.current?.querySelector<HTMLInputElement>("input")?.focus();
            return;
          }

          if (!sharedCareChoice) {
            showToast("Selecione uma opção no cuidado compartilhado.");
            inviteButtonRef.current?.focus();
            return;
          }

          onComplete?.();
        }}
      >
        <OnboardingProgress currentStep={2} label="Cadastrar seu pet" />
        <header>
          <h1>Cadastrar pet</h1>
          <p>Agora vamos registrar as informações iniciais do seu pet</p>
        </header>
        <div className="register-pet-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>
        <section className="register-pet-screen__fields">
          <h2>Dados do pet</h2>
          <p className="required-note">* indica campo obrigatório</p>
          <Field
            label="Nome do pet"
            placeholder="Ex: Balu"
            value={fields.name}
            onChange={(value) => updateField("name", value)}
            error={errors.name}
            name="name"
          />
          <Field
            label="Raça"
            placeholder="Ex: Samoieda"
            value={fields.breed}
            onChange={(value) => updateField("breed", value)}
            error={errors.breed}
            name="breed"
          />
          <Field
            label="Sexo"
            placeholder="Macho ou fêmea"
            value={fields.sex}
            onChange={(value) => updateField("sex", value)}
            error={errors.sex}
            name="sex"
          />
          <Field
            label="Idade"
            placeholder="Ex: 2 anos"
            value={fields.age}
            onChange={(value) => updateField("age", value)}
            error={errors.age}
            name="age"
          />
        </section>
        <section className="register-pet-screen__shared">
          <h2>Cuidado compartilhado</h2>
          <div>
            <div className="register-pet-screen__shared-intro">
              <img src="/assets/figma/access/shared-care.svg" alt="" />
              <div>
                <strong>Vincular outros tutores</strong>
                <p>
                  Convide outra pessoa responsável para acompanhar lembretes, rotinas e histórico do
                  pet.
                </p>
              </div>
            </div>
            <div
              className="register-pet-screen__shared-actions"
              role="group"
              aria-label="Ações de cuidado compartilhado"
            >
              <button
                ref={inviteButtonRef}
                type="button"
                className={`is-primary ${sharedCareChoice === "invite" ? "is-selected" : ""}`}
                aria-pressed={sharedCareChoice === "invite"}
                onClick={() => setSharedCareChoice("invite")}
              >
                Convidar tutor
              </button>
              <button
                type="button"
                className={sharedCareChoice === "later" ? "is-selected" : ""}
                aria-pressed={sharedCareChoice === "later"}
                onClick={() => setSharedCareChoice("later")}
              >
                Adicionar depois
              </button>
            </div>
            {sharedCareChoice === "later" && (
              <p role="status" className="register-pet-screen__saved-note">
                Os dados preenchidos do pet serão mantidos. Você poderá convidar outro tutor depois.
              </p>
            )}
            <button
              type="button"
              className={`is-code ${sharedCareChoice === "code" ? "is-selected" : ""}`}
              aria-pressed={sharedCareChoice === "code"}
              onClick={() => setSharedCareChoice("code")}
            >
              Entrar com código da família
            </button>
          </div>
        </section>
        <button className="register-pet-screen__submit" type="submit">
          Continuar
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  name,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name: FieldName;
}) {
  return (
    <label>
      <span className="field-label">
        {label} <span className="required-mark">*</span>
      </span>
      <input
        id={`register-pet-${name}`}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `register-pet-${name}-error` : undefined}
      />
      {error && (
        <small id={`register-pet-${name}-error`} className="field-error">
          {error}
        </small>
      )}
    </label>
  );
}
