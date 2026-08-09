import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { MultiTimeField } from "../../../components/ui/MultiTimeField";
import { isValid24HourTime } from "../../../components/ui/time";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

type MedicineErrors = Partial<
  Record<"medicine" | "name" | "dose" | "form" | "route" | "start" | "frequency" | "time", string>
>;

export function AddMedicineScreen({ onBack }: { onBack: () => void }) {
  const { showToast } = useErrorFeedback();
  const [medicine, setMedicine] = useState("");
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [form, setForm] = useState("");
  const [route, setRoute] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [times, setTimes] = useState([""]);
  const [guidance, setGuidance] = useState("");
  const [errors, setErrors] = useState<MedicineErrors>({});
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstTimeRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (returnTimer.current) clearTimeout(returnTimer.current);
    },
    [],
  );

  const clearError = (field: keyof MedicineErrors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: MedicineErrors = {};
    if (!medicine) nextErrors.medicine = "Selecione um medicamento.";
    if (medicine === "novo" && !name.trim()) nextErrors.name = "Informe o nome do medicamento.";
    if (!dose.trim()) nextErrors.dose = "Informe a dose.";
    if (!form) nextErrors.form = "Selecione a forma.";
    if (!route) nextErrors.route = "Selecione a via de administração.";
    if (!startDate) nextErrors.start = "Informe a data de início.";
    if (!frequency) nextErrors.frequency = "Selecione a frequência.";
    if (times.some((time) => !isValid24HourTime(time)))
      nextErrors.time = "Informe todos os horários no formato 24 horas.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast("Preencha os campos obrigatórios do medicamento.");
      return;
    }

    showToast("Medicamento salvo com sucesso.", "success");
    returnTimer.current = setTimeout(onBack, 1200);
  };

  return (
    <MobileShell padded={false}>
      <div className="pet-add-form-screen">
        <header>
          <button aria-label="Voltar" onClick={onBack} type="button">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Adicionar remédio</h1>
            <p>Cadastre o tratamento e os horários do Balu.</p>
          </div>
        </header>
        <form noValidate onSubmit={submit}>
          <p className="required-note">* indica campo obrigatório</p>

          <label>
            <span>
              Medicamento <b className="required-mark">*</b>
            </span>
            <select
              aria-label="Medicamento"
              value={medicine}
              aria-invalid={Boolean(errors.medicine)}
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
              <option value="novo">Cadastrar novo medicamento</option>
            </select>
            {errors.medicine && <small className="field-error">{errors.medicine}</small>}
          </label>

          {medicine === "novo" && (
            <label>
              <span>
                Nome do medicamento <b className="required-mark">*</b>
              </span>
              <input
                aria-label="Nome do medicamento"
                value={name}
                placeholder="Ex: Vermífugo Chemital"
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError("name");
                }}
              />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>
          )}

          <label>
            <span>
              Dose <b className="required-mark">*</b>
            </span>
            <input
              aria-label="Dose"
              value={dose}
              placeholder="Ex: 1/2 comprimido"
              aria-invalid={Boolean(errors.dose)}
              onChange={(event) => {
                setDose(event.target.value);
                clearError("dose");
              }}
            />
            {errors.dose && <small className="field-error">{errors.dose}</small>}
          </label>

          <div className="form-row">
            <label>
              <span>
                Forma <b className="required-mark">*</b>
              </span>
              <select
                aria-label="Forma"
                value={form}
                onChange={(event) => {
                  setForm(event.target.value);
                  clearError("form");
                }}
              >
                <option value="">Selecione</option>
                <option value="comprimido">Comprimido</option>
                <option value="gotas">Gotas</option>
                <option value="liquido">Líquido</option>
                <option value="pomada">Pomada</option>
                <option value="injecao">Injeção</option>
              </select>
              {errors.form && <small className="field-error">{errors.form}</small>}
            </label>
            <label>
              <span>
                Via <b className="required-mark">*</b>
              </span>
              <select
                aria-label="Via de administração"
                value={route}
                onChange={(event) => {
                  setRoute(event.target.value);
                  clearError("route");
                }}
              >
                <option value="">Selecione</option>
                <option value="oral">Oral</option>
                <option value="topica">Tópica</option>
                <option value="ocular">Ocular</option>
                <option value="auricular">Auricular</option>
                <option value="injetavel">Injetável</option>
              </select>
              {errors.route && <small className="field-error">{errors.route}</small>}
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>
                Data de início <b className="required-mark">*</b>
              </span>
              <input
                aria-label="Data de início"
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  clearError("start");
                }}
              />
              {errors.start && <small className="field-error">{errors.start}</small>}
            </label>
            <label>
              <span>Data de término</span>
              <input
                aria-label="Data de término"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
          </div>

          <label>
            <span>
              Frequência <b className="required-mark">*</b>
            </span>
            <select
              aria-label="Frequência"
              value={frequency}
              onChange={(event) => {
                setFrequency(event.target.value);
                clearError("frequency");
              }}
            >
              <option value="">Selecione</option>
              <option value="diaria">Todos os dias</option>
              <option value="semanal">Dias da semana</option>
              <option value="unica">Uma única vez</option>
            </select>
            {errors.frequency && <small className="field-error">{errors.frequency}</small>}
          </label>

          <MultiTimeField
            times={times}
            firstInputRef={firstTimeRef}
            error={errors.time}
            errorId="medicine-time-error"
            onChange={(nextTimes) => {
              setTimes(nextTimes);
              clearError("time");
            }}
          />

          <label>
            <span>Orientações</span>
            <textarea
              aria-label="Orientações"
              value={guidance}
              placeholder="Ex: Dar após a refeição"
              rows={3}
              onChange={(event) => setGuidance(event.target.value)}
            />
          </label>
          <button className="save-addition" type="submit">
            Salvar remédio
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
