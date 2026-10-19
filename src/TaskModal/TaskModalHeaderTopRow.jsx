import { useState } from 'react';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import {
  CloseIcon,
  CopyIcon,
  ExpandIcon,
  FollowIcon,
  MoreIcon,
  TaskSaveIcon,
} from '@/shared/ui/icons';
import './TaskModalHeaderTopRow.scss';

export default function TaskModalHeaderTopRow({
  task,
  isDirty,
  isExpanded,
  onUpdateTask,
  onSave,
  onSaveAndClose,
  onExpand,
  onClose,
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const shortTaskId = String(task.id).slice(-3);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(String(task.id));
    } catch (error) {
      console.error('Could not copy task ID to clipboard.', error);
    }
  };

  return (
    <div className="task-modal-header__top-row">
      <div className="task-modal-header__identity">
        <span className="task-modal-header__type">
          <span className="task-modal-header__type-mark" aria-hidden="true" />
          TASK
        </span>
        <span className="task-modal-header__id">#{shortTaskId}</span>
        <IconButton
          className="task-modal-header__icon-button"
          ariaLabel={`Copy task ID ${shortTaskId}`}
          onClick={handleCopyId}
        >
          <img className="task-modal-header__icon" src={CopyIcon} alt="" />
        </IconButton>
      </div>

      <span className="task-modal-header__spacer" aria-hidden="true" />
      <span className="task-modal-header__unsaved" aria-live="polite">
        {isDirty ? 'Unsaved changes' : 'All changes saved'}
      </span>

      <div className="task-modal-header__actions">
        <Button
          className="task-modal-header__follow"
          variant="secondary"
          aria-pressed={Boolean(task.isFollowing)}
          onClick={() => onUpdateTask({ isFollowing: !task.isFollowing })}
        >
          <img className="task-modal-header__icon" src={FollowIcon} alt="" />
          {task.isFollowing ? 'Following' : 'Follow'}
        </Button>
        <Button className="task-modal-header__save-close" variant="secondary" onClick={onSaveAndClose}>
          Save &amp; Close
        </Button>
        <Button className="task-modal-header__save" variant="primary" onClick={onSave} disabled={!isDirty}>
          <img className="task-modal-header__icon" src={TaskSaveIcon} alt="" />
          Save
        </Button>
        <IconButton
          className="task-modal-header__icon-button"
          ariaLabel="More actions"
          aria-expanded={isMoreOpen}
          onClick={() => setIsMoreOpen((open) => !open)}
        >
          <img className="task-modal-header__icon" src={MoreIcon} alt="" />
        </IconButton>
        <IconButton
          className="task-modal-header__icon-button"
          ariaLabel={isExpanded ? 'Restore task details size' : 'Expand task details'}
          onClick={onExpand}
        >
          <img className="task-modal-header__icon" src={ExpandIcon} alt="" />
        </IconButton>
        <IconButton
          className="task-modal-header__icon-button"
          ariaLabel="Close task details"
          onClick={onClose}
        >
          <img className="task-modal-header__icon" src={CloseIcon} alt="" />
        </IconButton>
        {isMoreOpen && (
          <div className="task-modal-header__more-menu">
            <Button onClick={handleCopyId}>Copy task ID</Button>
            <Button
              onClick={() => {
                onUpdateTask({ isCompleted: !task.isCompleted });
                setIsMoreOpen(false);
              }}
            >
              {task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
