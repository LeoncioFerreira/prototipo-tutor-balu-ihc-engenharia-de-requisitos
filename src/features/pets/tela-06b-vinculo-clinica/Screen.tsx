import { MobileShell } from "../../../components/ui/MobileShell";
export function ClinicLinkScreen({ onBack }: { onBack: () => void }) {
  return (
    <MobileShell active="home" onNavigate={() => undefined} padded={false}>
      <div className="clinic-link-screen" data-figma-node="587:2">
        <button className="clinic-back" type="button" aria-label="Voltar" onClick={onBack}>
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
        <section className="clinic-card">
          <img className="clinic-avatar" src="/assets/figma/pets/clinic-avatar.svg" alt="" />
          <span className="clinic-avatar-letter">U</span>
          <div>
            <h2>Unipet</h2>
            <p>Clínica veterinária parceira</p>
            <b>Vínculo seguro</b>
          </div>
        </section>
        <button className="accept-link" type="button">
          Aceitar vínculo
        </button>
        <button className="reject-link" type="button">
          Recusar
        </button>
      </div>
    </MobileShell>
  );
}
