import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";

export function CaramelClubScreen({
  onBack,
  onNavigate = () => undefined,
}: {
  onBack: () => void;
  onNavigate?: (destination: MainDestination) => void;
}) {
  return (
    <MobileShell active="community" onNavigate={onNavigate}>
      <div className="caramel-club-screen" data-figma-node="116:2">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>Clube dos Caramelos</h1>
        </header>
        <label className="caramel-club-screen__search">
          <img src="/assets/figma/community/search.svg" alt="" />
          <input aria-label="Buscar na comunidade" placeholder="Buscar na comunidade..." />
        </label>
        <div className="caramel-club-screen__tags">
          <button className="is-active" type="button">
            #Caramelos
          </button>
          <button type="button">#Escovação</button>
          <button type="button">#Passeios</button>
        </div>
        <article>
          <div className="caramel-club-screen__author">
            <span>SR</span>
            <div>
              <strong>Salomão Rodrigues</strong>
              <small>Há 2 horas</small>
            </div>
            <b>Tutor do Balu</b>
          </div>
          <p>
            O Balu soltou muito pelo essa semana e a escova de banho ajudou demais. Quem tem pet com
            pelagem parecida usa escovação diária ou dia sim, dia não?
          </p>
          <div className="caramel-club-screen__picture">
            <img src="/assets/figma/community/club-hero.svg" alt="Escovação do Balu" />
            <small>Escovação do Balu</small>
          </div>
          <div className="caramel-club-screen__metrics">
            <span>12 curtidas</span>
            <span>◌ 4 comentários</span>
          </div>
        </article>
        <aside>
          <b>!</b>
          <p>
            Compartilhe rotinas, dicas e experiências com responsabilidade e respeito à comunidade.
          </p>
        </aside>
        <button className="caramel-club-screen__add" type="button" aria-label="Criar publicação">
          +
        </button>
      </div>
    </MobileShell>
  );
}
