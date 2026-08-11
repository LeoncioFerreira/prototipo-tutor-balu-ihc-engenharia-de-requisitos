import { useEffect, useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PetSectionHeader } from "../../../components/ui/PetSectionHeader";
import { PetDetailsButton } from "../../../components/ui/pet-details-button/PetDetailsButton";

export function WalletScreen({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen?: (screen: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"vacinas" | "consultas" | "exames">("vacinas");
  const [examOpen, setExamOpen] = useState(false);
  const [detail, setDetail] = useState<"antirrabica" | "v10" | "consulta" | null>(null);

  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="wallet-screen" data-figma-node="236:85">
        <PetSectionHeader title="Carteira do Pet" active="wallet" onBack={onBack} onOpen={onOpen} />
        <nav className="wallet-tabs">
          <button
            className={activeTab === "vacinas" ? "active" : ""}
            onClick={() => setActiveTab("vacinas")}
          >
            Vacinas
          </button>
          <button
            className={activeTab === "consultas" ? "active" : ""}
            onClick={() => setActiveTab("consultas")}
          >
            Consultas
          </button>
          <button
            className={activeTab === "exames" ? "active" : ""}
            onClick={() => setActiveTab("exames")}
          >
            Exames
          </button>
        </nav>
        {activeTab === "vacinas" && (
          <>
            <article className="wallet-record">
              <div>
                <h3>Antirrábica</h3>
                <span className="orange">Registrada</span>
              </div>
              <p className="orange-text">Aplicada em 12/06/2026</p>
              <p>Próximo reforço em 2027.</p>
              <PetDetailsButton
                aria-label="Ver detalhes de Antirrábica"
                className="wallet-record-detail"
                onClick={() => setDetail("antirrabica")}
              />
            </article>
            <article className="wallet-record">
              <div>
                <h3>V10 múltipla</h3>
                <span>Agendada</span>
              </div>
              <p>Próxima dose em 25/07/2026</p>
              <p>Reforço anual acompanhado no app.</p>
              <PetDetailsButton
                aria-label="Ver detalhes de V10 múltipla"
                className="wallet-record-detail"
                onClick={() => setDetail("v10")}
              />
            </article>
          </>
        )}
        {activeTab === "consultas" && (
          <article className="wallet-record">
            <div>
              <h3>Consulta Preventiva Anual</h3>
              <span className="orange">Concluída</span>
            </div>
            <p className="orange-text">Realizada em 10/05/2026 com Dra. Mariana</p>
            <p>Check-up de rotina sem alterações críticas.</p>
            <PetDetailsButton
              aria-label="Ver detalhes da Consulta Preventiva Anual"
              className="wallet-record-detail"
              onClick={() => setDetail("consulta")}
            />
          </article>
        )}
        {activeTab === "exames" && (
          <button
            aria-label="Abrir exame Hemograma Completo"
            className="wallet-record wallet-record-button"
            type="button"
            onClick={() => setExamOpen(true)}
          >
            <div>
              <h3>Hemograma Completo</h3>
              <span className="orange">Laudo Disponível</span>
            </div>
            <p className="orange-text">Realizado em 12/05/2026</p>
            <p>Resultados dentro dos padrões de normalidade.</p>
            <PetDetailsButton asSpan className="wallet-record-detail" />
          </button>
        )}
        {examOpen && <ExamDialog onClose={() => setExamOpen(false)} />}
        {detail && <ClinicalRecordDialog detail={detail} onClose={() => setDetail(null)} />}
      </div>
    </MobileShell>
  );
}

function ClinicalRecordDialog({
  detail,
  onClose,
}: {
  detail: "antirrabica" | "v10" | "consulta";
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const handler = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  const isConsultation = detail === "consulta";
  const vaccine =
    detail === "antirrabica"
      ? { name: "Antirrábica", date: "12/06/2026", booster: "2027" }
      : { name: "V10 múltipla", date: "Dose agendada", booster: "25/07/2026" };
  return (
    <div className="wallet-dialog-backdrop">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={isConsultation ? "Detalhes da consulta" : `Detalhes da vacina ${vaccine.name}`}
      >
        <button ref={closeRef} aria-label="Fechar" type="button" onClick={onClose}>
          <X aria-hidden="true" size={19} />
        </button>
        {isConsultation ? (
          <>
            <h2>Detalhes da consulta</h2>
            <dl>
              <div>
                <dt>Consulta</dt>
                <dd>Consulta Preventiva Anual</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>10/05/2026</dd>
              </div>
              <div>
                <dt>Veterinária</dt>
                <dd>Dra. Mariana</dd>
              </div>
              <div>
                <dt>Resumo</dt>
                <dd>Check-up de rotina sem alterações críticas.</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <h2>Detalhes da vacina {vaccine.name}</h2>
            <dl>
              <div>
                <dt>Vacina</dt>
                <dd>{vaccine.name}</dd>
              </div>
              <div>
                <dt>Aplicação</dt>
                <dd>{vaccine.date}</dd>
              </div>
              <div>
                <dt>Próximo reforço</dt>
                <dd>{vaccine.booster}</dd>
              </div>
            </dl>
            <p className="wallet-dialog-warning">
              O Balu não substitui o registro oficial de vacinação.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function ExamDialog({ onClose }: { onClose: () => void }) {
  const [showReport, setShowReport] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="wallet-dialog-backdrop">
      <section
        aria-label={showReport ? "Laudo do Hemograma Completo" : "Detalhes do exame"}
        aria-modal="true"
        role="dialog"
      >
        <button ref={closeRef} aria-label="Fechar" type="button" onClick={onClose}>
          <X aria-hidden="true" size={19} />
        </button>
        {showReport ? (
          <>
            <FileText aria-hidden="true" className="wallet-dialog-icon" size={32} />
            <h2>Laudo do Hemograma Completo</h2>
            <p>
              <strong>Laudo demonstrativo</strong>
            </p>
            <p>Parâmetros hematológicos avaliados dentro dos valores de referência.</p>
            <small>Emitido pela Clínica VetCare em 12/05/2026.</small>
          </>
        ) : (
          <>
            <h2>Detalhes do exame</h2>
            <dl>
              <div>
                <dt>Exame</dt>
                <dd>Hemograma Completo</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>12/05/2026</dd>
              </div>
              <div>
                <dt>Clínica</dt>
                <dd>Clínica VetCare</dd>
              </div>
              <div>
                <dt>Resultado</dt>
                <dd>Resultados dentro dos padrões de normalidade.</dd>
              </div>
            </dl>
            <button
              className="wallet-dialog-primary"
              type="button"
              onClick={() => setShowReport(true)}
            >
              <FileText aria-hidden="true" size={18} />
              Visualizar laudo
            </button>
          </>
        )}
      </section>
    </div>
  );
}
