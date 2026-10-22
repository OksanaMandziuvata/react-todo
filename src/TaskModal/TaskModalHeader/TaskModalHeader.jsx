import TaskModalHeaderClassification from './Classification/TaskModalHeaderClassification';
import TaskModalHeaderMetadata from './Metadata/TaskModalHeaderMetadata';
import TaskModalHeaderTitle from './Title/TaskModalHeaderTitle';
import TaskModalHeaderTopRow from './TopRow/TaskModalHeaderTopRow';
import './TaskModalHeader.scss';

export default function TaskModalHeader({
  task,
  columns,
  assignees,
  isDirty,
  onUpdateTask,
  onSave,
  onSaveAndClose,
  onToggleComments,
  onClose,
  onExpand,
  isExpanded,
}) {
  const updateTask = (updates) => onUpdateTask?.(updates);

  return (
    <header className="task-modal-header">
      <TaskModalHeaderTopRow
        task={task}
        isDirty={isDirty}
        isExpanded={isExpanded}
        onUpdateTask={updateTask}
        onSave={onSave}
        onSaveAndClose={onSaveAndClose}
        onExpand={onExpand}
        onClose={onClose}
      />
      <TaskModalHeaderTitle task={task} onUpdateTask={updateTask} />
      <TaskModalHeaderMetadata
        task={task}
        columns={columns}
        assignees={assignees}
        onUpdateTask={updateTask}
        onToggleComments={onToggleComments}
      />
      <TaskModalHeaderClassification task={task} onUpdateTask={updateTask} />
    </header>
  );
}
