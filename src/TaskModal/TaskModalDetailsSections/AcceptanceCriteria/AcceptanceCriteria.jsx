import { useRef, useState } from 'react';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import { CloseIcon } from '@/shared/ui/icons';
import SectionHeader from '../shared/SectionHeader';
import './AcceptanceCriteria.scss';

export default function AcceptanceCriteria({ items = [], onChange }) {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const newCriterionInput = useRef(null);
  const completed = items.filter((item) => item.completed).length;

  const addCriterion = (event) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    onChange([
      ...items,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        completed: false,
      },
    ]);
    setNewTitle('');
    setIsAdding(false);
  };

  const updateCriterion = (id, updates) => onChange(items.map((item) => (
    item.id === id ? { ...item, ...updates } : item
  )));

  return (
    <section className="task-modal-section task-modal-criteria" aria-labelledby="task-criteria-heading">
      <SectionHeader
        title="Acceptance criteria"
        id="task-criteria-heading"
        action={isAdding ? 'Cancel' : 'Add criterion'}
        onAction={() => {
          setIsAdding((adding) => !adding);
          if (!isAdding) requestAnimationFrame(() => newCriterionInput.current?.focus());
        }}
      />
      <span className="task-modal-section__count">{completed} / {items.length} done</span>
      {items.length > 0 ? (
        <ul className="task-modal-criteria__list">
          {items.map((item) => (
            <li className={item.completed ? 'is-complete' : ''} key={item.id}>
              <input
                type="checkbox"
                checked={Boolean(item.completed)}
                aria-label={`Mark "${item.title}" ${item.completed ? 'incomplete' : 'complete'}`}
                onChange={() => updateCriterion(item.id, { completed: !item.completed })}
              />
              <input
                className="task-modal-criteria__title"
                aria-label="Acceptance criterion"
                value={item.title}
                onChange={(event) => updateCriterion(item.id, { title: event.target.value })}
              />
              <IconButton
                className="task-modal-criteria__remove"
                aria-label={`Remove "${item.title}"`}
                onClick={() => onChange(items.filter((criterion) => criterion.id !== item.id))}
              >
                <img src={CloseIcon} alt="" />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className="task-modal-section__empty">No acceptance criteria yet.</p>
      )}
      {isAdding && (
        <form className="task-modal-section__add-form" onSubmit={addCriterion}>
          <input
            ref={newCriterionInput}
            aria-label="New acceptance criterion"
            placeholder="Add an acceptance criterion"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
          <Button type="submit" variant="primary" disabled={!newTitle.trim()}>Add</Button>
        </form>
      )}
    </section>
  );
}
