import { useState } from 'react';
import { CalendarIcon, ChevronDownIcon, PriorityIcon, TimerIcon } from '@/shared/ui/icons';
import './TaskModalPlanning.scss';

const PRIORITIES = [
  { value: 'Low', label: '0 – Low' },
  { value: 'Medium', label: '1 – Medium' },
  { value: 'High', label: '2 – High' },
  { value: 'Urgent', label: '3 – Urgent' },
];
function formatHours(value) {
  const hours = Number(value);
  return Number.isFinite(hours) ? `${hours} h` : '0 h';
}

function getDueDateLabel(value) {
  if (!value) return '';
  const dueDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / 86400000);
  if (daysUntilDue < 0) return 'Overdue';
  if (daysUntilDue === 0) return 'Due today';
  return `in ${daysUntilDue} days`;
}

export default function TaskModalPlanning({ planning, onChange }) {
  const [priority, setPriority] = useState(planning.priority || 'High');
  const estimate = Number(planning.estimate) || 0;
  const completedWork = Number(planning.completedWork) || 0;
  const remaining = Math.max(estimate - completedWork, 0);
  const progress = estimate > 0 ? Math.min((completedWork / estimate) * 100, 100) : 0;

  const updatePlanning = (updates) => {
    const nextPlanning = { ...planning, ...updates };
    onChange(nextPlanning);
  };

  const changePriority = (event) => {
    setPriority(event.target.value);
    updatePlanning({ priority: event.target.value });
  };

  return (
    <section className="task-modal-planning" aria-labelledby="task-planning-heading">
      <h2 id="task-planning-heading">Planning</h2>
      <label className="task-modal-planning__field">
        <span>Priority</span>
        <span className="task-modal-planning__priority">
          <img src={PriorityIcon} alt="" />
          <select value={priority} onChange={changePriority} aria-label="Priority">
            {PRIORITIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <img className="task-modal-planning__chevron" src={ChevronDownIcon} alt="" />
        </span>
      </label>
      <label className="task-modal-planning__field">
        <span>Original estimate</span>
        <span className="task-modal-planning__number-wrap">
          <input
            type="number"
            min="0"
            step="0.5"
            value={planning.estimate ?? ''}
            placeholder="0"
            aria-label="Original estimate in hours"
            onChange={(event) => updatePlanning({ estimate: event.target.value })}
          />
          <span>h</span>
        </span>
      </label>
      <label className="task-modal-planning__field">
        <span>Completed work</span>
        <span className="task-modal-planning__number-wrap">
          <input
            type="number"
            min="0"
            step="0.5"
            value={planning.completedWork ?? ''}
            placeholder="0"
            aria-label="Completed work in hours"
            onChange={(event) => updatePlanning({ completedWork: event.target.value })}
          />
          <span>h</span>
        </span>
      </label>
      <div className="task-modal-planning__tracking" aria-label={`Time tracking: ${formatHours(completedWork)} logged, ${formatHours(remaining)} left`}>
        <div className="task-modal-planning__tracking-label">
          <span><img src={TimerIcon} alt="" />Time tracking</span>
          <span>{formatHours(completedWork)} logged · {formatHours(remaining)} left</span>
        </div>
        <div className="task-modal-planning__progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <label className="task-modal-planning__field">
        <span>Start date</span>
        <span className="task-modal-planning__date">
          <img src={CalendarIcon} alt="" />
          <input
            type="date"
            value={planning.startDate || ''}
            aria-label="Start date"
            onChange={(event) => updatePlanning({ startDate: event.target.value })}
          />
          <img className="task-modal-planning__chevron" src={ChevronDownIcon} alt="" />
        </span>
      </label>
      <label className="task-modal-planning__field">
        <span>Due date</span>
        <span className="task-modal-planning__date">
          <img src={CalendarIcon} alt="" />
          <input
            type="date"
            value={planning.dueDate || ''}
            aria-label="Due date"
            onChange={(event) => updatePlanning({ dueDate: event.target.value })}
          />
          {planning.dueDate && <span className="task-modal-planning__due-chip">{getDueDateLabel(planning.dueDate)}</span>}
          <img className="task-modal-planning__chevron" src={ChevronDownIcon} alt="" />
        </span>
      </label>
    </section>
  );
}
