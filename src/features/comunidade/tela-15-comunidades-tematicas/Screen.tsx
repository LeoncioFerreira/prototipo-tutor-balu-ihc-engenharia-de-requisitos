import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";

export function CommunitiesScreen({
  onNavigate = () => undefined,
  onOpenClub,
}: {
  onNavigate?: (destination: MainDestination) => void;
  onOpenClub?: () => void;
}) {
  return (
    <MobileShell active="community" onNavigate={onNavigate}>
      <div className="communities-screen" data-figma-node="122:8">
        <h1>Comunidades</h1>
        <div className="communities-screen__breed-heading">
          <h2>Minhas raças</h2>
          <button type="button">Ver tudo</button>
        </div>
        <div className="communities-screen__breeds">
          <Breed asset="breed-caramelo.svg" label="Caramelo" />
          <Breed asset="breed-mutt.svg" label="Vira-lata" />
          <Breed asset="breed-cat.svg" label="Gateiros" />
          <Breed label="Adicionar" add />
        </div>

        <label className="communities-screen__search">
          <img src="/assets/figma/community/search.svg" alt="" />
          <input placeholder="Buscar na comunidade..." aria-label="Buscar na comunidade" />
        </label>

        <article className="communities-screen__club-card">
          <div className="communities-screen__club-title">
            <img
              className="communities-screen__club-logo"
              src="/assets/figma/community/breed-caramelo.svg"
              alt="Logo do Clube dos Caramelos"
            />
            <div>
              <h2>Clube dos Caramelos</h2>
              <p>2,4 mil membros</p>
            </div>
          </div>
          <div className="communities-screen__hero-copy">
            <div>
              <h3>Uma comunidade para trocar dicas, rotina e cuidado com caramelos</h3>
              <small>Post em destaque</small>
            </div>
            <img src="/assets/figma/community/club-hero.svg" alt="" />
          </div>
          <div className="communities-screen__author">
            <b>SR</b>
            <span>
              <strong>Salomão Rodrigues</strong>
              <small>Há 2 horas</small>
            </span>
            <i>Tutor do Balu</i>
          </div>
          <p className="communities-screen__post">
            O Balu soltou muito pelo essa semana e a escova de banho ajudou demais. Quem tem pet com
            pelagem parecida usa escovação diária ou dia sim, dia não?
          </p>
          <div className="communities-screen__metrics">
            <span>♡ 12 curtidas</span>
            <span>◌ 4 comentários</span>
          </div>
          <button className="communities-screen__join" onClick={onOpenClub} type="button">
            Entrar no clube
          </button>
        </article>
      </div>
    </MobileShell>
  );
}

function Breed({ asset, label, add = false }: { asset?: string; label: string; add?: boolean }) {
  return (
    <button type="button">
      <span className="communities-screen__breed-icon">
        {add ? "+" : <img src={`/assets/figma/community/${asset}`} alt="" />}
      </span>
      <small>{label}</small>
    </button>
  );
}
