import { useState } from 'react';
import Button from '@/shared/ui/Button';
import { CloseIcon, CopyIcon, ExpandIcon, MoreIcon } from '@/shared/ui/icons';
import './TaskModalHeader.scss';

const DEFAULT_STATUSES = ['In Progress', 'To Do', 'Done'];

function HeaderIcon({ name }) {
  const icons = {
    copy: CopyIcon,
    more: MoreIcon,
    expand: ExpandIcon,
    close: CloseIcon,
  };

  return (
    <img aria-hidden="true" className="task-modal-header__icon" src={icons[name]} alt="" />
  );
}

export default function TaskModalHeader({
  taskId = '118',
  title: initialTitle = 'Implement drag-and-drop reordering',
  assignee: initialAssignee = 'Olena Kovalenko',
  assigneeOptions = ['Olena Kovalenko'],
  status: initialStatus = 'In Progress',
  statusOptions = DEFAULT_STATUSES,
  commentsCount = 4,
  tags: initialTags = ['frontend', 'ux', 'board'],
  sprint: initialSprint = 'Sprint 14 • Oct 7 – Oct 20',
  sprintOptions = ['Sprint 14 • Oct 7 – Oct 20'],
  component: initialComponent = 'Web app',
  componentOptions = ['Web app'],
  hasUnsavedChanges = true,
  onTitleChange,
  onAssigneeChange,
  onStatusChange,
  onCommentsClick,
  onTagsChange,
  onSprintChange,
  onComponentChange,
  onCopyId,
  onFollow,
  onSave,
  onSaveAndClose,
  onMore,
  onExpand,
  onClose,
  className = '',
}) {
  const [title, setTitle] = useState(initialTitle);
  const [assignee, setAssignee] = useState(initialAssignee);
  const [status, setStatus] = useState(initialStatus);
  const [tags, setTags] = useState(initialTags);
  const [sprint, setSprint] = useState(initialSprint);
  const [component, setComponent] = useState(initialComponent);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const updateValue = (setter, callback) => (event) => {
    const { value } = event.target;
    setter(value);
    callback?.(value);
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag || tags.includes(tag)) {
      setIsAddingTag(false);
      setNewTag('');
      return;
    }
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    onTagsChange?.(updatedTags);
    setNewTag('');
    setIsAddingTag(false);
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onTagsChange?.(updatedTags);
  };

  return (
    <header className={`task-modal-header ${className}`.trim()}>
      <div className="task-modal-header__top-row">
        <div className="task-modal-header__identity">
          <span className="task-modal-header__type">TASK #{taskId}</span>
          <button
            type="button"
            className="task-modal-header__icon-button"
            aria-label={`Copy task ID ${taskId}`}
            onClick={() => onCopyId?.(taskId)}
          >
            <HeaderIcon name="copy" />
          </button>
          {hasUnsavedChanges && (
            <span className="task-modal-header__unsaved">Unsaved changes</span>
          )}
        </div>

        <div className="task-modal-header__actions">
          <Button
            className="task-modal-header__follow"
            variant="secondary"
            aria-pressed={isFollowing}
            onClick={() => {
              const following = !isFollowing;
              setIsFollowing(following);
              onFollow?.(following);
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          <Button variant="secondary" onClick={onSaveAndClose}>Save &amp; Close</Button>
          <Button variant="primary" onClick={onSave}>Save</Button>
          <button type="button" className="task-modal-header__icon-button" aria-label="More actions" onClick={onMore}>
            <HeaderIcon name="more" />
          </button>
          <button type="button" className="task-modal-header__icon-button" aria-label="Expand task details" onClick={onExpand}>
            <HeaderIcon name="expand" />
          </button>
          <button type="button" className="task-modal-header__icon-button" aria-label="Close task details" onClick={onClose}>
            <HeaderIcon name="close" />
          </button>
        </div>
      </div>

      <input
        className="task-modal-header__title"
        aria-label="Task title"
        value={title}
        onChange={updateValue(setTitle, onTitleChange)}
      />

      <div className="task-modal-header__details-row">
        <label className="task-modal-header__field">
          <span className="task-modal-header__field-label">ASSIGNEE</span>
          <span className="task-modal-header__select-wrap">
            <span className="task-modal-header__avatar" aria-hidden="true">OK</span>
            <select value={assignee} onChange={updateValue(setAssignee, onAssigneeChange)} aria-label="Assignee">
              {assigneeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </span>
        </label>

        <label className="task-modal-header__field">
          <span className="task-modal-header__field-label">STATE</span>
          <span className="task-modal-header__select-wrap">
            <span className="task-modal-header__status-dot" aria-hidden="true" />
            <select value={status} onChange={updateValue(setStatus, onStatusChange)} aria-label="State">
              {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </span>
        </label>

        <button type="button" className="task-modal-header__comments" onClick={onCommentsClick}>
          {commentsCount} comments
        </button>

        <div className="task-modal-header__tags" aria-label="Task tags">
          {tags.map((tag) => (
            <span className="task-modal-header__tag" key={tag}>
              {tag}
              <button type="button" aria-label={`Remove ${tag} tag`} onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
          {isAddingTag ? (
            <form
              className="task-modal-header__add-tag-form"
              onSubmit={(event) => {
                event.preventDefault();
                addTag();
              }}
            >
              <input
                className="task-modal-header__tag-input"
                aria-label="New tag"
                autoFocus
                value={newTag}
                onChange={(event) => setNewTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setIsAddingTag(false);
                    setNewTag('');
                  }
                }}
              />
              <button type="submit" className="task-modal-header__add-tag">Add</button>
            </form>
          ) : (
            <button type="button" className="task-modal-header__add-tag" onClick={() => setIsAddingTag(true)}>
              + Add tag
            </button>
          )}
        </div>
      </div>

      <div className="task-modal-header__classification-row">
        <label className="task-modal-header__classification-field">
          <span className="task-modal-header__field-label">SPRINT</span>
          <select value={sprint} onChange={updateValue(setSprint, onSprintChange)} aria-label="Sprint">
            {sprintOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="task-modal-header__classification-field">
          <span className="task-modal-header__field-label">COMPONENT</span>
          <select value={component} onChange={updateValue(setComponent, onComponentChange)} aria-label="Component">
            {componentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>
    </header>
  );
}
