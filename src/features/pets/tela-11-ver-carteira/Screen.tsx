import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PetSectionHeader } from "../../../components/ui/PetSectionHeader";

export function WalletScreen({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen?: (screen: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"vacinas" | "consultas" | "exames" | "docs">(
    "vacinas",
  );

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
          <button
            className={activeTab === "docs" ? "active" : ""}
            onClick={() => setActiveTab("docs")}
          >
            Docs
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
            </article>
            <article className="wallet-record">
              <div>
                <h3>V10 múltipla</h3>
                <span>Agendada</span>
              </div>
              <p>Próxima dose em 25/07/2026</p>
              <p>Reforço anual acompanhado no app.</p>
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
          </article>
        )}
        {activeTab === "exames" && (
          <article className="wallet-record">
            <div>
              <h3>Hemograma Completo</h3>
              <span className="orange">Laudo Disponível</span>
            </div>
            <p className="orange-text">Realizado em 12/05/2026</p>
            <p>Resultados dentro dos padrões de normalidade.</p>
          </article>
        )}
        {activeTab === "docs" && (
          <article className="wallet-record">
            <div>
              <h3>Autorização de Vínculo Clínico</h3>
              <span className="orange">Ativo</span>
            </div>
            <p className="orange-text">Documento digital gerado em 01/04/2026</p>
            <p>Permissão concedida à Clínica VetCare.</p>
          </article>
        )}
      </div>
    </MobileShell>
  );
}
