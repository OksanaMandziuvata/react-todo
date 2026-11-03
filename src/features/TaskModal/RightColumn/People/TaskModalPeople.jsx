import Dropdown from '@/shared/ui/Dropdown';
import SectionHeader from '../../shared/SectionHeader';
import { initials, personAvatarClass } from '../../shared/peopleUtils';
import './TaskModalPeople.scss';

export default function TaskModalPeople({ task, assignees, onUpdateTask }) {
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
          <Dropdown
            value={task.reviewer || ''}
            aria-label="Reviewer"
            onChange={(event) => onUpdateTask({ reviewer: event.target.value })}
          >
            <option value="">Unassigned</option>
            {assignees.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
          </Dropdown>
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
    </section>
  );
}
