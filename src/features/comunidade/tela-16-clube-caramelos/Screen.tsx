import { useEffect, useRef, useState } from "react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";

export function CaramelClubScreen({
  onBack,
  onNavigate = () => undefined,
}: {
  onBack: () => void;
  onNavigate?: (destination: MainDestination) => void;
}) {
  const [activeTag, setActiveTag] = useState("#Caramelos");
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
          <h1>Clube dos Caramelos</h1>
        </header>
        <label className="caramel-club-screen__search">
          <img src="/assets/figma/community/search.svg" alt="" />
          <input aria-label="Buscar na comunidade" placeholder="Buscar na comunidade..." />
        </label>
        <div className="caramel-club-screen__tags">
          {["#Caramelos", "#Escovação", "#Passeios"].map((tag) => (
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
        {(activeTag === "#Caramelos" || activeTag === "#Passeios") && (
          <article>
            <div className="caramel-club-screen__author">
              <span>MF</span>
              <div>
                <strong>Marina Freitas</strong>
                <small>Há 1 hora</small>
              </div>
              <b>Tutora do Pipoca</b>
            </div>
            <p>Passeio tranquilo no parque ao pôr do sol.</p>
          </article>
        )}
        {(activeTag === "#Caramelos" || activeTag === "#Escovação") && (
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
              O Balu soltou muito pelo essa semana e a escova de banho ajudou demais. Quem tem pet
              com pelagem parecida usa escovação diária ou dia sim, dia não?
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
