import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import {
  availableTimesFor,
  buildCalendarDays,
  sameDay,
  startOfMonth,
} from "./appointment-calendar";

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const dateLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const appointmentTypeLabels = {
  consulta: "Consulta",
  retorno: "Retorno",
  exame: "Exame",
} as const;

const veterinarianLabels = {
  mariana: "Dra. Mariana — Veterinária do Balu",
  rafael: "Dr. Rafael",
  qualquer: "Sem preferência",
} as const;

const examTypeLabels = {
  hemograma: "Hemograma",
  ultrassom: "Ultrassom",
  raio_x: "Raio-X",
  dermatologico: "Exame dermatológico",
  outro: "Outro",
} as const;

export function AppointmentModal({
  petName,
  onClose,
  returnFocusRef,
  today = new Date(),
  mode = "create",
  onConfirmed,
}: {
  petName: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  today?: Date;
  mode?: "create" | "reschedule";
  onConfirmed?: (appointment: { date: Date; time: string }) => void;
}) {
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(normalizedToday));
  const [appointmentType, setAppointmentType] = useState<"" | keyof typeof appointmentTypeLabels>(
    mode === "reschedule" ? "retorno" : "",
  );
  const [veterinarian, setVeterinarian] = useState<"" | keyof typeof veterinarianLabels>(
    mode === "reschedule" ? "mariana" : "",
  );
  const [examType, setExamType] = useState<"" | keyof typeof examTypeLabels>("");
  const [otherExam, setOtherExam] = useState("");
  const [reason, setReason] = useState(mode === "reschedule" ? "Retorno dermatológico" : "");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { showToast } = useErrorFeedback();
  const titleId = useId();
  const appointmentTypeRef = useRef<HTMLSelectElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const currentMonth = startOfMonth(normalizedToday);
  const canGoPrevious = visibleMonth.getTime() > currentMonth.getTime();

  const close = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    appointmentTypeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const confirmAppointment = () => {
    if (!appointmentType) {
      showToast("Selecione o tipo de atendimento para continuar.");
      return;
    }
    if (!veterinarian) {
      showToast("Selecione o veterinário para continuar.");
      return;
    }
    if (appointmentType === "exame" && !examType) {
      showToast("Selecione o tipo de exame para continuar.");
      return;
    }
    if (appointmentType === "exame" && examType === "outro" && !otherExam.trim()) {
      showToast("Informe o nome do exame para continuar.");
      return;
    }
    if (!reason.trim()) {
      showToast("Informe o motivo da consulta para continuar.");
      return;
    }
    if (!selectedDate) {
      showToast("Selecione a data da consulta para continuar.");
      return;
    }
    if (!selectedTime) {
      showToast("Selecione o horário da consulta para continuar.");
      return;
    }
    setConfirmed(true);
  };

  return (
    <div
      className="appointment-modal__backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        className="appointment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header>
          <div>
            <h2 id={titleId}>
              {confirmed
                ? mode === "reschedule"
                  ? "Consulta reagendada"
                  : "Consulta solicitada"
                : mode === "reschedule"
                  ? "Reagendar consulta"
                  : "Marcar consulta"}
            </h2>
            <p>{confirmed ? "Confira os dados do agendamento" : `Agendamento para ${petName}`}</p>
          </div>
          <button type="button" aria-label="Fechar agendamento" onClick={close}>
            <X aria-hidden="true" size={22} />
          </button>
        </header>

        {confirmed && selectedDate && selectedTime ? (
          <div className="appointment-modal__confirmation">
            <span className="appointment-modal__success-icon">
              <CalendarCheck aria-hidden="true" />
            </span>
            <p>
              {mode === "reschedule"
                ? "O novo horário da consulta foi registrado."
                : "Sua solicitação de consulta foi registrada."}
            </p>
            <dl>
              <div>
                <dt>Pet</dt>
                <dd>{petName}</dd>
              </div>
              <div>
                <dt>Atendimento</dt>
                <dd>{appointmentType ? appointmentTypeLabels[appointmentType] : ""}</dd>
              </div>
              <div>
                <dt>Veterinário</dt>
                <dd>{veterinarian ? veterinarianLabels[veterinarian] : ""}</dd>
              </div>
              {appointmentType === "exame" && examType && (
                <div>
                  <dt>Exame</dt>
                  <dd>{examType === "outro" ? otherExam.trim() : examTypeLabels[examType]}</dd>
                </div>
              )}
              <div>
                <dt>Data</dt>
                <dd>{dateLabelFormatter.format(selectedDate)}</dd>
              </div>
              <div>
                <dt>Horário</dt>
                <dd>{selectedTime}</dd>
              </div>
              <div>
                <dt>Motivo</dt>
                <dd>{reason.trim()}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="is-primary appointment-modal__conclude"
              onClick={() => {
                onConfirmed?.({ date: selectedDate, time: selectedTime });
                close();
              }}
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="appointment-modal__choices">
              <label>
                <span className="appointment-modal__required-label">
                  Tipo de atendimento <span aria-hidden="true">*</span>
                </span>
                <select
                  ref={appointmentTypeRef}
                  required
                  value={appointmentType}
                  onChange={(event) => {
                    const nextType = event.target.value as "" | keyof typeof appointmentTypeLabels;
                    setAppointmentType(nextType);
                    if (nextType !== "exame") {
                      setExamType("");
                      setOtherExam("");
                    }
                  }}
                >
                  <option value="" disabled>
                    Selecione o atendimento
                  </option>
                  {Object.entries(appointmentTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="appointment-modal__required-label">
                  Veterinário <span aria-hidden="true">*</span>
                </span>
                <select
                  required
                  value={veterinarian}
                  onChange={(event) =>
                    setVeterinarian(event.target.value as "" | keyof typeof veterinarianLabels)
                  }
                >
                  <option value="" disabled>
                    Selecione o veterinário
                  </option>
                  {Object.entries(veterinarianLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              {appointmentType === "exame" && (
                <label>
                  <span className="appointment-modal__required-label">
                    Tipo de exame <span aria-hidden="true">*</span>
                  </span>
                  <select
                    required
                    value={examType}
                    onChange={(event) => {
                      const nextExam = event.target.value as "" | keyof typeof examTypeLabels;
                      setExamType(nextExam);
                      if (nextExam !== "outro") setOtherExam("");
                    }}
                  >
                    <option value="" disabled>
                      Selecione o exame
                    </option>
                    {Object.entries(examTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {appointmentType === "exame" && examType === "outro" && (
                <label>
                  <span className="appointment-modal__required-label">
                    Nome do exame <span aria-hidden="true">*</span>
                  </span>
                  <input
                    required
                    value={otherExam}
                    placeholder="Digite o nome do exame"
                    onChange={(event) => setOtherExam(event.target.value)}
                  />
                </label>
              )}
            </div>

            <label className="appointment-modal__reason">
              <span className="appointment-modal__reason-label">
                Motivo da consulta <span aria-hidden="true">*</span>
              </span>
              <textarea
                ref={reasonRef}
                aria-label="Motivo da consulta"
                placeholder="Descreva brevemente o motivo da consulta"
                required
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </label>

            <h3 className="appointment-modal__section-title">
              Data da consulta <span aria-hidden="true">*</span>
            </h3>
            <section className="appointment-modal__calendar" aria-label="Calendário da consulta">
              <div className="appointment-modal__month-navigation">
                <button
                  type="button"
                  aria-label="Mês anterior"
                  disabled={!canGoPrevious}
                  onClick={() =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1, 12),
                    )
                  }
                >
                  <ChevronLeft aria-hidden="true" size={20} />
                </button>
                <strong>{monthFormatter.format(visibleMonth)}</strong>
                <button
                  type="button"
                  aria-label="Próximo mês"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1, 12),
                    )
                  }
                >
                  <ChevronRight aria-hidden="true" size={20} />
                </button>
              </div>
              <div className="appointment-modal__weekdays">
                {weekdays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="appointment-modal__days">
                {buildCalendarDays(visibleMonth).map((day, index) =>
                  day ? (
                    <button
                      type="button"
                      key={day.toISOString()}
                      aria-label={dateLabelFormatter.format(day)}
                      aria-pressed={selectedDate ? sameDay(day, selectedDate) : false}
                      disabled={day.getTime() < normalizedToday.getTime()}
                      className={
                        [
                          sameDay(day, normalizedToday) ? "is-today" : "",
                          selectedDate && sameDay(day, selectedDate) ? "is-selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(null);
                      }}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <span aria-hidden="true" key={`empty-${index}`} />
                  ),
                )}
              </div>
            </section>

            {selectedDate && (
              <section className="appointment-modal__times" aria-labelledby={`${titleId}-times`}>
                <h3 id={`${titleId}-times`}>
                  Horário da consulta <span aria-hidden="true">*</span>
                </h3>
                <p>{dateLabelFormatter.format(selectedDate)}</p>
                <div>
                  {availableTimesFor(selectedDate).map((time) => (
                    <button
                      key={time}
                      type="button"
                      aria-pressed={selectedTime === time}
                      className={selectedTime === time ? "is-selected" : undefined}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="appointment-modal__actions">
              <button type="button" className="is-secondary" onClick={close}>
                Cancelar
              </button>
              <button type="button" className="is-primary" onClick={confirmAppointment}>
                Confirmar consulta
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
