import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { communityById, type Community } from "../community-data";
import { CommunityPost, type CommunityComment, type CommunityPostData } from "./CommunityPost";
import { PostImagePicker } from "./PostImagePicker";

function createInitialPosts(community: Community): CommunityPostData[] {
  const mainPost: CommunityPostData = {
    id: `${community.id}-principal`,
    initials: community.initials,
    author: community.author,
    publishedAt: "Há 2 horas",
    authorLabel: community.tutorLabel,
    content: community.post,
    tags: [community.tags[0], community.tags[1]],
    image: {
      src: "/assets/figma/community/club-hero.svg",
      alt: `Publicação do ${community.clubTitle}`,
      caption: community.clubTitle,
    },
    likeCount: 12,
    liked: false,
    previousCommentCount: 0,
    comments: [
      {
        id: "salomao-comment-1",
        initials: "MF",
        author: "Marina Freitas",
        content: "Eu escovo o Pipoca todos os dias e ajudou bastante com a queda de pelos.",
        likeCount: 3,
        liked: false,
        replies: [
          {
            id: "salomao-reply-1",
            initials: "SR",
            author: "Salomão Rodrigues",
            content: "Obrigado pela dica! Vou testar a escovação diária com o Balu.",
            likeCount: 0,
            liked: false,
            replies: [],
          },
        ],
      },
      {
        id: "salomao-comment-2",
        initials: "AS",
        author: "Ana Souza",
        content: "Aqui fazemos a escovação dia sim, dia não, sempre com uma escova macia.",
        likeCount: 2,
        liked: false,
      },
      {
        id: "salomao-comment-3",
        initials: "CM",
        author: "Carlos Mendes",
        content: "A escova de banho também funcionou muito bem para o meu caramelo.",
        likeCount: 1,
        liked: false,
      },
      {
        id: "salomao-comment-4",
        initials: "JL",
        author: "Júlia Lima",
        content: "Nos períodos de maior queda, aumentamos a frequência da escovação.",
        likeCount: 4,
        liked: false,
      },
    ],
  };

  return [
    {
      id: `${community.id}-recente`,
      initials: "MF",
      author: "Marina Freitas",
      publishedAt: "Há 1 hora",
      authorLabel: "Tutora do Pipoca",
      content:
        community.id === "caramelo" ? "Passeio tranquilo no parque ao pôr do sol." : community.post,
      tags: [community.tags[0], community.tags[2]],
      likeCount: 0,
      liked: false,
      previousCommentCount: 0,
      comments: [],
    },
    mainPost,
  ];
}

function updateCommentTree(
  comments: CommunityComment[],
  commentId: string,
  update: (comment: CommunityComment) => CommunityComment,
): CommunityComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) return update(comment);
    if (!comment.replies?.length) return comment;
    return {
      ...comment,
      replies: updateCommentTree(comment.replies, commentId, update),
    };
  });
}

