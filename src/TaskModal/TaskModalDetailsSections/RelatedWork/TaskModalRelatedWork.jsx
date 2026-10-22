import { useState } from 'react';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import { CloseIcon } from '@/shared/ui/icons';
import SectionHeader from '../shared/SectionHeader';
import './TaskModalRelatedWork.scss';

const RELATION_TYPES = ['Parent', 'Related', 'Blocks'];

export default function TaskModalRelatedWork({
  task,
  columns,
  onUpdateTask,
  onRemoveTaskRelation,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [relationType, setRelationType] = useState('Related');
  const [relatedTaskId, setRelatedTaskId] = useState('');
  const [relationError, setRelationError] = useState('');
  const relatedWork = Array.isArray(task.relatedWork) ? task.relatedWork : [];
  const allTasks = columns.flatMap((column) => column.todos.map((todo) => ({
    ...todo,
    columnTitle: column.title,
  })));
  const availableTasks = allTasks.filter((todo) => String(todo.id) !== String(task.id));

  const addRelation = (event) => {
    event.preventDefault();
    if (!relatedTaskId) return;
    const targetTask = availableTasks.find((todo) => String(todo.id) === relatedTaskId);
    if (!targetTask) {
      setRelationError('The selected task is no longer available.');
      return;
    }

    const hasExistingRelation = relatedWork.some((relation) => (
      String(relation.taskId) === relatedTaskId && relation.type === relationType
    ));
    const hasReverseRelatedLink = relationType === 'Related' && allTasks.some((candidate) => (
      String(candidate.id) === relatedTaskId
      && Array.isArray(candidate.relatedWork)
      && candidate.relatedWork.some((relation) => (
        String(relation.taskId) === String(task.id) && relation.type === 'Related'
      ))
    ));
    if (hasExistingRelation || hasReverseRelatedLink) {
      setRelationError('These tasks already have this link.');
      return;
    }

    if (relationType === 'Blocks') {
      const pending = [relatedTaskId];
      const visited = new Set();
      while (pending.length) {
        const currentId = pending.pop();
        if (currentId === String(task.id)) {
          setRelationError('This Blocks link would create a dependency cycle.');
          return;
        }
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        allTasks
          .filter((candidate) => String(candidate.id) === currentId)
          .flatMap((candidate) => (
            Array.isArray(candidate.relatedWork) ? candidate.relatedWork : []
          ))
          .filter((relation) => relation.type === 'Blocks')
          .forEach((relation) => pending.push(String(relation.taskId)));
      }
    }

    onUpdateTask({
      relatedWork: [...relatedWork, {
        id: `${task.id}-${relationType}-${relatedTaskId}`,
        type: relationType,
        taskId: relatedTaskId,
      }],
    });
    setRelationError('');
    setRelatedTaskId('');
    setIsAdding(false);
  };

  const outgoingRows = relatedWork.map((relation) => ({
    key: relation.id || `${relation.type}-${relation.taskId}`,
    relation,
    linkedTask: allTasks.find((candidate) => String(candidate.id) === String(relation.taskId)),
    direction: 'outgoing',
    label: relation.type || 'Related',
  }));
  const incomingRows = allTasks.flatMap((sourceTask) => (
    Array.isArray(sourceTask.relatedWork)
      ? sourceTask.relatedWork
        .filter((relation) => String(relation.taskId) === String(task.id))
        .filter((relation) => !(
          relation.type === 'Related'
          && relatedWork.some((outgoing) => (
            String(outgoing.taskId) === String(sourceTask.id) && outgoing.type === 'Related'
          ))
        ))
        .map((relation) => ({
          key: `${sourceTask.id}-${relation.id || `${relation.type}-${task.id}`}`,
          relation,
          linkedTask: sourceTask,
          direction: 'incoming',
          label: relation.type === 'Blocks'
            ? 'Blocked by'
            : relation.type === 'Parent'
              ? 'Child'
              : 'Related',
        }))
      : []
  ));
  const rowsByGroup = [
    { title: 'Parent', rows: outgoingRows.filter((row) => (row.relation.type || 'Related') === 'Parent') },
    { title: 'Related', rows: [...outgoingRows, ...incomingRows].filter((row) => (row.relation.type || 'Related') === 'Related') },
    { title: 'Blocks', rows: outgoingRows.filter((row) => (row.relation.type || 'Related') === 'Blocks') },
    { title: 'Blocked by', rows: incomingRows.filter((row) => row.relation.type === 'Blocks') },
    { title: 'Children', rows: incomingRows.filter((row) => row.relation.type === 'Parent') },
  ].filter((group) => group.rows.length > 0);
  const pendingBlockers = incomingRows.filter((row) => (
    row.relation.type === 'Blocks' && !row.linkedTask?.isCompleted
  ));

  return (
    <section className="task-modal-section task-modal-related" aria-labelledby="task-related-heading">
      <SectionHeader
        title="Related work"
        id="task-related-heading"
        action={isAdding ? 'Cancel' : 'Add link'}
        onAction={() => setIsAdding((open) => !open)}
      />
      {isAdding && (
        <form className="task-modal-related__form" onSubmit={addRelation}>
          <select
            aria-label="Relationship type"
            value={relationType}
            onChange={(event) => {
              setRelationType(event.target.value);
              setRelationError('');
            }}
          >
            {RELATION_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
          <select
            aria-label="Related task"
            value={relatedTaskId}
            onChange={(event) => {
              setRelatedTaskId(event.target.value);
              setRelationError('');
            }}
          >
            <option value="">Select a task</option>
            {availableTasks.map((relatedTask) => (
              <option key={relatedTask.id} value={relatedTask.id}>{relatedTask.text}</option>
            ))}
          </select>
          <Button type="submit" variant="primary" disabled={!relatedTaskId}>Add</Button>
          <p className="task-modal-related__hint">
            {relationType === 'Blocks'
              ? 'The linked task is blocked until this task is completed.'
              : relationType === 'Related'
                ? 'Related tasks can be worked on in parallel.'
                : 'Link this task to its parent.'}
          </p>
        </form>
      )}
      {relationError && <p className="task-modal-section__error" role="alert">{relationError}</p>}
      {pendingBlockers.length > 0 && (
        <p className="task-modal-related__blocked" role="status">
          This task is blocked until {pendingBlockers.length === 1 ? 'the linked task is' : 'all linked tasks are'} completed.
        </p>
      )}
      {rowsByGroup.length > 0 ? (
        <div className="task-modal-related__groups">
          {rowsByGroup.map((group) => (
            <section className="task-modal-related__group" key={group.title} aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul className="task-modal-related__list">
                {group.rows.map((row) => {
                  const { relation, linkedTask } = row;
                  const status = linkedTask?.isCompleted ? 'Done' : linkedTask?.columnTitle || 'To Do';
                  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
                  const linkedTaskId = linkedTask?.id ?? relation.taskId;
                  return (
                    <li className={`is-${(relation.type || 'Related').toLowerCase()}`} key={row.key}>
                      <span className={`task-modal-related__type is-${(row.label || 'Related').toLowerCase().replace(/\s+/g, '-')}`}>
                        {row.label}
                      </span>
                      <span className="task-modal-related__id">
                        #{linkedTask?.number ?? String(linkedTaskId).slice(-3)}
                      </span>
                      <span className="task-modal-related__title">{linkedTask?.text || 'Task unavailable'}</span>
                      <span className={`task-modal-related__status is-${statusClass}`}>{status}</span>
                      {row.direction === 'outgoing' ? (
                        <IconButton
                          className="task-modal-related__remove"
                          aria-label={`Remove ${relation.type} task link`}
                          onClick={() => onUpdateTask({
                            relatedWork: relatedWork.filter((item) => item !== relation),
                          })}
                        >
                          <img src={CloseIcon} alt="" />
                        </IconButton>
                      ) : (
                        <IconButton
                          className="task-modal-related__remove"
                          aria-label={`Remove ${row.label} link from ${linkedTask?.text || 'task'}`}
                          onClick={() => onRemoveTaskRelation?.(
                            linkedTask?.id,
                            relation.id,
                            task.id,
                            relation.type || 'Related',
                          )}
                        >
                          <img src={CloseIcon} alt="" />
                        </IconButton>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className="task-modal-section__empty">No related work linked.</p>
      )}
    </section>
  );
}
