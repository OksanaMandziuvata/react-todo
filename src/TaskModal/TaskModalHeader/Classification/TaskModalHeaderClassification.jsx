import { ChevronDownIcon } from '@/shared/ui/icons';
import './TaskModalHeaderClassification.scss';

const COMPONENT_OPTIONS = ['Web app', 'Design system', 'API'];

function ClassificationSelect({ label, value, options, onChange }) {
  return (
    <label className="task-modal-header__classification-field">
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
  return (
    <div className="task-modal-header__classification-row">
      <ClassificationSelect
        label="COMPONENT"
        value={task.component || COMPONENT_OPTIONS[0]}
        options={COMPONENT_OPTIONS}
        onChange={(event) => onUpdateTask({ component: event.target.value })}
      />
    </div>
  );
}
