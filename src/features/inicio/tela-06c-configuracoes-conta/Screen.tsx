import { MobileShell } from "../../../components/ui/MobileShell";

export type ExperienceMode = "traditional" | "gamified";

export function AccountSettingsScreen({
  experience,
  onBack,
  onChooseExperience,
}: {
  experience: ExperienceMode;
  onBack: () => void;
  onChooseExperience: () => void;
}) {
  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <div className="account-settings-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <div>
            <h1>Configurações da conta</h1>
            <p>Gerencie seus dados e preferências no Balu.</p>
          </div>
        </header>

        <section className="account-settings-screen__profile">
          <span>L</span>
          <div>
            <strong>Leôncio</strong>
            <p>Conta do tutor principal</p>
          </div>
        </section>

        <section className="account-settings-screen__preferences">
          <h2>Preferências</h2>
          <button type="button" aria-label="Alterar experiência" onClick={onChooseExperience}>
            <span className="account-settings-screen__preference-icon">
              <img src="/assets/figma/inicio/settings-icon.svg" alt="" />
            </span>
            <span>
              <strong>Experiência do aplicativo</strong>
              <small>{experience === "traditional" ? "Tradicional" : "Gamificada"}</small>
            </span>
            <b>›</b>
          </button>
        </section>

        <section className="account-settings-screen__note">
          <strong>Sua experiência, do seu jeito</strong>
          <p>Você pode alternar entre o modo tradicional e o gamificado quando quiser.</p>
        </section>
      </div>
    </MobileShell>
  );
}
