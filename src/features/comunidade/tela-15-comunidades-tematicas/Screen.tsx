import { useState } from "react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { communities, communityById } from "../community-data";

export function CommunitiesScreen({
  onNavigate = () => undefined,
  onOpenClub,
  onOpenAll,
}: {
  onNavigate?: (destination: MainDestination) => void;
  onOpenClub?: (screen: string) => void;
  onOpenAll?: () => void;
}) {
  const [selectedId, setSelectedId] = useState("caramelo");
  const selectedCommunity = communityById[selectedId];
  const followedCommunities = communities.filter((community) => community.unlocked);

  return (
    <MobileShell active="community" onNavigate={onNavigate}>
      <div className="communities-screen" data-figma-node="122:8">
        <h1>Comunidades</h1>
        <div className="communities-screen__breed-heading">
          <h2>Minhas raças</h2>
          <button type="button" onClick={onOpenAll}>
            Ver tudo
          </button>
        </div>
        <div className="communities-screen__breeds">
          {followedCommunities.map((community) => (
            <Breed
              key={community.id}
              asset={community.asset}
              label={community.label}
              active={selectedId === community.id}
              onClick={() => setSelectedId(community.id)}
            />
          ))}
        </div>

        <label className="communities-screen__search">
          <img src="/assets/figma/community/search.svg" alt="" />
          <input placeholder="Buscar na comunidade..." aria-label="Buscar na comunidade" />
        </label>

        <article className="communities-screen__club-card">
          <div className="communities-screen__club-title">
            <img
              className="communities-screen__club-logo"
              src={`/assets/figma/community/${selectedCommunity.asset}`}
              alt={`Logo do ${selectedCommunity.clubTitle}`}
            />
            <div>
              <h2>{selectedCommunity.clubTitle}</h2>
              <p>{selectedCommunity.members}</p>
            </div>
          </div>
          <div className="communities-screen__hero-copy">
            <div>
              <h3>{selectedCommunity.headline}</h3>
              <small>Post em destaque</small>
            </div>
            <img src="/assets/figma/community/club-hero.svg" alt="" />
          </div>
          <div className="communities-screen__author">
            <b>{selectedCommunity.initials}</b>
            <span>
              <strong>{selectedCommunity.author}</strong>
              <small>Há 2 horas</small>
            </span>
            <i>{selectedCommunity.tutorLabel}</i>
          </div>
          <p className="communities-screen__post">{selectedCommunity.post}</p>
          <div className="communities-screen__metrics">
            <span>♡ 12 curtidas</span>
            <span>◌ 4 comentários</span>
          </div>
          <button
            className="communities-screen__join"
            onClick={() => onOpenClub?.(selectedCommunity.screen)}
            type="button"
          >
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
