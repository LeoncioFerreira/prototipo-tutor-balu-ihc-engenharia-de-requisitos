import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
export function ClinicLinkScreen({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">("pending");

  return (
    <MobileShell active="home" onNavigate={() => undefined} padded={false}>
      <div className="clinic-link-screen" data-figma-node="587:2">
        <button
          className="clinic-back"
          type="button"
          aria-label="Voltar"
          onClick={onBack}
          style={{
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ←
        </button>
        <img className="clinic-badge" src="/assets/figma/pets/shield-paw.svg" alt="" />
        <h1>
          Unipet deseja vincular
          <br />
          você à clínica
        </h1>
        <p className="clinic-description">
          Ao aceitar, a clínica poderá acompanhar informações autorizadas do pet e enviar lembretes,
          orientações e atualizações pelo Balu.
        </p>

        {status === "accepted" && (
          <div
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              padding: "12px 16px",
              borderRadius: 8,
              margin: "12px 0",
              fontWeight: 600,
            }}
          >
            ✓ Vínculo com a clínica Unipet aceito com sucesso!
          </div>
        )}
        {status === "rejected" && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: 8,
              margin: "12px 0",
              fontWeight: 600,
            }}
          >
            ✕ Vínculo com a clínica recusado.
          </div>
        )}

        <section className="clinic-card">
          <img className="clinic-avatar" src="/assets/figma/pets/clinic-avatar.svg" alt="" />
          <span className="clinic-avatar-letter">U</span>
          <div>
            <h2>Unipet</h2>
            <p>Clínica veterinária parceira</p>
            <b>
              {status === "accepted"
                ? "Vínculo ativo"
                : status === "rejected"
                  ? "Vínculo recusado"
                  : "Vínculo seguro"}
            </b>
          </div>
        </section>
        <button
          className="accept-link"
          type="button"
          onClick={() => {
            setStatus("accepted");
            setTimeout(() => onBack(), 1500);
          }}
        >
          {status === "accepted" ? "Vínculo Aceito ✓" : "Aceitar vínculo"}
        </button>
        <button
          className="reject-link"
          type="button"
          onClick={() => {
            setStatus("rejected");
            setTimeout(() => onBack(), 1500);
          }}
        >
          {status === "rejected" ? "Vínculo Recusado" : "Recusar"}
        </button>
      </div>
    </MobileShell>
  );
}
