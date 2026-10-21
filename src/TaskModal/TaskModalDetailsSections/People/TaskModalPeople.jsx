import IconButton from '@/shared/ui/IconButton';
import SectionHeader from '../shared/SectionHeader';
import { initials, personAvatarClass } from '../shared/peopleUtils';
import './TaskModalPeople.scss';

export default function TaskModalPeople({ task, assignees, onUpdateTask }) {
  const watchers = task.watchers || [];
  const availableWatchers = assignees.filter((assignee) => !watchers.includes(assignee));

  return (
    <section className="task-modal-section task-modal-people" aria-labelledby="task-people-heading">
      <SectionHeader title="People" id="task-people-heading" />
      <label className="task-modal-people__field">
        <span>Reviewer</span>
        <span className="task-modal-people__reviewer">
          {task.reviewer && (
            <span className={personAvatarClass(task.reviewer)} aria-hidden="true">
              {initials(task.reviewer)}
            </span>
          )}
          <select
            value={task.reviewer || ''}
            aria-label="Reviewer"
            onChange={(event) => onUpdateTask({ reviewer: event.target.value })}
          >
            <option value="">Unassigned</option>
            {assignees.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
          </select>
        </span>
      </label>
      <div className="task-modal-people__field">
        <span>Created by</span>
        <span className="task-modal-people__person">
          <span className={personAvatarClass(task.createdBy || task.assignee)}>
            {initials(task.createdBy || task.assignee)}
          </span>
          {task.createdBy || task.assignee || 'Unknown'}
        </span>
      </div>
      <div className="task-modal-people__field task-modal-people__watchers">
        <span>Watchers</span>
        <div className="task-modal-people__watcher-list">
          {watchers.map((watcher) => (
            <IconButton
              className={personAvatarClass(watcher)}
              key={watcher}
              title={`Remove ${watcher} from watchers`}
              aria-label={`Remove ${watcher} from watchers`}
              onClick={() => onUpdateTask({ watchers: watchers.filter((name) => name !== watcher) })}
            >
              {initials(watcher)}
            </IconButton>
          ))}
          {availableWatchers.length > 0 && (
            <select
              className="task-modal-people__add-watcher"
              value=""
              aria-label="Add watcher"
              onChange={(event) => {
                if (event.target.value) onUpdateTask({ watchers: [...watchers, event.target.value] });
              }}
            >
              <option value="">+</option>
              {availableWatchers.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
            </select>
          )}
          {watchers.length === 0 && <span className="task-modal-people__empty">No watchers</span>}
        </div>
      </div>
    </section>
  );
}
