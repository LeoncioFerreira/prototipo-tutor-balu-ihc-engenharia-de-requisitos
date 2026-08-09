import { useEffect, useRef, useState } from "react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { communityById, type Community } from "../community-data";

export function CaramelClubScreen({
  onBack,
  onNavigate = () => undefined,
  community = communityById.caramelo,
}: {
  onBack: () => void;
  onNavigate?: (destination: MainDestination) => void;
  community?: Community;
}) {
  const [activeTag, setActiveTag] = useState(community.tags[0]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!composerOpen) return;
    contentRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setComposerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [composerOpen]);

  const publish = () => {
    const normalized = content.trim();
    if (!normalized) {
      setError("Escreva o conteúdo da publicação.");
      contentRef.current?.focus();
      return;
    }
    setPosts((current) => [normalized, ...current]);
    setContent("");
    setError("");
    setComposerOpen(false);
    setConfirmation("Publicação criada com sucesso.");
  };

  return (
    <MobileShell active="community" onNavigate={onNavigate}>
      <div className="caramel-club-screen" data-figma-node="116:2">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>{community.clubTitle}</h1>
        </header>
        <label className="caramel-club-screen__search">
          <img src="/assets/figma/community/search.svg" alt="" />
          <input aria-label="Buscar na comunidade" placeholder="Buscar na comunidade..." />
        </label>
        <div className="caramel-club-screen__tags">
          {community.tags.map((tag) => (
            <button
              className={activeTag === tag ? "is-active" : undefined}
              type="button"
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(tag)}
              key={tag}
            >
              {tag}
            </button>
          ))}
        </div>
        {confirmation && (
          <div className="caramel-club-screen__confirmation" role="status">
            {confirmation}
          </div>
        )}
        {posts.map((post) => (
          <article key={post}>
            <div className="caramel-club-screen__author">
              <span>LF</span>
              <div>
                <strong>Leôncio Ferreira</strong>
                <small>Agora</small>
              </div>
              <b>Tutor do Balu</b>
            </div>
            <p>{post}</p>
          </article>
        ))}
        {(activeTag === community.tags[0] || activeTag === community.tags[2]) && (
          <article>
            <div className="caramel-club-screen__author">
              <span>MF</span>
              <div>
                <strong>Marina Freitas</strong>
                <small>Há 1 hora</small>
              </div>
              <b>Tutora do Pipoca</b>
            </div>
            <p>
              {community.id === "caramelo"
                ? "Passeio tranquilo no parque ao pôr do sol."
                : community.post}
            </p>
          </article>
        )}
        {(activeTag === community.tags[0] || activeTag === community.tags[1]) && (
          <article>
            <div className="caramel-club-screen__author">
              <span>{community.initials}</span>
              <div>
                <strong>{community.author}</strong>
                <small>Há 2 horas</small>
              </div>
              <b>{community.tutorLabel}</b>
            </div>
            <p>{community.post}</p>
            <div className="caramel-club-screen__picture">
              <img
                src="/assets/figma/community/club-hero.svg"
                alt={`Publicação do ${community.clubTitle}`}
              />
              <small>{community.clubTitle}</small>
            </div>
            <div className="caramel-club-screen__metrics">
              <span>12 curtidas</span>
              <span>◌ 4 comentários</span>
            </div>
          </article>
        )}
        <aside>
          <b>!</b>
          <p>
            Compartilhe rotinas, dicas e experiências com responsabilidade e respeito à comunidade.
          </p>
        </aside>
        <button
          className="caramel-club-screen__add"
          type="button"
          aria-label="Criar publicação"
          onClick={() => setComposerOpen(true)}
        >
          +
        </button>
        {composerOpen && (
          <div className="caramel-club-screen__backdrop">
            <section
              className="caramel-club-screen__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-post-title"
            >
              <h2 id="create-post-title">Criar publicação</h2>
              <label htmlFor="post-content">Conteúdo da publicação</label>
              <textarea
                ref={contentRef}
                id="post-content"
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "post-content-error" : undefined}
              />
              {error && (
                <p id="post-content-error" className="caramel-club-screen__error">
                  {error}
                </p>
              )}
              <div>
                <button type="button" onClick={() => setComposerOpen(false)}>
                  Cancelar
                </button>
                <button type="button" onClick={publish}>
                  Publicar
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
