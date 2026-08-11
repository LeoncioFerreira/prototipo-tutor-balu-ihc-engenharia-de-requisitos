import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { ArrowLeft, CalendarClock, ChevronRight, X } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { AppointmentModal } from "../tela-07-meus-pets/AppointmentModal";
import { PetDetailsButton } from "../../../components/ui/pet-details-button/PetDetailsButton";

type ConsultationStatus = "complete" | "cancelled";
type ConsultationFilter = "all" | ConsultationStatus;

const consultationHistory = [
  {
    title: "Consulta preventiva anual",
    date: "10 de maio de 2026 · Dra. Mariana",
    summary: "Check-up de rotina sem alterações críticas.",
    status: "complete",
    statusLabel: "Concluída",
  },
  {
    title: "Consulta odontológica",
    date: "22 de abril de 2026 · Clínica VetCare",
    summary: "Cancelada pela clínica; um novo horário poderá ser solicitado.",
    status: "cancelled",
    statusLabel: "Cancelada",
  },
] as const;

export function ConsultationsScreen({ onBack }: { onBack: () => void }) {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [filter, setFilter] = useState<ConsultationFilter>("all");
  const [attendanceStatus, setAttendanceStatus] = useState<"scheduled" | "confirmed" | "cancelled">(
    "scheduled",
  );
  const [cancellationReason, setCancellationReason] = useState("");
  const [scheduledDate, setScheduledDate] = useState("18 de agosto, às 14:30");
  const { showToast } = useErrorFeedback();
  const appointmentButtonRef = useRef<HTMLButtonElement>(null);
  const detailsButtonRef = useRef<HTMLAnchorElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const rescheduleButtonRef = useRef<HTMLButtonElement>(null);
  const currentHistory = cancellationReason
    ? [
        ...consultationHistory,
        {
          title: "Retorno dermatológico",
          date: "18 de agosto de 2026 · Clínica VetCare",
          summary: cancellationReason,
          status: "cancelled" as const,
          statusLabel: "Cancelada",
        },
      ]
    : consultationHistory;
  const filteredHistory = currentHistory.filter(
    (consultation) => filter === "all" || consultation.status === filter,
  );

  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <main className="consultations-screen">
        <header className="consultations-screen__header pet-section-header">
          <button
            className="consultations-screen__back"
            type="button"
            aria-label="Voltar"
            onClick={onBack}
          >
            <ArrowLeft aria-hidden="true" size={20} strokeWidth={2.5} />
          </button>
          <h1>Consultas</h1>
        </header>

        <section
          className="consultations-screen__pet-card"
          aria-labelledby="consultations-pet-name"
        >
          <img src="/assets/figma/pets/pet-avatar.svg" alt="" />
          <h2 id="consultations-pet-name">Balu</h2>
          <div>
            <span>Samoieda</span>
            <span>2 anos</span>
            <span>22 kg</span>
          </div>
        </section>

        <div
          className="consultations-screen__filters"
          role="group"
          aria-label="Filtrar histórico de consultas"
        >
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            <span>Todas</span>
          </button>
          <button
            type="button"
            aria-pressed={filter === "complete"}
            onClick={() => setFilter("complete")}
          >
            <span>Concluídas</span>
          </button>
          <button
            type="button"
            aria-pressed={filter === "cancelled"}
            onClick={() => setFilter("cancelled")}
          >
            <span>Canceladas</span>
          </button>
        </div>

        {attendanceStatus !== "cancelled" && (
          <section className="consultations-screen__next" aria-labelledby="next-consultation-title">
            <span className="consultations-screen__icon" aria-hidden="true">
              <CalendarClock size={22} />
            </span>
            <div>
              <p>Próxima consulta</p>
              <h2 id="next-consultation-title">Retorno dermatológico</h2>
              <strong>{scheduledDate}</strong>
              <small>Clínica VetCare · Dra. Mariana</small>
              {attendanceStatus === "confirmed" && (
                <span className="consultations-screen__confirmed">Presença confirmada</span>
              )}
              <PetDetailsButton
                anchorRef={detailsButtonRef}
                href="#detalhes-consulta"
                className="consultations-screen__details-link"
                onClick={(event) => {
                  event.preventDefault();
                  setDetailsOpen(true);
                }}
              >
                Ver detalhes
                <ChevronRight aria-hidden="true" size={15} strokeWidth={2.5} />
              </PetDetailsButton>
              <div className="consultations-screen__decision-actions">
                <button
                  ref={rescheduleButtonRef}
                  type="button"
                  className="is-reschedule"
                  onClick={() => setRescheduleOpen(true)}
                >
                  Reagendar consulta
                </button>
                <button
                  type="button"
                  className="is-confirm"
                  onClick={() => {
                    setAttendanceStatus("confirmed");
                    showToast("Presença do Balu confirmada.", "success");
                  }}
                >
                  Confirmar
                </button>
                <button
                  ref={cancelButtonRef}
                  type="button"
                  className="is-cancel"
                  onClick={() => setCancellationOpen(true)}
                >
                  Cancelar
                </button>
              </div>
              <div className="consultations-screen__return-note">
                <b>Retorno agendado</b>
                <span>Leve os resultados do exame de pele para acompanhamento.</span>
              </div>
            </div>
          </section>
        )}

        <section className="consultations-screen__history" aria-labelledby="history-title">
          <div className="consultations-screen__history-heading">
            <h2 id="history-title">Histórico de consultas</h2>
          </div>

          {filteredHistory.map((consultation) => (
            <article key={consultation.title}>
              <div>
                <h3>{consultation.title}</h3>
                <span className={`is-${consultation.status}`}>{consultation.statusLabel}</span>
              </div>
              <p>{consultation.date}</p>
              <small>{consultation.summary}</small>
            </article>
          ))}
        </section>

        <button
          ref={appointmentButtonRef}
          type="button"
          className="consultations-screen__schedule"
          onClick={() => setAppointmentOpen(true)}
        >
          Marcar consulta
        </button>
        {appointmentOpen && (
          <AppointmentModal
            petName="Balu"
            onClose={() => setAppointmentOpen(false)}
            returnFocusRef={appointmentButtonRef}
          />
        )}
        {rescheduleOpen && (
          <AppointmentModal
            mode="reschedule"
            petName="Balu"
            onClose={() => setRescheduleOpen(false)}
            returnFocusRef={rescheduleButtonRef}
            onConfirmed={({ date, time }) => {
              const dateLabel = new Intl.DateTimeFormat("pt-BR", {
                day: "numeric",
                month: "long",
              }).format(date);
              setScheduledDate(`${dateLabel}, às ${time}`);
              setAttendanceStatus("scheduled");
              showToast("Consulta do Balu reagendada.", "success");
            }}
          />
        )}
        {detailsOpen && (
          <ConsultationDetailsModal
            mode="details"
            onClose={() => setDetailsOpen(false)}
            returnFocusRef={detailsButtonRef}
            onCancel={(reason) => {
              setAttendanceStatus("cancelled");
              setCancellationReason(reason);
              showToast("Consulta do Balu cancelada.", "success");
            }}
          />
        )}
        {cancellationOpen && (
          <ConsultationDetailsModal
            mode="cancellation"
            onClose={() => setCancellationOpen(false)}
            returnFocusRef={cancelButtonRef}
            onCancel={(reason) => {
              setAttendanceStatus("cancelled");
              setCancellationReason(reason);
              showToast("Consulta do Balu cancelada.", "success");
            }}
          />
        )}
      </main>
    </MobileShell>
  );
}

