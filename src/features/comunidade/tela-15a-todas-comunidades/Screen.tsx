import { useState } from "react";
import { Lock, Search } from "lucide-react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { communities } from "../community-data";
import "./Screen.scss";

export function AllCommunitiesScreen({
  onBack,
  onOpenClub,
  onNavigate = () => undefined,
}: {
  onBack: () => void;
  onOpenClub: (screen: string) => void;
  onNavigate?: (destination: MainDestination) => void;
}) {
  const [query, setQuery] = useState("");
  const { showToast } = useErrorFeedback();
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = communities.filter((community) =>
    community.label.toLocaleLowerCase("pt-BR").includes(normalizedQuery),
  );

  return (
    <MobileShell active="community" onNavigate={onNavigate}>
      <main className="all-communities-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>Todas as comunidades</h1>
        </header>

        <label className="all-communities-screen__search">
          <Search aria-hidden="true" size={18} />
          <input
            type="search"
            aria-label="Buscar comunidades"
            placeholder="Buscar por raça..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <section className="all-communities-screen__grid" aria-label="Lista de comunidades">
          {filtered.map((community) => (
            <button
              type="button"
              className={community.unlocked ? undefined : "is-locked"}
              aria-label={
                community.unlocked
                  ? `Abrir comunidade ${community.label}`
                  : `Comunidade ${community.label} bloqueada`
              }
              key={community.id}
              onClick={() => {
                if (community.unlocked) {
                  onOpenClub(community.screen);
                  return;
                }
                showToast(
                  `Para entrar nesta comunidade, primeiro cadastre um pet da raça ${community.label}.`,
                );
              }}
            >
              <span className="all-communities-screen__icon">
                <img src={`/assets/figma/community/${community.asset}`} alt="" />
                {!community.unlocked && <Lock aria-hidden="true" size={14} />}
              </span>
              <strong>{community.label}</strong>
              <small>{community.members}</small>
              {!community.unlocked && <em>Cadastre um pet desta raça</em>}
            </button>
          ))}
        </section>
        {filtered.length === 0 && (
          <p className="all-communities-screen__empty">Nenhuma comunidade encontrada.</p>
        )}
      </main>
    </MobileShell>
  );
}
