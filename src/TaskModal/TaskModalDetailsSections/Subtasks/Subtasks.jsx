import { useRef, useState } from 'react';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import { CloseIcon } from '@/shared/ui/icons';
import SectionHeader from '../shared/SectionHeader';
import { initials, personAvatarClass } from '../shared/peopleUtils';
import './Subtasks.scss';

const SUBTASK_STATES = ['To Do', 'In Progress', 'Done'];

export default function Subtasks({ items = [], assignees, onChange, onReserveTaskNumber }) {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const newSubtaskInput = useRef(null);
  const completed = items.filter((item) => item.state === 'Done' || item.completed).length;

  const addSubtask = (event) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const number = onReserveTaskNumber?.();
    if (!number) return;
    onChange([
      ...items,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        number,
        title,
        state: 'To Do',
        assignee: '',
        estimate: '',
      },
    ]);
    setNewTitle('');
    setIsAdding(false);
  };

  const updateSubtask = (id, updates) => onChange(items.map((item) => (
    item.id === id ? { ...item, ...updates, completed: updates.state === 'Done' } : item
  )));

  return (
    <section className="task-modal-section task-modal-subtasks" aria-labelledby="task-subtasks-heading">
      <SectionHeader
        title="Subtasks"
        id="task-subtasks-heading"
        action={isAdding ? 'Cancel' : 'Add subtask'}
        onAction={() => {
          setIsAdding((adding) => !adding);
          if (!isAdding) requestAnimationFrame(() => newSubtaskInput.current?.focus());
        }}
      />
      {items.length > 0 && (
        <>
          <div className="task-modal-subtasks__progress">
            <span><span style={{ width: `${(completed / items.length) * 100}%` }} /></span>
            <small>{completed} of {items.length} done</small>
          </div>
          <div className="task-modal-subtasks__table" role="table" aria-label="Subtasks">
            <div className="task-modal-subtasks__row task-modal-subtasks__row--heading" role="row">
              <span role="columnheader">Title</span>
              <span role="columnheader">Assignee</span>
              <span role="columnheader">Estimate</span>
              <span role="columnheader">State</span>
              <span aria-hidden="true" />
            </div>
            {items.map((item, index) => {
              const state = item.state || (item.completed ? 'Done' : 'To Do');
              return (
                <div className="task-modal-subtasks__row" role="row" key={item.id}>
                  <label className={`task-modal-subtasks__title${state === 'Done' ? ' is-complete' : ''}`} role="cell">
                    <input
                      type="checkbox"
                      checked={state === 'Done'}
                      aria-label={`Mark subtask "${item.title}" ${state === 'Done' ? 'incomplete' : 'complete'}`}
                      onChange={() => updateSubtask(item.id, { state: state === 'Done' ? 'To Do' : 'Done' })}
                    />
                    <span className="task-modal-subtasks__id">#{item.number ?? index + 1}</span>
                    <input
                      className="task-modal-subtasks__name"
                      aria-label="Subtask title"
                      value={item.title}
                      onChange={(event) => updateSubtask(item.id, { title: event.target.value })}
                    />
                  </label>
                  <label className="task-modal-subtasks__assignee" role="cell">
                    <span className={personAvatarClass(item.assignee)}>
                      {item.assignee ? initials(item.assignee) : '+'}
                    </span>
                    <select
                      aria-label={`Assignee for ${item.title}`}
                      value={item.assignee || ''}
                      onChange={(event) => updateSubtask(item.id, { assignee: event.target.value })}
                    >
                      <option value="">Unassigned</option>
                      {assignees.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
                    </select>
                  </label>
                  <label className="task-modal-subtasks__estimate" role="cell">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      aria-label={`Estimate for ${item.title} in hours`}
                      value={item.estimate ?? ''}
                      onChange={(event) => updateSubtask(item.id, { estimate: event.target.value })}
                    />
                    <span>h</span>
                  </label>
                  <label
                    className={`task-modal-subtasks__state task-modal-subtasks__state--${state.toLowerCase().replace(/\s+/g, '-')}`}
                    role="cell"
                  >
                    <select
                      aria-label={`State for ${item.title}`}
                      value={state}
                      onChange={(event) => updateSubtask(item.id, { state: event.target.value })}
                    >
                      {SUBTASK_STATES.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <IconButton
                    className="task-modal-subtasks__remove"
                    aria-label={`Remove subtask "${item.title}"`}
                    onClick={() => onChange(items.filter((subtask) => subtask.id !== item.id))}
                  >
                    <img src={CloseIcon} alt="" />
                  </IconButton>
                </div>
              );
            })}
          </div>
        </>
      )}
      {items.length === 0 && <p className="task-modal-section__empty">No subtasks yet.</p>}
      {isAdding && (
        <form className="task-modal-section__add-form" onSubmit={addSubtask}>
          <input
            ref={newSubtaskInput}
            aria-label="New subtask title"
            placeholder="Add a subtask"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
          <Button type="submit" variant="primary" disabled={!newTitle.trim()}>Add</Button>
        </form>
      )}
    </section>
  );
}