function ConsultationDetailsModal({
  onClose,
  returnFocusRef,
  onCancel,
  mode,
}: {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  onCancel: (reason: string) => void;
  mode: "details" | "cancellation";
}) {
  const titleId = useId();
  const reasonErrorId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const { showToast } = useErrorFeedback();
  const close = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mode === "cancellation") reasonRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const confirmCancellation = () => {
    if (!reason.trim()) {
      setReasonError(true);
      reasonRef.current?.focus();
      showToast("Informe o motivo do cancelamento.");
      return;
    }
    onCancel(reason.trim());
    close();
  };

  return (
    <div
      className="consultation-details__backdrop"
      onPointerDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        className="consultation-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header>
          <div>
            <span>Consulta do pet</span>
            <h2 id={titleId}>Detalhes da consulta</h2>
          </div>
          <button ref={closeButtonRef} type="button" aria-label="Fechar detalhes" onClick={close}>
            <X aria-hidden="true" size={20} />
          </button>
        </header>

        {mode === "cancellation" ? (
          <div className="consultation-details__cancellation">
            <p>Conte para a clínica por que a consulta do Balu precisa ser cancelada.</p>
            <label htmlFor={`${titleId}-reason`}>
              Motivo do cancelamento <span aria-hidden="true">*</span>
            </label>
            <textarea
              ref={reasonRef}
              id={`${titleId}-reason`}
              rows={4}
              value={reason}
              aria-invalid={reasonError}
              aria-describedby={reasonError ? reasonErrorId : undefined}
              placeholder="Digite o motivo"
              onChange={(event) => {
                setReason(event.target.value);
                if (reasonError) setReasonError(false);
              }}
            />
            {reasonError && <small id={reasonErrorId}>Informe o motivo do cancelamento.</small>}
            <div className="consultation-details__cancellation-actions">
              <button type="button" onClick={close}>
                Voltar
              </button>
              <button type="button" onClick={confirmCancellation}>
                Confirmar cancelamento
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="consultation-details__pet">
              <img src="/assets/figma/pets/pet-avatar.svg" alt="" />
              <div>
                <span>Pet</span>
                <strong>Balu</strong>
              </div>
            </div>

            <dl>
              <div>
                <dt>Consulta</dt>
                <dd>Retorno dermatológico</dd>
              </div>
              <div>
                <dt>Data e horário</dt>
                <dd>18 de agosto, às 14:30</dd>
              </div>
              <div>
                <dt>Clínica</dt>
                <dd>Clínica VetCare</dd>
              </div>
              <div>
                <dt>Veterinária</dt>
                <dd>Dra. Mariana</dd>
              </div>
              <div>
                <dt>Motivo</dt>
                <dd>Acompanhamento dermatológico</dd>
              </div>
            </dl>

            <div className="consultation-details__orientation">
              <strong>Orientação para o Balu</strong>
              <p>Leve os resultados do exame de pele para acompanhamento.</p>
            </div>

            <button type="button" className="consultation-details__close" onClick={close}>
              Fechar
            </button>
          </>
        )}
      </section>
    </div>
  );
}
