import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { MultiTimeField } from "../../../components/ui/MultiTimeField";
import { isValid24HourTime } from "../../../components/ui/time";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

const weekDays = [
  ["seg", "Segunda-feira", "S"],
  ["ter", "Terça-feira", "T"],
  ["qua", "Quarta-feira", "Q"],
  ["qui", "Quinta-feira", "Q"],
  ["sex", "Sexta-feira", "S"],
  ["sab", "Sábado", "S"],
  ["dom", "Domingo", "D"],
] as const;

type RoutineErrors = Partial<
  Record<"type" | "medicine" | "name" | "frequency" | "days" | "date" | "time", string>
>;

export function AddRoutineScreen({ onBack }: { onBack: () => void }) {
  const { showToast } = useErrorFeedback();
  const [type, setType] = useState("");
  const [medicine, setMedicine] = useState("");
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [times, setTimes] = useState([""]);
  const [reminder, setReminder] = useState("0");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<RoutineErrors>({});
  const typeRef = useRef<HTMLSelectElement>(null);
  const medicineRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const frequencyRef = useRef<HTMLSelectElement>(null);
  const daysRef = useRef<HTMLFieldSetElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const clearError = (field: keyof RoutineErrors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: RoutineErrors = {};
    if (!type) nextErrors.type = "Selecione o tipo de cuidado.";
    if (type === "medicamento" && !medicine)
      nextErrors.medicine = "Selecione o medicamento cadastrado.";
    if (!name.trim()) nextErrors.name = "Informe o nome da rotina.";
    if (!frequency) nextErrors.frequency = "Selecione a frequência.";
    if (frequency === "semanal" && selectedDays.length === 0)
      nextErrors.days = "Selecione ao menos um dia da semana.";
    if (frequency === "unica" && !date) nextErrors.date = "Informe a data da rotina.";
    if (times.some((time) => !isValid24HourTime(time)))
      nextErrors.time = "Informe todos os horários no formato 24 horas.";

    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0] as keyof RoutineErrors | undefined;
    if (firstError) {
      showToast("Preencha os campos obrigatórios da rotina.");
      ({
        type: typeRef,
        medicine: medicineRef,
        name: nameRef,
        frequency: frequencyRef,
        days: daysRef,
        date: dateRef,
        time: timeRef,
      })[firstError].current?.focus();
      return;
    }

    showToast("Rotina salva com sucesso.", "success");
    window.setTimeout(onBack, 1200);
  };

  return (
    <MobileShell padded={false}>
      <div className="pet-add-form-screen">
        <header>
          <button aria-label="Voltar" onClick={onBack} type="button">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Adicionar rotina</h1>
            <p>Organize um novo cuidado para o Balu.</p>
          </div>
        </header>
        <form noValidate onSubmit={submit}>
          <p className="required-note">* indica campo obrigatório</p>

          <label>
            <span>
              Tipo de cuidado <b className="required-mark">*</b>
            </span>
            <select
              ref={typeRef}
              aria-label="Tipo de cuidado"
              value={type}
              aria-invalid={Boolean(errors.type)}
              aria-describedby={errors.type ? "routine-type-error" : undefined}
              onChange={(event) => {
                setType(event.target.value);
                clearError("type");
                clearError("medicine");
              }}
            >
              <option value="">Selecione</option>
              <option value="alimentacao">Alimentação</option>
              <option value="passeio">Passeio</option>
              <option value="higiene">Higiene</option>
              <option value="medicamento">Medicamento</option>
              <option value="outro">Outro</option>
            </select>
            {errors.type && (
              <small id="routine-type-error" className="field-error">
                {errors.type}
              </small>
            )}
          </label>

          {type === "medicamento" && (
            <label>
              <span>
                Medicamento cadastrado <b className="required-mark">*</b>
              </span>
              <select
                ref={medicineRef}
                aria-label="Medicamento cadastrado"
                value={medicine}
                aria-invalid={Boolean(errors.medicine)}
                aria-describedby={errors.medicine ? "routine-medicine-error" : undefined}
                onChange={(event) => {
                  setMedicine(event.target.value);
                  clearError("medicine");
                }}
              >
                <option value="">Selecione</option>
                <option value="chemital">Vermífugo Chemital</option>
                <option value="prednisolona">Prednisolona</option>
                <option value="omega3">Ômega 3</option>
                <option value="nexgard">NexGard</option>
              </select>
              {errors.medicine && (
                <small id="routine-medicine-error" className="field-error">
                  {errors.medicine}
                </small>
              )}
            </label>
          )}

          <label>
            <span>
              Nome da rotina <b className="required-mark">*</b>
            </span>
            <input
              ref={nameRef}
              aria-label="Nome da rotina"
              value={name}
              placeholder="Ex: Passeio da tarde"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "routine-name-error" : undefined}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
            />
            {errors.name && (
              <small id="routine-name-error" className="field-error">
                {errors.name}
              </small>
            )}
          </label>

          <label>
            <span>
              Frequência <b className="required-mark">*</b>
            </span>
            <select
              ref={frequencyRef}
              aria-label="Frequência"
              value={frequency}
              aria-invalid={Boolean(errors.frequency)}
              aria-describedby={errors.frequency ? "routine-frequency-error" : undefined}
              onChange={(event) => {
                setFrequency(event.target.value);
                clearError("frequency");
                clearError("days");
                clearError("date");
              }}
            >
              <option value="">Selecione</option>
              <option value="diaria">Todos os dias</option>
              <option value="semanal">Dias da semana</option>
              <option value="unica">Uma única vez</option>
            </select>
            {errors.frequency && (
              <small id="routine-frequency-error" className="field-error">
                {errors.frequency}
              </small>
            )}
          </label>

          {frequency === "semanal" && (
            <fieldset
              ref={daysRef}
              className="routine-weekdays"
              aria-label="Dias da semana"
              aria-describedby={errors.days ? "routine-days-error" : undefined}
            >
              <legend>
                Dias da semana <b className="required-mark">*</b>
              </legend>
              <div>
                {weekDays.map(([value, label, shortLabel]) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      aria-label={label}
                      checked={selectedDays.includes(value)}
                      onChange={(event) => {
                        setSelectedDays((current) =>
                          event.target.checked
                            ? [...current, value]
                            : current.filter((day) => day !== value),
                        );
                        clearError("days");
                      }}
                    />
                    <span aria-hidden="true">{shortLabel}</span>
                    <span className="sr-only">{label}</span>
                  </label>
                ))}
              </div>
              {errors.days && (
                <small id="routine-days-error" className="field-error">
                  {errors.days}
                </small>
              )}
            </fieldset>
          )}

          {frequency === "unica" && (
            <label>
              <span>
                Data da rotina <b className="required-mark">*</b>
              </span>
              <input
                ref={dateRef}
                type="date"
                aria-label="Data da rotina"
                value={date}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "routine-date-error" : undefined}
                onChange={(event) => {
                  setDate(event.target.value);
                  clearError("date");
                }}
              />
              {errors.date && (
                <small id="routine-date-error" className="field-error">
                  {errors.date}
                </small>
              )}
            </label>
          )}

          <MultiTimeField
            times={times}
            firstInputRef={timeRef}
            error={errors.time}
            errorId="routine-time-error"
            onChange={(nextTimes) => {
              setTimes(nextTimes);
              clearError("time");
            }}
          />

          <label>
            <span>Lembrete</span>
            <select
              aria-label="Lembrete"
              value={reminder}
              onChange={(event) => setReminder(event.target.value)}
            >
              <option value="0">No horário</option>
              <option value="10">10 min antes</option>
              <option value="30">30 min antes</option>
              <option value="60">1 hora antes</option>
            </select>
          </label>

          <label>
            <span>Instruções</span>
            <textarea
              aria-label="Instruções"
              value={instructions}
              placeholder="Descreva os cuidados necessários"
              rows={3}
              onChange={(event) => setInstructions(event.target.value)}
            />
          </label>
          <button className="save-addition" type="submit">
            Salvar rotina
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
