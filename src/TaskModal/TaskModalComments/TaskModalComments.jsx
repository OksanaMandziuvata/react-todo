import { useRef, useState } from 'react';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import { AttachmentIcon, CodeIcon, CloseIcon } from '@/shared/ui/icons';
import './TaskModalComments.scss';

const INITIAL_VISIBLE_COMMENTS = 2;
const MAX_COMMENT_ATTACHMENT_SIZE = 1024 * 1024;

function getInitials(name) {
  if (name === 'You') return 'VP';
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function getAvatarClass(name) {
  const member = {
    You: 'current',
    'Olena Kovalenko': 'olena',
    'Andrii Melnyk': 'andrii',
    'Dmytro Shevchenko': 'dmytro',
  }[name] || 'default';
  return `task-modal__comment-avatar task-modal__comment-avatar--${member}`;
}

function formatTimeAgo(dateValue) {
  const timestamp = Date.parse(dateValue);
  if (!Number.isFinite(timestamp)) return 'Just now';
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function TaskModalComments({ comments = [], onChange }) {
  const commentInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const [commentAttachments, setCommentAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const safeComments = Array.isArray(comments) ? comments : [];
  const sortedComments = [...safeComments].sort((first, second) => (
    (Date.parse(second.createdAt) || 0) - (Date.parse(first.createdAt) || 0)
  ));
  const visibleComments = showAllComments
    ? sortedComments
    : sortedComments.slice(0, INITIAL_VISIBLE_COMMENTS);
  const addComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    onChange([
      ...safeComments,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        author: 'You',
        createdAt: new Date().toISOString(),
        replies: [],
        reactions: [],
        attachments: commentAttachments,
      },
    ]);
    setCommentText('');
    setCommentAttachments([]);
  };

  const attachFiles = (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = '';
    if (!files.length) return;

    const oversizedFile = files.find((file) => file.size > MAX_COMMENT_ATTACHMENT_SIZE);
    if (oversizedFile) {
      setAttachmentError(`${oversizedFile.name} is larger than 1 MB.`);
      return;
    }

    setAttachmentError('');
    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error(`Could not read ${file.name}.`));
          return;
        }
        resolve({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          dataUrl: reader.result,
        });
      };
      reader.onerror = () => reject(reader.error || new Error(`Could not read ${file.name}.`));
      reader.readAsDataURL(file);
    }))).then((filesToAttach) => {
      setCommentAttachments((currentAttachments) => [...currentAttachments, ...filesToAttach]);
    }).catch((error) => {
      console.error('Could not read a comment attachment.', error);
      setAttachmentError('Could not read the selected file.');
    });
  };

  const insertCode = () => {
    const textarea = commentInputRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = commentText.slice(start, end);
    const codeText = selectedText ? `\`${selectedText}\`` : '``';
    const nextText = `${commentText.slice(0, start)}${codeText}${commentText.slice(end)}`;
    setCommentText(nextText);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectedText ? start + codeText.length : start + 1;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const saveCommentEdit = (event) => {
    event.preventDefault();
    const text = editingCommentText.trim();
    if (!text) return;

    onChange(safeComments.map((comment) => (
      comment.id === editingCommentId
        ? { ...comment, text, editedAt: new Date().toISOString() }
        : comment
    )));
    cancelEditingComment();
  };

  const deleteComment = (commentId) => {
    onChange(safeComments.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) cancelEditingComment();
  };

  const addReply = (event, commentId) => {
    event.preventDefault();
    const text = replyText.trim();
    if (!text) return;

    onChange(safeComments.map((comment) => (
      comment.id === commentId
        ? {
          ...comment,
          replies: [
            ...(comment.replies || []),
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              text,
              author: 'You',
              createdAt: new Date().toISOString(),
            },
          ],
        }
        : comment
    )));
    setReplyText('');
    setReplyToId(null);
  };

  const toggleReaction = (commentId) => {
    onChange(safeComments.map((comment) => {
      if (comment.id !== commentId) return comment;
      const reactions = comment.reactions || [];
      return {
        ...comment,
        reactions: reactions.includes('You')
          ? reactions.filter((name) => name !== 'You')
          : [...reactions, 'You'],
      };
    }));
  };

  const copyCommentLink = async (commentId) => {
    try {
      await navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#comment-${commentId}`);
    } catch (error) {
      console.error('Could not copy comment link to clipboard.', error);
    }
  };

  return (
    <section className="task-modal__comments-panel" aria-labelledby="task-discussion-heading">
      <h2 id="task-discussion-heading">Discussion</h2>
      <form className="task-modal__comment-form" onSubmit={addComment}>
        <span className={getAvatarClass('You')} aria-hidden="true">{getInitials('You')}</span>
        <div className="task-modal__comment-composer">
          <textarea
            ref={commentInputRef}
            aria-label="Write a comment"
            placeholder="Add a comment... Use @ to mention a teammate, # to link a task"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <div className="task-modal__comment-composer-actions">
            <div className="task-modal__comment-tools">
              <IconButton
                ariaLabel="Attach file"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={AttachmentIcon} alt="" />
              </IconButton>
              <IconButton ariaLabel="Insert code" onClick={insertCode}>
                <img src={CodeIcon} alt="" />
              </IconButton>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                onChange={attachFiles}
              />
            </div>
            <Button type="submit" variant="primary" disabled={!commentText.trim()}>Comment</Button>
          </div>
          {(commentAttachments.length > 0 || attachmentError) && (
            <div className="task-modal__comment-pending-attachments">
              {commentAttachments.map((attachment) => (
                <span key={attachment.id}>
                  <img src={AttachmentIcon} alt="" />
                  {attachment.name}
                  <IconButton
                    className="task-modal__comment-remove-attachment"
                    aria-label={`Remove ${attachment.name}`}
                    onClick={() => setCommentAttachments((currentAttachments) => (
                      currentAttachments.filter((item) => item.id !== attachment.id)
                    ))}
                  >
                    <img src={CloseIcon} alt="" />
                  </IconButton>
                </span>
              ))}
              {attachmentError && <span className="task-modal__comment-attachment-error" role="alert">{attachmentError}</span>}
            </div>
          )}
        </div>
      </form>
      <div className="task-modal__comments-list">
        {visibleComments.map((comment) => {
          const author = comment.author || 'You';
          const reactions = comment.reactions || [];
          const replies = comment.replies || [];
          const isReacted = reactions.includes('You');

          return (
            <article className="task-modal__comment" id={`comment-${comment.id}`} key={comment.id}>
              <span className={getAvatarClass(author)} aria-hidden="true">{getInitials(author)}</span>
              <div className="task-modal__comment-content">
                {editingCommentId === comment.id ? (
                  <form className="task-modal__edit-comment-form" onSubmit={saveCommentEdit}>
                    <textarea
                      aria-label="Edit comment"
                      value={editingCommentText}
                      onChange={(event) => setEditingCommentText(event.target.value)}
                      autoFocus
                    />
                    <div className="task-modal__comment-actions">
                      <Button className="task-modal__comment-cancel" onClick={cancelEditingComment}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" disabled={!editingCommentText.trim()}>
                        Save edit
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="task-modal__comment-byline">
                      <strong>{author}</strong>
                      <time dateTime={comment.createdAt}>
                        {formatTimeAgo(comment.createdAt)}
                        {comment.editedAt && ' · Edited'}
                      </time>
                    </div>
                    <p>{comment.text}</p>
                    {comment.attachments?.length > 0 && (
                      <ul className="task-modal__comment-attachments">
                        {comment.attachments.map((attachment) => (
                          <li key={attachment.id}>
                            <img src={AttachmentIcon} alt="" />
                            <a href={attachment.dataUrl} download={attachment.name}>{attachment.name}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="task-modal__comment-actions">
                      <Button onClick={() => {
                        setReplyToId(replyToId === comment.id ? null : comment.id);
                        setReplyText('');
                      }}>
                        Reply
                      </Button>
                      <Button
                        className={isReacted ? 'is-reacted' : ''}
                        aria-pressed={isReacted}
                        onClick={() => toggleReaction(comment.id)}
                      >
                        {reactions.length ? `👍 ${reactions.length}` : 'React'}
                      </Button>
                      <Button onClick={() => copyCommentLink(comment.id)}>Copy link</Button>
                      {author === 'You' && (
                        <>
                          <Button onClick={() => startEditingComment(comment)}>Edit</Button>
                          <Button
                            className="task-modal__comment-delete"
                            aria-label="Delete comment"
                            onClick={() => deleteComment(comment.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                    {replyToId === comment.id && (
                      <form className="task-modal__reply-form" onSubmit={(event) => addReply(event, comment.id)}>
                        <textarea
                          aria-label={`Reply to ${author}`}
                          placeholder={`Reply to ${author}...`}
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          autoFocus
                        />
                        <Button type="submit" variant="primary" disabled={!replyText.trim()}>Reply</Button>
                      </form>
                    )}
                    {replies.map((reply) => (
                      <div className="task-modal__reply" key={reply.id}>
                        <span className={getAvatarClass(reply.author || 'You')} aria-hidden="true">
                          {getInitials(reply.author || 'You')}
                        </span>
                        <div>
                          <div className="task-modal__comment-byline">
                            <strong>{reply.author || 'You'}</strong>
                            <time dateTime={reply.createdAt}>{formatTimeAgo(reply.createdAt)}</time>
                          </div>
                          <p>{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {sortedComments.length > INITIAL_VISIBLE_COMMENTS && (
        <Button
          className="task-modal__earlier-comments"
          onClick={() => setShowAllComments((showAll) => !showAll)}
        >
          {showAllComments
            ? 'Show fewer comments'
            : `Show ${sortedComments.length - INITIAL_VISIBLE_COMMENTS} earlier comments`}
        </Button>
      )}
    </section>
  );
}
