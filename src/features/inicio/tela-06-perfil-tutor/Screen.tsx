import { MobileShell } from "../../../components/ui/MobileShell";

export function TutorProfileScreen({
  onBack,
  onOpenSettings,
}: {
  onBack: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <div className="tutor-profile-screen" data-figma-node="143:2">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>Perfil do Tutor</h1>
          <button
            className="tutor-profile-screen__header-settings"
            type="button"
            aria-label="Configurações da conta"
            onClick={onOpenSettings}
          >
            <img src="/assets/figma/inicio/settings-button.svg" alt="" />
          </button>
        </header>
        <section className="tutor-profile-screen__identity">
          <span>L</span>
          <h2>Leôncio</h2>
          <div>
            <small>Tutor principal</small>
            <small>3 pets</small>
            <small>2 co-tutores</small>
          </div>
        </section>
        <section className="tutor-profile-screen__account">
          <div>
            <strong>Resumo da conta</strong>
            <span>Ativa</span>
          </div>
          <p>Conta criada e configuração inicial em andamento.</p>
          <p>Gerencie dados pessoais, pets e preferências por aqui.</p>
          <small>Tutor verificado</small>
        </section>
        <section className="tutor-profile-screen__next">
          <div>
            <strong>Próximo passo</strong>
            <span>Importante</span>
          </div>
          <p>Acesse Meus pets para abrir o perfil de cada animal e o cuidado compartilhado.</p>
        </section>
        <button className="tutor-profile-screen__settings" type="button" onClick={onOpenSettings}>
          <img src="/assets/figma/inicio/settings-icon.svg" alt="" />
          Configurações da conta
        </button>
      </div>
    </MobileShell>
  );
}
