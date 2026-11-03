import TaskModalAttachments from './Attachments/TaskModalAttachments';
import TaskModalPeople from './People/TaskModalPeople';
import TaskModalPlanning from './TaskModalPlanning/TaskModalPlanning';
import TaskModalRelatedWork from './RelatedWork/TaskModalRelatedWork';

export default function TaskModalRightColumn({
  task,
  assignees,
  columns,
  onUpdateTask,
  onRemoveTaskRelation,
}) {
  return (
    <aside className="task-modal__sidebar" aria-label="Task information">
      <TaskModalPlanning
        planning={task.planning || {}}
        onChange={(planning) => onUpdateTask({ planning })}
      />
      <TaskModalPeople
        task={task}
        assignees={assignees}
        onUpdateTask={onUpdateTask}
      />
      <TaskModalRelatedWork
        task={task}
        columns={columns}
        onUpdateTask={onUpdateTask}
        onRemoveTaskRelation={onRemoveTaskRelation}
      />
      <TaskModalAttachments
        attachments={task.attachments || []}
        onChange={(attachments) => onUpdateTask({ attachments })}
      />
      <p className="task-modal__updated">
        Created {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '—'}
        {task.createdBy ? ` by ${task.createdBy}` : ''}
        {task.updatedAt && ` · Updated ${new Date(task.updatedAt).toLocaleDateString()}`}
      </p>
    </aside>
  );
}
