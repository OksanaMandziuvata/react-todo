import { ChevronDownIcon } from '@/shared/ui/icons';
import './TaskModalHeaderClassification.scss';

const COMPONENT_OPTIONS = ['Web app', 'Design system', 'API'];
const SPRINT_OPTIONS = ['Sprint 14 · Oct 7 – Oct 20', 'Sprint 15 · Oct 21 – Nov 3', 'Backlog'];

function ClassificationSelect({ label, className = '', value, options, onChange }) {
  return (
    <label className={`task-modal-header__classification-field ${className}`}>
      <span className="task-modal-header__field-label">{label}</span>
      <span className="task-modal-header__classification-select">
        <select value={value} onChange={onChange} aria-label={label.toLowerCase()}>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <img className="task-modal-header__icon" src={ChevronDownIcon} alt="" />
      </span>
    </label>
  );
}

export default function TaskModalHeaderClassification({ task, onUpdateTask }) {
  const updateSprint = (event) => {
    onUpdateTask({
      planning: { ...(task.planning || {}), sprint: event.target.value },
      sprint: undefined,
    });
  };

  return (
    <div className="task-modal-header__classification-row">
      <ClassificationSelect
        label="SPRINT"
        value={task.planning?.sprint || task.sprint || SPRINT_OPTIONS[0]}
        options={SPRINT_OPTIONS}
        onChange={updateSprint}
      />
      <ClassificationSelect
        label="COMPONENT"
        className="task-modal-header__classification-field--component"
        value={task.component || COMPONENT_OPTIONS[0]}
        options={COMPONENT_OPTIONS}
        onChange={(event) => onUpdateTask({ component: event.target.value })}
      />
    </div>
  );
}
