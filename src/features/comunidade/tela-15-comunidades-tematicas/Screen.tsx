import { useState } from "react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";

export function CommunitiesScreen({
  onNavigate = () => undefined,
  onOpenClub,
}: {
  onNavigate?: (destination: MainDestination) => void;
  onOpenClub?: () => void;
}) {
  const [selectedBreed, setSelectedBreed] = useState("Caramelo");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <MobileShell active="community" onNavigate={onNavigate}>
      <div className="communities-screen" data-figma-node="122:8">
        <h1>Comunidades</h1>
        {toast && (
          <div
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 12,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {toast}
          </div>
        )}
        <div className="communities-screen__breed-heading">
          <h2>Minhas raças</h2>
          <button
            type="button"
            onClick={() => showToast("Exibindo todas as 12 categorias de raças")}
          >
            Ver tudo
          </button>
        </div>
        <div className="communities-screen__breeds">
          <Breed
            asset="breed-caramelo.svg"
            label="Caramelo"
            active={selectedBreed === "Caramelo"}
            onClick={() => {
              setSelectedBreed("Caramelo");
              showToast("Comunidade dos Caramelos selecionada");
            }}
          />
          <Breed
            asset="breed-mutt.svg"
            label="Vira-lata"
            active={selectedBreed === "Vira-lata"}
            onClick={() => {
              setSelectedBreed("Vira-lata");
              showToast("Comunidade dos Vira-latas selecionada");
            }}
          />
          <Breed
            asset="breed-cat.svg"
            label="Gateiros"
            active={selectedBreed === "Gateiros"}
            onClick={() => {
              setSelectedBreed("Gateiros");
              showToast("Comunidade dos Gateiros selecionada");
            }}
          />
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

function Breed({
  asset,
  label,
  active = false,
  onClick,
}: {
  asset: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active ? { borderColor: "#10b981", backgroundColor: "#ecfdf5" } : undefined}
    >
      <span className="communities-screen__breed-icon">
        <img src={`/assets/figma/community/${asset}`} alt="" />
      </span>
      <small style={active ? { fontWeight: 700, color: "#065f46" } : undefined}>{label}</small>
    </button>
  );
}
