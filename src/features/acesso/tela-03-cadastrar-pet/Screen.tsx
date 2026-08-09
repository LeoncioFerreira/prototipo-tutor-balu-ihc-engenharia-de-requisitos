import { useRef, useState } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { OnboardingProgress } from "../../../components/ui/OnboardingProgress";
import { PetPhotoPicker } from "../../../components/ui/pet-photo-picker/PetPhotoPicker";
import { BackButton } from "../../../components/ui/ScreenPrimitives";
import { SharedCareActions, type SharedCareChoice } from "./SharedCareActions";

const initialFields = {
  name: "",
  breed: "",
  sex: "",
  birthDate: "",
  coatColor: "",
  coatType: "",
};

type FieldName = keyof typeof initialFields;

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export function RegisterPetScreen({
  onComplete,
  onBack,
  showProgress = true,
}: {
  onComplete?: () => void;
  onBack: () => void;
  showProgress?: boolean;
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
          if (!fields.birthDate) {
            nextErrors.birthDate = "Informe a data de nascimento aproximada.";
          } else if (fields.birthDate > today()) {
            nextErrors.birthDate = "A data de nascimento não pode estar no futuro.";
          }
          if (!fields.coatColor.trim()) {
            nextErrors.coatColor = "Informe a cor da pelagem.";
          }
          if (!fields.coatType.trim()) {
            nextErrors.coatType = "Informe o tipo da pelagem.";
          }
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            showToast("Preencha os campos obrigatórios para continuar.");
            const firstInvalidField = Object.keys(nextErrors)[0] as FieldName;
            formRef.current
              ?.querySelector<HTMLElement>(`#register-pet-${firstInvalidField}`)
              ?.focus();
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
        {showProgress && <OnboardingProgress currentStep={2} label="Cadastrar seu pet" />}
        <header>
          <BackButton onClick={onBack} />
          <div>
            <h1>Cadastrar pet</h1>
            <p>Agora vamos registrar as informações iniciais do seu pet</p>
          </div>
        </header>
        <PetPhotoPicker className="register-pet-screen__photo" />
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
          <SelectField
            label="Sexo"
            value={fields.sex}
            onChange={(value) => updateField("sex", value)}
            error={errors.sex}
            name="sex"
          />
          <Field
            label="Data de nascimento aproximada"
            type="date"
            max={today()}
            value={fields.birthDate}
            onChange={(value) => updateField("birthDate", value)}
            error={errors.birthDate}
            name="birthDate"
          />
          <Field
            label="Cor da pelagem"
            placeholder="Ex: Branca, preta ou caramelo"
            value={fields.coatColor}
            onChange={(value) => updateField("coatColor", value)}
            error={errors.coatColor}
            name="coatColor"
          />
          <Field
            label="Tipo da pelagem"
            placeholder="Ex: Curta, longa ou cacheada"
            value={fields.coatType}
            onChange={(value) => updateField("coatType", value)}
            error={errors.coatType}
            name="coatType"
          />
        </section>
        <section className="register-pet-screen__shared">
          <h2>Cuidado compartilhado</h2>
          <div>
            <SharedCareActions
              value={sharedCareChoice}
              onChange={setSharedCareChoice}
              inviteButtonRef={inviteButtonRef}
            />
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
  type = "text",
  list,
  max,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name: FieldName;
  type?: "text" | "date";
  list?: string;
  max?: string;
}) {
  return (
    <label>
      <span className="field-label">
        {label} <span className="required-mark">*</span>
      </span>
      <input
        id={`register-pet-${name}`}
        required
        type={type}
        list={list}
        max={max}
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

function SelectField({
  label,
  value,
  onChange,
  error,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name: FieldName;
}) {
  return (
    <label>
      <RequiredLabel>{label}</RequiredLabel>
      <select
        id={`register-pet-${name}`}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `register-pet-${name}-error` : undefined}
      >
        <option value="">Selecione</option>
        <option value="Macho">Macho</option>
        <option value="Fêmea">Fêmea</option>
      </select>
      {error && <FieldError name={name}>{error}</FieldError>}
    </label>
  );
}

function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="field-label">
      {children} <span className="required-mark">*</span>
    </span>
  );
}

function FieldError({ name, children }: { name: FieldName; children: string }) {
  return (
    <small id={`register-pet-${name}-error`} className="field-error">
      {children}
    </small>
  );
}
