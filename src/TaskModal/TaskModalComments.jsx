import { useState } from 'react';
import Button from '@/shared/ui/Button';
import './TaskModalComments.scss';

export default function TaskModalComments({ comments = [], onChange }) {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const addComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    onChange([
      ...comments,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, createdAt: new Date().toISOString() },
    ]);
    setCommentText('');
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

    onChange(comments.map((comment) => (
      comment.id === editingCommentId
        ? { ...comment, text, editedAt: new Date().toISOString() }
        : comment
    )));
    cancelEditingComment();
  };

  const deleteComment = (commentId) => {
    onChange(comments.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) cancelEditingComment();
  };

  return (
    <div className="task-modal__comments-panel">
      <h2>Comments ({comments.length})</h2>
      <div className="task-modal__comments-list">
        {comments.map((comment) => (
          <article className="task-modal__comment" key={comment.id}>
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
                <p>{comment.text}</p>
                <div className="task-modal__comment-footer">
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.editedAt && ' · Edited'}
                  </time>
                  <div className="task-modal__comment-actions">
                    <Button
                      className="task-modal__comment-edit"
                      aria-label="Edit comment"
                      onClick={() => startEditingComment(comment)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="task-modal__comment-delete"
                      aria-label="Delete comment"
                      onClick={() => deleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
        {comments.length === 0 && (
          <p className="task-modal__empty-comments">No comments yet.</p>
        )}
      </div>
      <form className="task-modal__comment-form" onSubmit={addComment}>
        <textarea
          aria-label="Write a comment"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />
        <Button type="submit" variant="primary" disabled={!commentText.trim()}>Add comment</Button>
      </form>
    </div>
  );
}
