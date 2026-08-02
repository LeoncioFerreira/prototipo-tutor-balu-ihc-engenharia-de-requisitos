import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
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

export function AppointmentModal({
  petName,
  onClose,
  returnFocusRef,
  today = new Date(),
}: {
  petName: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  today?: Date;
}) {
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(normalizedToday));
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { showToast } = useErrorFeedback();
  const titleId = useId();
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const currentMonth = startOfMonth(normalizedToday);
  const canGoPrevious = visibleMonth.getTime() > currentMonth.getTime();

  const close = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    reasonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const confirmAppointment = () => {
    if (!reason.trim() || !selectedDate || !selectedTime) {
      showToast("Preencha o motivo, escolha uma data e um horário para continuar.");
      return;
    }
    setConfirmed(true);
  };

  return (
    <div
      className="appointment-modal__backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header>
          <div>
            <h2 id={titleId}>{confirmed ? "Consulta solicitada" : "Marcar consulta"}</h2>
            <p>{confirmed ? "Confira os dados do agendamento" : `Agendamento para ${petName}`}</p>
          </div>
          <button type="button" aria-label="Fechar agendamento" onClick={close}>
            <X aria-hidden="true" size={22} />
          </button>
        </header>

        {confirmed && selectedDate && selectedTime ? (
          <div className="appointment-modal__confirmation">
            <span className="appointment-modal__success-icon"><CalendarCheck aria-hidden="true" /></span>
            <p>Sua solicitação de consulta foi registrada.</p>
            <dl>
              <div><dt>Pet</dt><dd>{petName}</dd></div>
              <div><dt>Data</dt><dd>{dateLabelFormatter.format(selectedDate)}</dd></div>
              <div><dt>Horário</dt><dd>{selectedTime}</dd></div>
              <div><dt>Motivo</dt><dd>{reason.trim()}</dd></div>
            </dl>
            <button type="button" className="is-primary appointment-modal__conclude" onClick={close}>
              Concluir
            </button>
          </div>
        ) : (
          <>
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

            <section className="appointment-modal__calendar" aria-label="Calendário da consulta">
              <div className="appointment-modal__month-navigation">
                <button
                  type="button"
                  aria-label="Mês anterior"
                  disabled={!canGoPrevious}
                  onClick={() =>
                    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1, 12))
                  }
                >
                  <ChevronLeft aria-hidden="true" size={20} />
                </button>
                <strong>{monthFormatter.format(visibleMonth)}</strong>
                <button
                  type="button"
                  aria-label="Próximo mês"
                  onClick={() =>
                    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1, 12))
                  }
                >
                  <ChevronRight aria-hidden="true" size={20} />
                </button>
              </div>
              <div className="appointment-modal__weekdays">
                {weekdays.map((day) => <span key={day}>{day}</span>)}
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
                      className={[
                        sameDay(day, normalizedToday) ? "is-today" : "",
                        selectedDate && sameDay(day, selectedDate) ? "is-selected" : "",
                      ].filter(Boolean).join(" ") || undefined}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(null);
                      }}
                    >
                      {day.getDate()}
                    </button>
                  ) : <span aria-hidden="true" key={`empty-${index}`} />,
                )}
              </div>
            </section>

            {selectedDate && (
              <section className="appointment-modal__times" aria-labelledby={`${titleId}-times`}>
                <h3 id={`${titleId}-times`}>Horários disponíveis</h3>
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
              <button type="button" className="is-secondary" onClick={close}>Cancelar</button>
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