export function CaramelClubScreen({
  onBack,
  onNavigate = () => undefined,
  community = communityById.caramelo,
}: {
  onBack: () => void;
  onNavigate?: (destination: MainDestination) => void;
  community?: Community;
}) {
  const { showToast } = useErrorFeedback();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([...community.tags]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([community.tags[0]]);
  const [newTag, setNewTag] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<CommunityPostData[]>(() => createInitialPosts(community));
  const [confirmation, setConfirmation] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const newTagRef = useRef<HTMLInputElement>(null);
  const nextPostIdRef = useRef(1);
  const imageUrlsRef = useRef(new Set<string>());

  useEffect(() => () => {
    imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  });

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
    setPosts((current) => [
      {
        id: `tutor-post-${nextPostIdRef.current++}`,
        initials: "LF",
        author: "Leôncio Ferreira",
        publishedAt: "Agora",
        authorLabel: "Tutor do Balu",
        content: normalized,
        tags: selectedTags,
        image: selectedImageUrl
          ? {
              src: selectedImageUrl,
              alt: "Imagem da publicação de Leôncio Ferreira",
              caption: "Imagem da publicação",
            }
          : undefined,
        likeCount: 0,
        liked: false,
        previousCommentCount: 0,
        comments: [],
      },
      ...current,
    ]);
    setContent("");
    setError("");
    setSelectedTags([community.tags[0]]);
    setSelectedImageUrl(null);
    setComposerOpen(false);
    setConfirmation("Publicação criada com sucesso.");
  };

  const toggleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likeCount: post.likeCount + (post.liked ? -1 : 1),
            }
          : post,
      ),
    );
  };

  const addComment = (postId: string, comment: CommunityComment) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post,
      ),
    );
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: updateCommentTree(post.comments, commentId, (comment) => ({
                ...comment,
                liked: !comment.liked,
                likeCount: comment.likeCount + (comment.liked ? -1 : 1),
              })),
            }
          : post,
      ),
    );
  };

  const addReply = (postId: string, commentId: string, reply: CommunityComment) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: updateCommentTree(post.comments, commentId, (comment) => ({
                ...comment,
                replies: [...(comment.replies ?? []), reply],
              })),
            }
          : post,
      ),
    );
  };

  const toggleSelectedTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const openComposer = () => {
    setSelectedTags([]);
    setComposerOpen(true);
  };

  const removeSelectedImage = () => {
    if (!selectedImageUrl) return;
    URL.revokeObjectURL(selectedImageUrl);
    imageUrlsRef.current.delete(selectedImageUrl);
    setSelectedImageUrl(null);
  };

  const selectImage = (file: File) => {
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
      imageUrlsRef.current.delete(selectedImageUrl);
    }
    const url = URL.createObjectURL(file);
    imageUrlsRef.current.add(url);
    setSelectedImageUrl(url);
  };

  const cancelComposer = () => {
    removeSelectedImage();
    setComposerOpen(false);
  };

  const addTag = () => {
    const name = newTag.trim().replace(/^#+/, "").trim();
    if (!name) {
      showToast("Escreva um nome para a tag.");
      newTagRef.current?.focus();
      return;
    }

    const normalized = `#${name}`;
    if (availableTags.some((tag) => tag.toLocaleLowerCase() === normalized.toLocaleLowerCase())) {
      showToast("Essa tag já existe no clube.");
      newTagRef.current?.focus();
      return;
    }

    setAvailableTags((current) => [...current, normalized]);
    setSelectedTags((current) => [...current, normalized]);
    setNewTag("");
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
          {availableTags.map((tag) => (
            <button
              className={activeTag === tag ? "is-active" : undefined}
              type="button"
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
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
        {posts
          .filter((post) => activeTag === null || post.tags.includes(activeTag))
          .map((post) => (
            <CommunityPost
              key={post.id}
              post={post}
              onToggleLike={toggleLike}
              onToggleCommentLike={toggleCommentLike}
              onAddComment={addComment}
              onAddReply={addReply}
            />
          ))}
        <aside>
          <b>!</b>
          <p>
            Compartilhe rotinas, dicas e experiências com responsabilidade e respeito à comunidade.
          </p>
        </aside>
        <button
          className="caramel-club-screen__add is-cornered"
          type="button"
          aria-label="Criar publicação"
          onClick={openComposer}
        >
          <span className="caramel-club-screen__add-symbol" aria-hidden="true">
            <Plus />
          </span>
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
              <label htmlFor="post-content">
                Conteúdo da publicação
                <span className="caramel-club-screen__required" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                ref={contentRef}
                id="post-content"
                aria-label="Conteúdo da publicação"
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
              <PostImagePicker
                previewUrl={selectedImageUrl}
                onSelect={selectImage}
                onRemove={removeSelectedImage}
              />
              <fieldset className="caramel-club-screen__composer-tags">
                <legend>Tags da publicação</legend>
                <div>
                  {availableTags.map((tag) => (
                    <button
                      type="button"
                      className={selectedTags.includes(tag) ? "is-selected" : undefined}
                      aria-pressed={selectedTags.includes(tag)}
                      onClick={() => toggleSelectedTag(tag)}
                      key={tag}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="caramel-club-screen__new-tag">
                <label htmlFor="new-community-tag">Criar nova tag</label>
                <div>
                  <input
                    ref={newTagRef}
                    id="new-community-tag"
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    placeholder="Ex: Banho"
                  />
                  <button type="button" onClick={addTag}>
                    Adicionar tag
                  </button>
                </div>
              </div>
              <div className="caramel-club-screen__dialog-actions">
                <button type="button" onClick={cancelComposer}>
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
