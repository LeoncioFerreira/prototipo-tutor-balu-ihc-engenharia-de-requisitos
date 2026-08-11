import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

export type CommunityComment = {
  id: string;
  initials: string;
  author: string;
  content: string;
  likeCount: number;
  liked: boolean;
  replies?: CommunityComment[];
};

export type CommunityPostData = {
  id: string;
  initials: string;
  author: string;
  publishedAt: string;
  authorLabel: string;
  content: string;
  tags: string[];
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
  likeCount: number;
  liked: boolean;
  previousCommentCount: number;
  comments: CommunityComment[];
};

type CommunityPostProps = {
  post: CommunityPostData;
  onToggleLike: (postId: string) => void;
  onToggleCommentLike: (postId: string, commentId: string) => void;
  onAddComment: (postId: string, comment: CommunityComment) => void;
  onAddReply: (postId: string, commentId: string, reply: CommunityComment) => void;
};

function interactionCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function CommentItem({
  comment,
  postId,
  isReply = false,
  onToggleCommentLike,
  onAddReply,
}: {
  comment: CommunityComment;
  postId: string;
  isReply?: boolean;
  onToggleCommentLike: CommunityPostProps["onToggleCommentLike"];
  onAddReply: CommunityPostProps["onAddReply"];
}) {
  const { showToast } = useErrorFeedback();
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const replyFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyOpen) replyFieldRef.current?.focus();
  }, [replyOpen]);

  const publishReply = () => {
    const normalized = reply.trim();
    if (!normalized) {
      showToast("Escreva uma resposta antes de publicar.");
      replyFieldRef.current?.focus();
      return;
    }

    onAddReply(postId, comment.id, {
      id: `${comment.id}-reply-${(comment.replies?.length ?? 0) + 1}`,
      initials: "LF",
      author: "Leôncio Ferreira",
      content: normalized,
      likeCount: 0,
      liked: false,
      replies: [],
    });
    setReply("");
    setReplyOpen(false);
  };

  const body = (
    <>
      <span className="caramel-club-screen__comment-avatar" aria-hidden="true">
        {comment.initials}
      </span>
      <div className="caramel-club-screen__comment-content">
        <strong>{comment.author}</strong>
        <p>{comment.content}</p>
        <div className="caramel-club-screen__comment-actions">
          <button
            className={comment.liked ? "is-liked" : undefined}
            type="button"
            aria-label={`Curtir comentário de ${comment.author}`}
            aria-pressed={comment.liked}
            onClick={() => onToggleCommentLike(postId, comment.id)}
          >
            <Heart aria-hidden="true" fill={comment.liked ? "currentColor" : "none"} />
            {interactionCount(comment.likeCount, "curtida", "curtidas")}
          </button>
          <button
            type="button"
            aria-label={`Responder comentário de ${comment.author}`}
            aria-expanded={replyOpen}
            onClick={() => setReplyOpen((current) => !current)}
          >
            <MessageCircle aria-hidden="true" />
            Responder
          </button>
        </div>
        {replyOpen && (
          <div className="caramel-club-screen__reply-form">
            <label htmlFor={`reply-${postId}-${comment.id}`}>Resposta para {comment.author}</label>
            <textarea
              ref={replyFieldRef}
              id={`reply-${postId}-${comment.id}`}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
            <button type="button" onClick={publishReply}>
              Publicar resposta para {comment.author}
            </button>
          </div>
        )}
        {comment.replies?.map((child) => (
          <CommentItem
            key={child.id}
            comment={child}
            postId={postId}
            isReply
            onToggleCommentLike={onToggleCommentLike}
            onAddReply={onAddReply}
          />
        ))}
      </div>
    </>
  );

  if (isReply) {
    return (
      <div
        className="caramel-club-screen__comment-reply"
        role="group"
        aria-label={`Resposta de ${comment.author}`}
      >
        {body}
      </div>
    );
  }

  return <li>{body}</li>;
}

export function CommunityPost({
  post,
  onToggleLike,
  onToggleCommentLike,
  onAddComment,
  onAddReply,
}: CommunityPostProps) {
  const { showToast } = useErrorFeedback();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const commentFieldRef = useRef<HTMLTextAreaElement>(null);
  const commentsId = `comments-${post.id}`;
  const totalComments = post.previousCommentCount + post.comments.length;

  useEffect(() => {
    if (commentsOpen) commentFieldRef.current?.focus();
  }, [commentsOpen]);

  const publishComment = () => {
    const normalized = comment.trim();
    if (!normalized) {
      showToast("Escreva um comentário antes de publicar.");
      commentFieldRef.current?.focus();
      return;
    }

    onAddComment(post.id, {
      id: `${post.id}-comment-${post.comments.length + 1}`,
      initials: "LF",
      author: "Leôncio Ferreira",
      content: normalized,
      likeCount: 0,
      liked: false,
    });
    setComment("");
  };

  return (
    <article>
      <div className="caramel-club-screen__author">
        <span>{post.initials}</span>
        <div>
          <strong>{post.author}</strong>
          <small>{post.publishedAt}</small>
        </div>
        <b>{post.authorLabel}</b>
      </div>
      <p>{post.content}</p>
      {post.image && (
        <div className="caramel-club-screen__picture">
          <img src={post.image.src} alt={post.image.alt} />
          <small>{post.image.caption}</small>
        </div>
      )}
      <div className="caramel-club-screen__metrics">
        <button
          className={post.liked ? "is-liked" : undefined}
          type="button"
          aria-label="Curtir publicação"
          aria-pressed={post.liked}
          onClick={() => onToggleLike(post.id)}
        >
          <Heart aria-hidden="true" fill={post.liked ? "currentColor" : "none"} />
          {interactionCount(post.likeCount, "curtida", "curtidas")}
        </button>
        <button
          type="button"
          aria-label="Comentários da publicação"
          aria-expanded={commentsOpen}
          aria-controls={commentsId}
          onClick={() => setCommentsOpen((current) => !current)}
        >
          <MessageCircle aria-hidden="true" />
          {interactionCount(totalComments, "comentário", "comentários")}
        </button>
      </div>
      {commentsOpen && (
        <section className="caramel-club-screen__comments" id={commentsId} aria-label="Comentários">
          {post.comments.length > 0 && (
            <ul aria-label="Comentários publicados">
              {post.comments.map((publishedComment) => (
                <CommentItem
                  key={publishedComment.id}
                  comment={publishedComment}
                  postId={post.id}
                  onToggleCommentLike={onToggleCommentLike}
                  onAddReply={onAddReply}
                />
              ))}
            </ul>
          )}
          <label htmlFor={`comment-${post.id}`}>Escrever comentário</label>
          <textarea
            ref={commentFieldRef}
            id={`comment-${post.id}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button type="button" onClick={publishComment}>
            Publicar comentário
          </button>
        </section>
      )}
    </article>
  );
}
