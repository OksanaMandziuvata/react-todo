import TaskModalComments from './TaskModalComments/TaskModalComments';
import TaskModalDescription from './TaskModalDescription/TaskModalDescription';
import TaskModalDetailsSections from './TaskModalDetailsSections';

export default function TaskModalLeftColumn({
  task,
  assignees,
  onUpdateTask,
  onReserveTaskNumber,
}) {
  return (
    <div className="task-modal__main-column" aria-label="Task content">
      <TaskModalDescription
        description={task.description || ''}
        attachments={task.descriptionAttachments || []}
        onDescriptionChange={(description) => onUpdateTask({ description })}
        onAttachmentsChange={(descriptionAttachments) => onUpdateTask({ descriptionAttachments })}
      />
      <TaskModalDetailsSections
        task={task}
        assignees={assignees}
        onUpdateTask={onUpdateTask}
        onReserveTaskNumber={onReserveTaskNumber}
      />
      <TaskModalComments
        comments={task.comments || []}
        onChange={(comments) => onUpdateTask({ comments })}
      />
    </div>
  );
}
