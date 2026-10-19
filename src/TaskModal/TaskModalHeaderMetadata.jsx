import { useState } from 'react';
import {
  ChevronDownIcon,
  CloseIcon,
  CommentsIcon,
  PlusIcon,
} from '@/shared/ui/icons';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import './TaskModalHeaderMetadata.scss';

const DEFAULT_TASK_TAGS = ['frontend', 'ux', 'board'];

export default function TaskModalHeaderMetadata({
  task,
  columns,
  assignees,
  onUpdateTask,
  onToggleComments,
}) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const taskTags = task.tags ?? DEFAULT_TASK_TAGS;
  const taskComments = task.comments ?? [];

  const addTag = (event) => {
    event.preventDefault();
    const tag = newTag.trim();
    if (tag && !taskTags.includes(tag)) onUpdateTask({ tags: [...taskTags, tag] });
    setNewTag('');
    setIsAddingTag(false);
  };

  const removeTag = (tagToRemove) => {
    onUpdateTask({ tags: taskTags.filter((tag) => tag !== tagToRemove) });
  };

  return (
    <div className="task-modal-header__details-row">
      <label className="task-modal-header__select-wrap task-modal-header__assignee">
        <span className="task-modal-header__avatar" aria-hidden="true">
          {(task.assignee || 'Unassigned')
            .split(/\s+/)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <select
          value={task.assignee || ''}
          onChange={(event) => onUpdateTask({ assignee: event.target.value })}
          aria-label="Assignee"
        >
          <option value="">Unassigned</option>
          {assignees.map((assignee) => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>
        <img className="task-modal-header__icon" src={ChevronDownIcon} alt="" />
      </label>

      <label className="task-modal-header__select-wrap task-modal-header__state">
        <span className="task-modal-header__status-dot" aria-hidden="true" />
        <select
          value={String(task.columnId)}
          onChange={(event) => onUpdateTask({ columnId: event.target.value })}
          aria-label="State"
        >
          {columns.map((column) => (
            <option key={column.id} value={String(column.id)}>{column.title}</option>
          ))}
        </select>
        <img className="task-modal-header__icon" src={ChevronDownIcon} alt="" />
      </label>

      <span className="task-modal-header__divider" aria-hidden="true" />
      <Button className="task-modal-header__comments" onClick={onToggleComments}>
        <img className="task-modal-header__icon" src={CommentsIcon} alt="" />
        <span>{taskComments.length} comments</span>
      </Button>

      <span className="task-modal-header__divider" aria-hidden="true" />
      <div className="task-modal-header__tags" aria-label="Task tags">
        {taskTags.map((tag) => (
          <span className="task-modal-header__tag" data-tag={tag.toLowerCase()} key={tag}>
            {tag}
            <IconButton ariaLabel={`Remove ${tag} tag`} onClick={() => removeTag(tag)}>
              <img className="task-modal-header__remove-tag-icon" src={CloseIcon} alt="" />
            </IconButton>
          </span>
        ))}
        {isAddingTag ? (
          <form className="task-modal-header__add-tag-form" onSubmit={addTag}>
            <input
              className="task-modal-header__tag-input"
              aria-label="New tag"
              autoFocus
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation();
                  setIsAddingTag(false);
                  setNewTag('');
                }
              }}
            />
            <Button type="submit" className="task-modal-header__add-tag">Add</Button>
          </form>
        ) : (
          <Button className="task-modal-header__add-tag" onClick={() => setIsAddingTag(true)}>
            <img className="task-modal-header__icon" src={PlusIcon} alt="" />
            Add tag
          </Button>
        )}
      </div>
    </div>
  );
}
