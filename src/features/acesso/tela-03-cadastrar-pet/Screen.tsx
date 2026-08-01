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
  const [sharedCareChoice, setSharedCareChoice] = useState<SharedCareChoice | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inviteButtonRef = useRef<HTMLButtonElement>(null);

  const updateField = (field: FieldName, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
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

          const hasEmptyField = Object.values(fields).some((value) => !value.trim());
          if (hasEmptyField) {
            showToast("Preencha os campos obrigatórios para continuar.");
            formRef.current?.querySelector<HTMLInputElement>("input:invalid")?.focus();
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
          />
          <Field
            label="Raça"
            placeholder="Ex: Samoieda"
            value={fields.breed}
            onChange={(value) => updateField("breed", value)}
          />
          <Field
            label="Sexo"
            placeholder="Macho ou fêmea"
            value={fields.sex}
            onChange={(value) => updateField("sex", value)}
          />
          <Field
            label="Idade"
            placeholder="Ex: 2 anos"
            value={fields.age}
            onChange={(value) => updateField("age", value)}
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="field-label">
        {label} <span className="required-mark">*</span>
      </span>
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
